"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from "react";
import ConversationListing from "@/modules/conversations/components/conversation-listing";
import { Loader2Icon } from "lucide-react";
import { makeConversationsLink } from "@/lib/utils";

interface Props {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ConversationPage({ params }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { conversationId } = use(params);
  const userConversations = useQuery(
    trpc.conversations.listUserConversations.queryOptions()
  );

  const createConversation = useMutation(
    trpc.conversations.create.mutationOptions({
      onSuccess(data) {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions()
        );
        router.push(makeConversationsLink(data.id));
      },
    })
  );

  if (userConversations.data?.length === 0) {
    createConversation.mutate();
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
        <Loader2Icon className="text-zinc-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950">
      <ConversationListing conversationId={conversationId} />
    </div>
  );
}
