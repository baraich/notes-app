"use client";

import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullScreenLoaderProps {
  className?: string;
  backgroundClassName?: string;
}

export default function FullScreenLoader({
  className,
  backgroundClassName,
}: FullScreenLoaderProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-screen w-full items-center justify-center",
        backgroundClassName ?? "bg-zinc-950",
        className,
      )}
    >
      <Loader2Icon className="animate-spin text-zinc-400" />
    </div>
  );
}
