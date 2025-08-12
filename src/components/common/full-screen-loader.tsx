"use client";

import { cn } from "@/lib/utils";
import InlineSpinner from "./inline-spinner";

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
      <InlineSpinner className="text-zinc-400" />
    </div>
  );
}
