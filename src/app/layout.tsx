import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LXX Bible Study",
  description: "A 365-day guided Bible study with daily scripture reading, modern summaries, and reflective journaling.",
  keywords: ["Bible study", "KJV", "daily devotional", "journaling", "scripture"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-parchment min-h-screen">
        {children}
      </body>
    </html>
  );
}
