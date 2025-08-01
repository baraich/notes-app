"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeHeader from "@/modules/home/components/home-header";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MessageInput from "@/modules/home/components/message-input";
import { Loader2Icon, User, Bot } from "lucide-react";

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
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState<
    {
      id: string;
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);

  const createMessage = useMutation(
    trpc.stream.messages.completion.mutationOptions({
      onMutate() {
        setResponse("");
      },
      onSettled() {
        setMessages((messages) => [
          ...messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response,
          },
        ]);
        setResponse("");
        queryClient.invalidateQueries(
          trpc.conversations.listConversationWithMessages.queryOptions(
            { id: conversationId }
          )
        );
      },
      async onSuccess(data) {
        for await (const chunk of data) {
          setResponse((acc) => acc + chunk);
        }
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
        }))
      );
    },
    [userConversation.data]
  );

  const handleMessage = (
    val: string,
    setChildVal: Dispatch<SetStateAction<string>>
  ) => {
    setMessages((messages) => [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: val },
    ]);
    createMessage.mutate({ query: val, conversationId });
    setChildVal("");
  };

  if (userConversation.isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#101014]">
        <Loader2Icon className="text-white animate-spin" />
      </div>
    );
  }

  if (!(messages.length > 0)) {
    return <NoMessages handleMessage={handleMessage} />;
  }

  return (
    <div className="w-full h-full bg-[#101014] min-h-screen flex flex-col justify-between">
      <HomeHeader />
      <div className="w-full grow mx-auto p-4 space-y-6 lg:pt-8">
        {messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} content={message.content} />
          ) : (
            <AssistantMessage
              key={message.id}
              content={message.content}
            />
          )
        )}
        {response !== "" && <AssistantMessage content={response} />}
      </div>
      <div className="p-4">
        <MessageInput
          onSubmit={(value) => handleMessage(value, setValue)}
          value={value}
          setValue={setValue}
        />
      </div>
    </div>
  );
}

interface UserMessageProps {
  content: string;
}

function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="flex flex-col items-end">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

interface AssistantMessageProps {
  content: string;
}

function AssistantMessage({ content }: AssistantMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="bg-[#1a1a1e] border border-gray-700 text-white px-4 py-3 rounded-2xl rounded-bl-md shadow-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NoMessagesProps {
  handleMessage: (
    value: string,
    setValue: Dispatch<SetStateAction<string>>
  ) => void;
}

export function NoMessages({ handleMessage }: NoMessagesProps) {
  const [value, setValue] = useState("");
  return (
    <div className="min-h-screen bg-[#101014] flex flex-col">
      <HomeHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4">
              {/* Logo or icon */}
              <div className="rounded-full bg-[#23232b] p-3 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <circle cx="16" cy="16" r="16" fill="#3b82f6" />
                  <circle cx="16" cy="16" r="6" fill="#fff" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              What can I help you with today?
            </h1>
          </div>
          <MessageInput
            value={value}
            setValue={setValue}
            onSubmit={(value) => handleMessage(value, setValue)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full">
            <SuggestionCard
              title="Thinking in English"
              description="Get into the habit of thinking directly in English."
            />
            <SuggestionCard
              title="Talking to Yourself"
              description="Train your speaking skills by talking to yourself."
            />
            <SuggestionCard
              title="Use the AI Application"
              description="To practise pronunciation, listen to conversation simulations."
            />
          </div>
        </div>
      </main>
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-white/10 bg-[#101014]">
        Our AI-driven solution prioritizes your privacy and data
        security.{" "}
        <Link
          href="/privacy-and-terms"
          className="underline hover:text-white"
        >
          Privacy & Terms
        </Link>
      </footer>
    </div>
  );
}

function SuggestionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#18181c] border border-white/10 rounded-lg p-4 flex flex-col gap-2 shadow hover:bg-[#23232b] transition-colors cursor-pointer">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
