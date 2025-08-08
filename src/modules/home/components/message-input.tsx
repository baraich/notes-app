"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ disabled, onSubmit }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (disabled || !value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="w-full">
      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-sm">
        <Textarea
          className="min-h-0 flex-1 resize-none border-0 bg-transparent text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Ask me anything..."
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button
          size="icon"
          disabled={disabled || !value.trim()}
          onClick={handleSubmit}
          className="ml-2 bg-zinc-800 text-white hover:bg-zinc-700"
        >
          <SendIcon />
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-zinc-500">
        Your conversations are processed by AI. Please review our{" "}
        <Link href="/privacy-and-terms" className="underline">
          Privacy & Terms
        </Link>
        .
      </p>
    </div>
  );
}
