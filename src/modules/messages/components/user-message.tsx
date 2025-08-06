import { RefObject } from "react";

interface UserMessageProps {
  content: string;
  messageStartRef: RefObject<HTMLDivElement | null>;
}

export default function UserMessage({
  content,
  messageStartRef,
}: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-start">
        <div className="flex flex-col items-end gap-2">
          <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg max-w-full">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
        </div>
        <div ref={messageStartRef}></div>
      </div>
    </div>
  );
}
