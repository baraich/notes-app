"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import RenameDocumentDialog from "./rename-document-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs";

interface Props {
  name?: string;
  documentId: string;
}

export default function DocumentsHeader({ name, documentId }: Props) {
  const router = useRouter();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  return (
    <>
      <RenameDocumentDialog
        documentId={documentId}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
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
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
