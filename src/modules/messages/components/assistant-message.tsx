import { ClockIcon } from "lucide-react";
import Image from "next/image";

interface AssistantMessageProps {
  content: string;
  timestamp?: Date;
}

export default function AssistantMessage({
  content,
  timestamp,
}: AssistantMessageProps) {
  const isMapContent = false;

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md">
          <Image
            src={"/favicon.ico"}
            width={16}
            height={16}
            alt="Logo"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg max-w-full">
            {isMapContent ? null : (
              // <MapDisplay content={content} />
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {content}
              </p>
            )}
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
      </div>
    </div>
  );
}
