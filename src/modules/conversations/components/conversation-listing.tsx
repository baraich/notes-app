"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import MessageInput from "@/modules/home/components/message-input";
import { SparklesIcon } from "lucide-react";
import UserMessage from "@/modules/messages/components/user-message";
import AssistantMessage from "@/modules/messages/components/assistant-message";
import EmptyConversations from "./empty-conversation";
import ComingSoonDialog from "@/components/coming-soon-dialog";
import useConversation from "../hooks/use-conversation";

interface Props {
  conversationId: string;
}

export default function ConversationListing({
  conversationId,
}: Props) {
  const [value, setValue] = useState("");
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const {
    userConversation,
    messages,
    messageStartRef,
    handleMessage,
    hasPendingMessages,
    isPending,
  } = useConversation({
    conversationId,
  });

  const onMessage = (val: string) => {
    handleMessage(val);
    setValue("");
  };

  if (isPending) {
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
    return <EmptyConversations />;
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
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-w-screen">
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
                {message.role === "USER" ? (
                  <UserMessage content={message.content} />
                ) : (
                  <AssistantMessage
                    messageStartRef={messageStartRef}
                    content={message.content}
                    toolCalls={message.toolCalls}
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky backdrop-blur-md bottom-0 px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSubmit={(value) => onMessage(value)}
            value={value}
            disabled={hasPendingMessages}
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
