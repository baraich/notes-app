"use client";

import UserMessage from "@/modules/messages/components/user-message";
import AssistantMessage from "@/modules/messages/components/assistant-message";
import ShimmerMessage from "@/modules/messages/components/shimmer-message";
import { Message } from "@/generated/prisma";
import { ToolCall } from "@/modules/tools/interface";
import { RefObject, useEffect, useRef } from "react";

interface Props {
  messages: (Omit<
    Message,
    "createdAt" | "updatedAt" | "totalCost" | "conversationsId" | "toolCalls"
  > & {
    // eslint-disable-next-line
    toolCalls: ToolCall<any>[];
  })[];
  messageStartRef: RefObject<HTMLDivElement | null>;
  isMessageStreamPending: boolean;
}

export default function ConversationListing({
  messages,
  messageStartRef,
  isMessageStreamPending,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Ensure we scroll to bottom on initial render and whenever messages change
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    // Use requestAnimationFrame to avoid layout thrash
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages.length, isMessageStreamPending]);

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950">
      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="max-w-screen flex-1 space-y-6 overflow-y-auto px-6 py-4"
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
                  <AssistantMessage content={message.content} toolCalls={message.toolCalls} />
                )}
              </div>
            ))}

          {isMessageStreamPending && <ShimmerMessage />}
        </div>
      </div>
    </div>
  );
}
