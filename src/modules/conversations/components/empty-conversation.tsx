import { makeConversationsLink } from "@/lib/utils";
import MessageInput from "@/modules/home/components/message-input";
import Topbar from "@/modules/home/components/topbar";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Book, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EmptyConversations() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
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
      onMutate() {
        toast.loading("Creating a new conversation", {
          id: "create-conversation",
        });
      },
      onSuccess(data) {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions(),
        );
        router.push(makeConversationsLink(data.id));
        toast.success("Conversation created!", {
          id: "create-conversation",
        });
      },
      onError() {
        toast.error("Failed to create a new conversation.", {
          id: "create-conversation",
        });
      },
    }),
  );
  const handleSubmit = async (value: string) => {
    createConversationWithMessageMutation.mutate({
      pending_message: value,
    });
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      <Topbar />
      <main className="my-16 flex flex-grow flex-col items-center justify-center p-4 md:mt-0">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center text-center">
          <div className="flex w-full flex-col items-center justify-end">
            <div className="mb-12">
              <h1 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
                Unlock Your Ideas
              </h1>
              <p className="mt-4 text-lg text-zinc-400">
                Start a new conversation and let your creativity flow.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-6"
                >
                  <div className="mb-4 flex items-center justify-center">
                    {suggestion.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {suggestion.title}
                  </h3>
                  <p className="mt-1 text-zinc-400">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 w-full">
            <MessageInput onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
}
