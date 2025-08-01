"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeHeader from "@/modules/home/components/home-header";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function ConversationListing() {
  const trpc = useTRPC();
  const [response, setResponse] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const completion = useMutation(
    trpc.stream.messages.completion.mutationOptions({
      onMutate() {
        setResponse("");
      },
      async onSuccess(iterable) {
        for await (const chunk of iterable) {
          setResponse((res) => res + chunk);
        }
      },
    })
  );

  return (
    <div className="text-white">
      <HomeHeader />
      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            className="w-full bg-[#18181c] text-white mt-1 hover:bg-[#23232b] border border-white/10 hover:text-white"
            onClick={() => completion.mutate({ query: query })}
          >
            Mutate
          </Button>
        </div>

        <p>
          {response == ""
            ? completion.isPending
              ? "Answering..."
              : "Mutate to preview streaming response"
            : response}
        </p>
      </div>
    </div>
  );
}
