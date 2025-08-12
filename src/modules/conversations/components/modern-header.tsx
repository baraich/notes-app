"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import RenameConversationDialog from "./rename-conversation-dialog";
import DeleteConversationDialog from "./delete-conversation-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <RenameConversationDialog
        conversationId={conversationId}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
      />
      <DeleteConversationDialog
        conversationId={conversationId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        requiredName={name || ""}
      />
      <div className="sticky top-0 z-10 border-b border-zinc-700 bg-zinc-800/80 px-2 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="px-3">
            <Breadcrumbs lastKeyDisplayName={name} />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setRenameDialogOpen(true)}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setDeleteDialogOpen(true)}
                  className="text-red-500 focus:text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
