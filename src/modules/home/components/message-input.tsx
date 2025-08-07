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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 flex items-center shadow-sm">
        <Textarea
          className="flex-1 bg-transparent border-0 text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-0 shadow-none"
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
          className="text-white bg-zinc-800 hover:bg-zinc-700 ml-2"
        >
          <SendIcon />
        </Button>
      </div>
      <p className="text-xs text-zinc-500 text-center mt-2">
        Your conversations are processed by AI. Please review our{" "}
        <Link href="/privacy-and-terms" className="underline">
          Privacy & Terms
        </Link>
        .
      </p>
    </div>
  );
}
