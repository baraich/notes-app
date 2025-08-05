"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { use } from "react";
import ConversationListing from "@/modules/conversations/components/conversation-listing";
import { Loader2Icon } from "lucide-react";

interface Props {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ConversationPage({ params }: Props) {
  const trpc = useTRPC();
  const { conversationId } = use(params);
  // TODO: Create an endpoint to retrieve a single conversation, not a list
  const userConversations = useQuery(
    trpc.conversations.listUserConversations.queryOptions()
  );

  if (userConversations.isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
        <Loader2Icon className="text-zinc-400 animate-spin" />
      </div>
    );
  }

  if (
    !!userConversations.data?.find(
      (conversation) => conversation.id === conversationId
    )
  )
    return (
      <div className="w-full h-full bg-zinc-950">
        <ConversationListing conversationId={conversationId} />
      </div>
    );

  return notFound();
}
