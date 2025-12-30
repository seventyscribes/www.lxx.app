"use client";

import { BottomNav } from "@/components/layout";
import { ProgressProvider } from "@/lib/context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <div className="flex flex-col min-h-screen bg-parchment overflow-x-hidden">
        <div className="flex-grow pb-24">{children}</div>
        <BottomNav />
      </div>
    </ProgressProvider>
  );
}
