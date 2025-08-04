"use client";
import { JSX, useEffect, useState } from "react";
import MapDisplayTool from "../../tools/components/map-display-tool";
import { parseMarkdown } from "@/lib/markdown";
import { ToolCall, ValidTool } from "@/modules/tools/interface";
import SearchTool from "@/modules/tools/components/search-tool";

interface AssistantMessageProps {
  content: string;
  // eslint-disable-next-line
  toolCalls?: ToolCall<any>[];
}

const toolUi: Record<
  ValidTool,
  // eslint-disable-next-line
  (tool: ToolCall<any>) => JSX.Element
> = {
  map: (tool: ToolCall<"map">) => <MapDisplayTool {...tool} />,
  search: (tool: ToolCall<"search">) => <SearchTool {...tool} />,
};

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
          {toolCalls?.map((tool, idx) => {
            const Tool = toolUi[tool.name as ValidTool];
            if (!Tool) {
              return null;
            }
            return (
              <div key={idx}>
                <Tool {...tool} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
