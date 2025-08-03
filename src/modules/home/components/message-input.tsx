"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: (value: string) => void;
}

export default function MessageInput({
  value,
  setValue,
  onSubmit,
}: Props) {
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
              onSubmit(value);
            }
          }}
        />
        <Button
          size="icon"
          onClick={() => onSubmit(value)}
          className="text-white bg-zinc-800 hover:bg-zinc-700 ml-2"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}
