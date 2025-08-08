"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import ConversationListing from "@/modules/conversations/components/conversation-listing";
import { Loader2Icon } from "lucide-react";
import useConversation from "@/modules/conversations/hooks/use-conversation";
import EmptyConversations from "@/modules/conversations/components/empty-conversation";

import MessageInput from "@/modules/home/components/message-input";

interface Props {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ConversationPage({ params }: Props) {
  const { conversationId } = use(params);
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

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        <Loader2Icon className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!userConversation.data) {
    return notFound();
  }

  if (messages.length === 0) {
    return <EmptyConversations />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950">
      <ConversationListing
        conversationId={conversationId}
        userConversation={userConversation}
        messages={messages}
        messageStartRef={messageStartRef}
        isMessageStreamPending={isMessageStreamPending}
      />
      <div className="sticky bottom-0 px-6 pb-4 backdrop-blur-md">
        <div className="mx-auto max-w-4xl">
          <MessageInput
            onSubmit={handleMessage}
            disabled={hasPendingMessages}
          />
        </div>
      </div>
    </div>
  );
}
