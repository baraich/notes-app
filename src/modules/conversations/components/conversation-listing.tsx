"use client";

import UserMessage from "@/modules/messages/components/user-message";
import AssistantMessage from "@/modules/messages/components/assistant-message";
import ShimmerMessage from "@/modules/messages/components/shimmer-message";
import { Message } from "@/generated/prisma";
import { ToolCall } from "@/modules/tools/interface";
import { RefObject } from "react";

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
  return (
    <div className="flex h-full w-full flex-col bg-zinc-950">
      {/* Messages Container */}
      <div className="max-w-screen flex-1 space-y-6 overflow-y-auto px-6 py-4">
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
                  <UserMessage
                    messageStartRef={messageStartRef}
                    content={message.content}
                  />
                ) : (
                  <AssistantMessage
                    messageStartRef={messageStartRef}
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
