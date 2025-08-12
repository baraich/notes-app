"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import ConversationListing from "@/modules/conversations/components/conversation-listing";
import { Loader2Icon } from "lucide-react";
import useConversation from "@/modules/conversations/hooks/use-conversation";
import EmptyConversations from "@/modules/conversations/components/empty-conversation";

import MessageInput from "@/modules/home/components/message-input";
import ModernHeader from "@/modules/conversations/components/modern-header";

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
    isPending,
    isMessageStreamPending,
  } = useConversation({
    conversationId,
  });

  if (isPending) {
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center bg-zinc-950">
        <Loader2Icon className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!userConversation.data) {
    return notFound();
  }

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950">
      <ModernHeader
        conversationId={conversationId}
        createdAt={userConversation.data?.createdAt}
        name={userConversation.data?.name || undefined}
      />
      {messages.length == 0 ? (
        <EmptyConversations />
      ) : (
        <ConversationListing
          messages={messages}
          messageStartRef={messageStartRef}
          isMessageStreamPending={isMessageStreamPending}
        />
      )}
      <div className="sticky bottom-0 px-6 pb-4 backdrop-blur-md">
        <div className="mx-auto max-w-4xl">
          <MessageInput
            onSubmit={handleMessage}
            disabled={isMessageStreamPending}
          />
        </div>
      </div>
    </div>
  );
}
