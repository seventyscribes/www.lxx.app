"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Container({ children, className, noPadding }: ContainerProps) {
  return (
    <div
      className={cn(
        "max-w-2xl mx-auto",
        !noPadding && "px-6 py-10 pb-40",
        className
      )}
    >
      {children}
    </div>
  );
}
