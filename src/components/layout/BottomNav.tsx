"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TabId = "today" | "progress" | "account";

interface NavItem {
  id: TabId;
  label: string;
  href: string;
  icon: React.ReactNode;
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-5z" />
      <path d="M6.5 17.5c-1.38 0-2.5 1.12-2.5 2.5" />
      <path d="M12 6h5" />
      <path d="M12 10h5" />
      <path d="M12 14h5" />
    </svg>
  );
}

function PathIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m20 10-8 8-4-4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { id: "today", label: "Today", href: "/today", icon: <BookIcon /> },
  { id: "progress", label: "Progress", href: "/progress", icon: <PathIcon /> },
  { id: "account", label: "Settings", href: "/account", icon: <UserIcon /> },
];

export function BottomNav() {
  const pathname = usePathname();

  const getActiveTab = (): TabId => {
    if (pathname.startsWith("/progress")) return "progress";
    if (pathname.startsWith("/account")) return "account";
    return "today";
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around h-20 px-6 pb-safe safe-area-inset-bottom z-50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300",
              isActive ? "text-gold scale-110" : "text-gray-400 opacity-60"
            )}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
