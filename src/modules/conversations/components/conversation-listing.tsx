"use client";

import { useState } from "react";
import MessageInput from "@/modules/home/components/message-input";
import UserMessage from "@/modules/messages/components/user-message";
import AssistantMessage from "@/modules/messages/components/assistant-message";
import EmptyConversations from "./empty-conversation";
import useConversation from "../hooks/use-conversation";
import ShimmerMessage from "@/modules/messages/components/shimmer-message";
import ModernHeader from "./modern-header";

interface Props {
  conversationId: string;
}

export default function ConversationListing({
  conversationId,
}: Props) {
  const [value, setValue] = useState("");
  const {
    userConversation,
    messages,
    messageStartRef,
    handleMessage,
    hasPendingMessages,
    isPending,
    isMessageStreamPending,
  } = useConversation({
    conversationId,
  });

  const onMessage = (val: string) => {
    handleMessage(val);
    setValue("");
  };

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-zinc-400 text-sm">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  if (!(messages.length > 0)) {
    return <EmptyConversations />;
  }

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col">
      {/* Modern Header */}
      <ModernHeader
        conversationId={conversationId}
        createdAt={userConversation.data?.createdAt}
        name={userConversation.data?.name}
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-w-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages
            .filter(
              (message) =>
                !!message.content ||
                (message.toolCalls && message.toolCalls.length > 0)
            )
            .map((message) => (
              <div
                key={message.id}
                className="animate-in fade-in duration-300"
              >
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

      {/* Message Input */}
      <div className="sticky backdrop-blur-md bottom-0 px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSubmit={(value) => onMessage(value)}
            value={value}
            disabled={hasPendingMessages}
            setValue={setValue}
          />
        </div>
      </div>
    </div>
  );
}
