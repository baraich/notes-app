"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToolCall } from "@/modules/tools/interface";
import { Message } from "@/generated/prisma";

interface Props {
  conversationId: string;
}

type LocalMessage = Omit<
  Message,
  "createdAt" | "updatedAt" | "totalCost" | "conversationsId" | "toolCalls"
> & {
  // eslint-disable-next-line
  toolCalls: ToolCall<any>[];
};

export default function useConversation({ conversationId }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isMessageStreamPending, setIsMessageStreamPending] = useState(false);

  const userConversation = useQuery(
    trpc.conversations.listConversationWithMessages.queryOptions({
      id: conversationId,
    }),
  );

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const messageStartRef = useRef<HTMLDivElement>(null);

  const updateStreamingMessage = useCallback(
    (updater: (message: LocalMessage) => LocalMessage) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === "streaming-assistant-response" ? updater(m) : m,
        ),
      );
    },
    [],
  );

  const createMessage = useMutation(
    trpc.stream.messages.completion.mutationOptions({
      onMutate: ({ query }) => {
        // Validate inputs before proceeding
        if (!query?.trim()) {
          throw new Error("Message content cannot be empty");
        }
        if (!conversationId) {
          throw new Error("Conversation ID is required");
        }

        setIsMessageStreamPending(true);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "USER",
            content: query,
            toolCalls: [],
            status: "PENDING",
            cost: "0",
          },
          {
            id: "streaming-assistant-response",
            role: "ASSISTANT",
            content: "",
            toolCalls: [],
            status: "PENDING",
            cost: "0",
          },
        ]);
      },
      onSuccess: async (data) => {
        setIsMessageStreamPending(false);
        for await (const chunk of data) {
          if (typeof chunk === "string") {
            updateStreamingMessage((m) => ({
              ...m,
              content: m.content + chunk,
            }));
          } else if (typeof chunk === "object") {
            updateStreamingMessage((m) => ({
              ...m,
              toolCalls: [...m.toolCalls, chunk],
            }));
          }
        }
        updateStreamingMessage((m) => ({
          ...m,
          id: crypto.randomUUID(),
        }));
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.conversations.listConversationWithMessages.queryOptions({
            id: conversationId,
          }),
        );
      },
      throwOnError: false,
      onError() {
        setIsMessageStreamPending(false);
      },
    }),
  );

  useEffect(() => {
    if (!userConversation.data) return;
    setMessages(
      userConversation.data.Message.map((dbMessage) => {
        // eslint-disable-next-line
        const { conversationsId, ...message } = dbMessage;
        return {
          ...message,
          toolCalls: message.toolCalls
            ? JSON.parse(message.toolCalls as string)
            : [],
        };
      }),
    );
  }, [userConversation.data]);

  useEffect(() => {
    if (!messageStartRef.current) return;
    messageStartRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleMessage = useCallback(
    (val: string) => {
      // Add validation
      if (!val?.trim()) {
        console.error("Cannot send empty message");
        return;
      }
      if (!conversationId) {
        console.error("No conversation ID provided");
        return;
      }

      createMessage.mutate({
        query: val,
        conversationId,
        messages: messages.slice(-4),
      });
    },
    [conversationId, createMessage, messages],
  );

  return {
    userConversation,
    messages,
    messageStartRef,
    handleMessage,
    isMessageStreamPending:
      isMessageStreamPending ||
      (messages.length > 0 &&
        messages[messages.length - 1].role === "ASSISTANT")
        ? messages[messages.length - 1].content == ""
        : false,
    isPending: userConversation.isPending,
  };
}
