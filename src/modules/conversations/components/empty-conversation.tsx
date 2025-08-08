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
    <div className="flex h-full flex-col bg-zinc-950 text-white">
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

            <div className="w-full max-w-2xl space-y-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-left transition-colors hover:bg-zinc-800/60"
                >
                  <div className="flex-shrink-0">{suggestion.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {suggestion.title}
                    </h3>
                    <p className="mt-1 text-zinc-400">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
