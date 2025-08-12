"use client";

import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineSpinnerProps {
  className?: string;
}

export default function InlineSpinner({ className }: InlineSpinnerProps) {
  return <Loader2Icon className={cn("animate-spin", className)} />;
}
