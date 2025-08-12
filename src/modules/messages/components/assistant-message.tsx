"use client";
import { JSX, useEffect, useRef, useState } from "react";
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

const beforeTools = {
  search: toolUi["search"],
} as const;

const afterTools = {
  map: toolUi["map"],
} as const;

export default function AssistantMessage({ content, toolCalls }: AssistantMessageProps) {
  const [cleanHtmlContent, setCleanHtmlContent] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);

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
    [content],
  );

  useEffect(() => {
    // Scroll into view when the content or tools change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [cleanHtmlContent, toolCalls?.length]);

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-2">
          {toolCalls?.map((tool, idx) => {
            const Tool = beforeTools[tool.name as keyof typeof beforeTools];
            if (!Tool) {
              return null;
            }
            return (
              <div key={idx}>
                <Tool {...tool} />
              </div>
            );
          })}
          {cleanHtmlContent != "" && (
            <>
              <div className="rounded-2xl rounded-bl-md border border-zinc-800 bg-zinc-900 px-4 py-3 text-white shadow-lg">
                <div
                  className="prose prose-invert prose-img:my-4 prose-pre:my-4 prose-table:my-4 prose-hr:my-4 prose-th:border prose-td:border prose-table:border-collapse prose-th:p-2! prose-td:p-2! w-full max-w-none text-sm"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{
                    __html: cleanHtmlContent,
                  }}
                ></div>
              </div>
            </>
          )}
          {toolCalls?.map((tool, idx) => {
            const Tool = afterTools[tool.name as keyof typeof afterTools];
            if (!Tool) {
              return null;
            }
            return (
              <div key={idx}>
                <Tool {...tool} />
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>
      </div>
    </div>
  );
}
