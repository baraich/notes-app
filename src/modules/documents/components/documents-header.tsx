"use client";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RenameDocumentDialog from "./rename-document-dialog";
import DeleteDocumentDialog from "./delete-document-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EntityHeader from "@/components/entity-header";

interface Props {
  name?: string;
  documentId: string;
}

export default function DocumentsHeader({ name, documentId }: Props) {
  const router = useRouter();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <RenameDocumentDialog
        documentId={documentId}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
      />
      <DeleteDocumentDialog
        documentId={documentId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        requiredName={name || ""}
      />
      <EntityHeader
        name={name}
        onOpenRename={() => setRenameDialogOpen(true)}
        onOpenDelete={() => setDeleteDialogOpen(true)}
        leftContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-zinc-400 hover:text-white"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        }
      />
    </>
  );
}
