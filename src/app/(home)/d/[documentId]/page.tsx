"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { Loader2Icon } from "lucide-react";
import DocumentsHeader from "@/modules/documents/components/documents-header";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Editor from "@/modules/documents/components/editor";

interface Props {
  params: Promise<{
    documentId: string;
  }>;
}

export default function DocumentPage({ params }: Props) {
  const { documentId } = use(params);
  const trpc = useTRPC();
  const { data: document, isLoading } = useQuery(
    trpc.documents.getById.queryOptions({
      documentId,
    }),
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        <Loader2Icon className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!document) {
    return notFound();
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <DocumentsHeader
        documentId={documentId}
        createdAt={document.createdAt}
        name={document.name || undefined}
      />
      <div className="flex-1 bg-zinc-900">
        <Editor />
      </div>
    </div>
  );
}
