"use client";

import UserMessage from "@/modules/messages/components/user-message";
import AssistantMessage from "@/modules/messages/components/assistant-message";
import ShimmerMessage from "@/modules/messages/components/shimmer-message";
import { Message } from "@/generated/prisma";
import { ToolCall } from "@/modules/tools/interface";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  messages: (Omit<
    Message,
    "createdAt" | "updatedAt" | "totalCost" | "conversationsId" | "toolCalls"
  > & {
    // eslint-disable-next-line
    toolCalls: ToolCall<any>[];
  })[];
  isMessageStreamPending: boolean;
}

export default function ConversationListing({
  messages,
  isMessageStreamPending,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageKey = useMemo(() => {
    if (messages.length === 0) return "";
    // eslint-disable-next-line
    const last = messages[messages.length - 1] as any;
    const contentLen = (last?.content || "").length;
    const toolsLen = (last?.toolCalls || []).length;
    return `${last?.id ?? ""}:${contentLen}:${toolsLen}`;
  }, [messages]);

  // Ensure we scroll to bottom on initial render and whenever messages stream/update
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    // Defer to end of paint to get final height, then snap to bottom

    setTimeout(() => {
      container.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }, 100);
  }, [messages.length, isMessageStreamPending, lastMessageKey]);

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col bg-zinc-950")}>
      <div
        ref={scrollContainerRef}
        className="min-h-0 max-w-screen flex-1 space-y-6 overflow-y-auto px-6 py-4 pb-28"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {messages
            .filter(
              (message) =>
                !!message.content ||
                (message.toolCalls && message.toolCalls.length > 0),
            )
            .map((message) => (
              <div key={message.id} className="animate-in fade-in duration-300">
                {message.role === "USER" ? (
                  <UserMessage content={message.content} />
                ) : (
                  <AssistantMessage
                    content={message.content}
                    toolCalls={message.toolCalls}
                  />
                )}
              </div>
            ))}

          {isMessageStreamPending && <ShimmerMessage />}
        </div>
      </div>
    </div>
  );
}
