"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface EntityHeaderProps {
  name?: string;
  onOpenRename: () => void;
  onOpenDelete: () => void;
  leftContent?: React.ReactNode;
}

export default function EntityHeader({
  name,
  onOpenRename,
  onOpenDelete,
  leftContent,
}: EntityHeaderProps) {
  return (
    <div className="fixed top-0 right-0 left-0 z-10 border-b border-zinc-700 bg-zinc-800/80 px-2 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-3">
          {leftContent}
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
              <DropdownMenuItem onSelect={onOpenRename}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={onOpenDelete}
                className="text-red-500 focus:text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
