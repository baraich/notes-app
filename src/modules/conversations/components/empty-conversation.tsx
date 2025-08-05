import { makeConversationsLink } from "@/lib/utils";
import MessageInput from "@/modules/home/components/message-input";
import Topbar from "@/modules/home/components/topbar";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Book, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmptyConversations() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [value, setValue] = useState<string>("");
  const suggestions = [
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-400" />,
      title: "Brainstorm",
      description: "Unlock new ideas and insights",
    },
    {
      icon: <Book className="h-6 w-6 text-blue-400" />,
      title: "Research",
      description: "Explore topics and gather information",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-400" />,
      title: "Learn",
      description: "Understand complex subjects with ease",
    },
  ];

  const createConversationWithMessageMutation = useMutation(
    trpc.conversations.create.mutationOptions({
      onSuccess(data) {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions()
        );
        router.push(makeConversationsLink(data.id));
      },
    })
  );
  const handleSubmit = async (value: string) => {
    createConversationWithMessageMutation.mutate({
      pending_message: value,
    });
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      <Topbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4 my-16 md:mt-0">
        <div className="w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="w-full flex flex-col items-center justify-end">
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                Unlock Your Ideas
              </h1>
              <p className="mt-4 text-lg text-zinc-400">
                Start a new conversation and let your creativity flow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 p-6 rounded-lg border border-zinc-800"
                >
                  <div className="flex items-center justify-center mb-4">
                    {suggestion.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {suggestion.title}
                  </h3>
                  <p className="text-zinc-400 mt-1">
                    {suggestion.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 w-full">
            <MessageInput
              value={value}
              setValue={setValue}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
