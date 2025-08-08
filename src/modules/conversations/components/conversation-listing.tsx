"use client";

import UserMessage from "@/modules/messages/components/user-message";
import AssistantMessage from "@/modules/messages/components/assistant-message";
import ShimmerMessage from "@/modules/messages/components/shimmer-message";
import ModernHeader from "./modern-header";
import { Message } from "@/generated/prisma";
import { ToolCall } from "@/modules/tools/interface";
import { RefObject } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/trpc/routers/_app";

interface Props {
  conversationId: string;
  userConversation: UseQueryResult<
    {
      id: string;
      name: string | null;
      createdAt: Date;
      Message: Message[];
    } | null,
    TRPCClientErrorLike<AppRouter>
  >;
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
  conversationId,
  userConversation,
  messages,
  messageStartRef,
  isMessageStreamPending,
}: Props) {
  return (
    <div className="flex h-full w-full flex-col bg-zinc-950">
      {/* Modern Header */}
      <ModernHeader
        conversationId={conversationId}
        createdAt={userConversation.data?.createdAt}
        name={userConversation.data?.name || undefined}
      />

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
