"use client";
import RenameConversationDialog from "./rename-conversation-dialog";
import DeleteConversationDialog from "./delete-conversation-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EntityHeader from "@/components/entity-header";

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
      <EntityHeader
        name={name}
        onOpenRename={() => setRenameDialogOpen(true)}
        onOpenDelete={() => setDeleteDialogOpen(true)}
      />
    </>
  );
}
