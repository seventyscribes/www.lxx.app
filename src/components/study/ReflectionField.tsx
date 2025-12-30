"use client";

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui";

interface ReflectionFieldProps {
  prompt: string;
  index: number;
  initialValue: string;
  onSave: (val: string) => void;
}

export function ReflectionField({
  prompt,
  index,
  initialValue,
  onSave,
}: ReflectionFieldProps) {
  const [localValue, setLocalValue] = useState(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSave(val), 800);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4 items-start">
        <div className="w-6 h-6 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gold/60">
          {index + 1}
        </div>
        <p className="text-[14px] text-charcoal/80 font-semibold leading-relaxed font-sans">
          {prompt}
        </p>
      </div>
      <Textarea
        value={localValue}
        onChange={handleChange}
        placeholder="Write your reflection here..."
      />
    </div>
  );
}
