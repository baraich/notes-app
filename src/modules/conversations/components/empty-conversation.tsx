import MessageInput from "@/modules/home/components/message-input";
import Topbar from "@/modules/home/components/topbar";
import { Dispatch, SetStateAction, useState } from "react";

interface EmptyConversationsProps {
  handleMessage: (
    value: string,
    setValue: Dispatch<SetStateAction<string>>
  ) => void;
}

export default function EmptyConversations({
  handleMessage,
}: EmptyConversationsProps) {
  const [value, setValue] = useState("");

  return (
    <div className="flex h-screen flex-col bg-background">
      <Topbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How can I help you today?
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Start the conversation and I&apos;ll do my best to
              assist you.
            </p>
          </div>

          <div className="w-full">
            <MessageInput
              value={value}
              setValue={setValue}
              onSubmit={(v) => handleMessage(v, setValue)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
