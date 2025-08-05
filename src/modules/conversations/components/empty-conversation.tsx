import Topbar from "@/modules/home/components/topbar";
import { Lightbulb, Book, Sparkles } from "lucide-react";

export default function EmptyConversations() {
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

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      <Topbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4 my-16 md:mt-0">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
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
                className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer transform hover:-translate-y-1"
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

          <div className="mt-12">
            <p className="text-zinc-500">
              Create a new conversation from the sidebar to get
              started.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
