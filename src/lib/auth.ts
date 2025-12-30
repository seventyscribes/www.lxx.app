import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Set trial end date for new users (+7 days)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      await prisma.user.update({
        where: { id: user.id },
        data: { trialEndDate },
      });

      // Create initial progress record
      await prisma.userProgress.create({
        data: {
          userId: user.id!,
          currentDay: 1,
          completedDayIds: [],
          streakCount: 0,
          longestStreak: 0,
        },
      });

      // Create initial settings record
      await prisma.userSettings.create({
        data: {
          userId: user.id!,
          fontSize: "base",
          fontFamily: "serif",
          showSummaries: true,
        },
      });
    },
  },
});

// Helper to check if user has active subscription or trial
export async function checkUserAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) return { hasAccess: false, reason: "User not found" };

  // Check for active subscription
  if (user.subscription?.status === "active") {
    return { hasAccess: true, reason: "Active subscription" };
  }

  // Check trial period
  if (user.trialEndDate && new Date() < user.trialEndDate) {
    const daysRemaining = Math.ceil(
      (user.trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return { hasAccess: true, reason: "Trial active", daysRemaining };
  }

  return { hasAccess: false, reason: "Trial expired" };
}
