"use client";
import HomeHeader from "@/modules/home/components/home-header";
import MessageInput from "@/modules/home/components/message-input";
import Link from "next/link";

export default function HomePage() {
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
          <MessageInput />
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
