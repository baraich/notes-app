"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import FullScreenLoader from "@/components/full-screen-loader";
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
    return <FullScreenLoader />;
  }

  if (!document) {
    return notFound();
  }

  return (
    <div className="relative flex h-full min-h-screen flex-col bg-zinc-900">
      <DocumentsHeader
        documentId={documentId}
        name={document.name || undefined}
      />
      <div className="mx-auto w-full max-w-3xl flex-1 sm:px-4 sm:pt-6">
        <Editor
          documentId={document.id}
          initialContent={document.content || ""}
        />
      </div>
    </div>
  );
}
