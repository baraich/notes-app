"use client";
import { useEffect, useState } from "react";
import MapDisplay from "./map-display";
import { parseMarkdown } from "@/lib/markdown";
import { ToolCall } from "@/modules/tools/interface";

interface AssistantMessageProps {
  content: string;
  // eslint-disable-next-line
  toolCalls?: ToolCall<any>[];
}

export default function AssistantMessage({
  content,
  toolCalls,
}: AssistantMessageProps) {
  const [cleanHtmlContent, setCleanHtmlContent] = useState("");

  const updateContent = async () => {
    let c = content;
    if (c.startsWith("```")) {
      c = c.substring(3);
    }
    if (c.endsWith("```")) {
      c = c.substring(0, c.length - 3);
    }
    setCleanHtmlContent(await parseMarkdown(c));
  };

  useEffect(
    function () {
      updateContent();
    },
    [content]
  );

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 ">
        <div className="flex flex-col gap-2">
          <div className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-2xl rounded-bl-md shadow-lg">
            <div
              className="prose prose-invert text-sm max-w-none w-full"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: cleanHtmlContent }}
            ></div>
          </div>
          {toolCalls?.map((tool, idx) =>
            tool.name == "map" ? (
              <MapDisplay
                key={idx}
                input={tool.input}
                output={tool.output}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
