import { ClockIcon, UserIcon } from "lucide-react";

interface UserMessageProps {
  content: string;
  timestamp?: Date;
}

export default function UserMessage({
  content,
  timestamp,
}: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="flex flex-col items-end gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg max-w-full">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
          {timestamp && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <ClockIcon className="w-3 h-3" />
              <span>
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
          <UserIcon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
