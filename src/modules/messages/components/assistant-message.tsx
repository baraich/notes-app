import { ClockIcon } from "lucide-react";
import Image from "next/image";
import MapDisplay from "./map-display";

interface AssistantMessageProps {
  content: string;
  timestamp?: Date;
  toolCalls?: { toolName: string; output: unknown }[];
}

export default function AssistantMessage({
  content,
  timestamp,
  toolCalls,
}: AssistantMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-gray-700">
          <Image
            src={"/favicon.ico"}
            width={16}
            height={16}
            alt="Logo"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg max-w-full">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
          {toolCalls?.map((tool, idx) =>
            tool.toolName == "map" ? (
              <MapDisplay
                key={idx}
                location={
                  tool.output as {
                    latitude: number;
                    longitude: number;
                  }
                }
              />
            ) : null
          )}
          {timestamp && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
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
