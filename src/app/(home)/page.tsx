"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Homepage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const conversationsList = useQuery(
    trpc.conversations.listUserConversations.queryOptions()
  );
  const createDefaultMutation = useMutation(
    trpc.conversations.create.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions()
        );
      },
    })
  );

  useEffect(
    function () {
      if (!conversationsList.data) return;
      if (conversationsList.data.length === 0) {
        createDefaultMutation.mutate();
      }
      if (conversationsList.data.length > 0)
        router.push(`/${conversationsList.data[0].id}`);
    },
    [conversationsList.data]
  );
}
