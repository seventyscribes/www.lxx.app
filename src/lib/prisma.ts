/**
 * Prisma Client Singleton
 *
 * This file provides a singleton instance of the Prisma client to prevent
 * multiple instances during development with hot reloading.
 *
 * Before using this file, run:
 * - npx prisma generate
 * - npx prisma migrate dev
 *
 * See: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

// Uncomment the following code after running `npx prisma generate`:
/*
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
*/

// Placeholder export until Prisma is generated
export const prisma = null;
export default prisma;
