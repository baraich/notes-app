"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import RenameConversationDialog from "./rename-conversation-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  name?: string;
  conversationId: string;
  createdAt?: string | Date;
}

export default function ModernHeader({
  name,
  createdAt,
  conversationId,
}: Props) {
  const router = useRouter();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  return (
    <>
      <RenameConversationDialog
        conversationId={conversationId}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
      />
      <div className="sticky top-0 z-10 bg-zinc-800/80 backdrop-blur-md border-b border-zinc-700 py-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <Button
                onClick={() => router.push("/")}
                variant={"ghost"}
                size={"icon"}
              >
                <ChevronLeft />
              </Button>
            </div>
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-semibold text-gray-100">
                {name || "Untitled Conversation"}
              </h1>
              <p className="text-xs text-gray-500">
                Created at{" "}
                {createdAt ? new Date(createdAt).toLocaleDateString() : "..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setRenameDialogOpen(true)}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
