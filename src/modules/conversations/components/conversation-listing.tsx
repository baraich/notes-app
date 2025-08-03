"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import MessageInput from "@/modules/home/components/message-input";
import { SparklesIcon } from "lucide-react";
import UserMessage from "@/modules/messages/components/user-message";
import AssistantMessage from "@/modules/messages/components/assistant-message";
import EmptyConversations from "./empty-conversation";
import ComingSoonDialog from "@/components/coming-soon-dialog";

interface Props {
  conversationId: string;
}

export default function ConversationListing({
  conversationId,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const userConversation = useQuery(
    trpc.conversations.listConversationWithMessages.queryOptions({
      id: conversationId,
    })
  );

  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    {
      id: string;
      role: "user" | "assistant";
      content: string;
      timestamp?: Date;
      toolCalls?: {
        toolName: string;
        output: unknown;
        input: unknown;
      }[];
    }[]
  >([]);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const createMessage = useMutation(
    trpc.stream.messages.completion.mutationOptions({
      onMutate: ({ query }) => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "user",
            content: query,
            timestamp: new Date(),
          },
          {
            id: "streaming-assistant-response",
            role: "assistant",
            content: "",
            timestamp: new Date(),
            toolCalls: [],
          },
        ]);
      },
      onSuccess: async (data) => {
        for await (const chunk of data) {
          if (typeof chunk === "string") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === "streaming-assistant-response"
                  ? { ...m, content: m.content + chunk }
                  : m
              )
            );
          } else if (typeof chunk === "object") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === "streaming-assistant-response"
                  ? {
                      ...m,
                      toolCalls: [...(m.toolCalls || []), chunk],
                    }
                  : m
              )
            );
          }
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === "streaming-assistant-response"
              ? { ...m, id: crypto.randomUUID() }
              : m
          )
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.conversations.listConversationWithMessages.queryOptions(
            {
              id: conversationId,
            }
          )
        );
      },
      throwOnError: false,
    })
  );

  useEffect(
    function () {
      if (!userConversation.data) return;
      setMessages(
        userConversation.data.Message.map((dbMessage) => ({
          id: dbMessage.id,
          role: dbMessage.role.toLowerCase() as "user" | "assistant",
          content: dbMessage.content,
          timestamp: dbMessage.createdAt
            ? new Date(dbMessage.createdAt)
            : new Date(),
          toolCalls: dbMessage.toolCalls
            ? JSON.parse(dbMessage.toolCalls)
            : [],
        }))
      );
    },
    [userConversation.data]
  );

  useEffect(
    function () {
      if (!messageEndRef.current) return;
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    },
    [messageEndRef, messages]
  );

  const handleMessage = (
    val: string,
    setChildVal: Dispatch<SetStateAction<string>>
  ) => {
    createMessage.mutate({
      query: val,
      conversationId,
      messages: messages.slice(-4),
    });
    setChildVal("");
  };

  if (userConversation.isPending) {
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
    return <EmptyConversations handleMessage={handleMessage} />;
  }

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-zinc-800/80 backdrop-blur-md border-b border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-semibold text-gray-100">
                {userConversation.data?.name || "Conversation"}
              </h1>
              <p className="text-xs text-gray-500">
                Created at{" "}
                {userConversation.data?.createdAt
                  ? new Date(
                      userConversation.data.createdAt
                    ).toLocaleDateString()
                  : "..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={"normal"}
              onClick={() => setUpgradeDialogOpen(true)}
            >
              <span>Upgrade</span>
              <SparklesIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
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
                {message.role === "user" ? (
                  <UserMessage content={message.content} />
                ) : (
                  <AssistantMessage
                    content={message.content}
                    toolCalls={message.toolCalls}
                  />
                )}
              </div>
            ))}
          <div ref={messageEndRef}></div>
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky backdrop-blur-md bottom-0 px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSubmit={(value) => handleMessage(value, setValue)}
            value={value}
            setValue={setValue}
          />
        </div>
      </div>
      <ComingSoonDialog
        open={upgradeDialogOpen}
        setOpen={setUpgradeDialogOpen}
        description="The ability to upgrade to premium plan for higher usage limits would be shipped in future updates."
      />
    </div>
  );
}
