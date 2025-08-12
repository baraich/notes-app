"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import NameField from "@/components/form/name-field";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import EntityActionDialog from "@/components/entity-action-dialog";
import { useAppMutation } from "@/hooks/use-app-mutation";

interface Props {
  open: boolean;
  documentId: string;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function RenameDocumentDialog({
  open,
  onOpenChange,
  documentId,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    mutate: renameDocument,
    isPending,
  } = useAppMutation({
    base: trpc.documents.rename.mutationOptions({
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    }),
    toast: {
      id: "rename-document",
      loading: "Renaming the document",
      success: "Document renamed!",
      error: "Failed to rename the document",
    },
    invalidate: [
      (qc) => qc.invalidateQueries(trpc.documents.listUserDocuments.queryOptions()),
      (qc) => qc.invalidateQueries(trpc.documents.getById.queryOptions({ documentId })),
    ],
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    renameDocument({
      id: documentId,
      name: values.name,
    });
  }

  return (
    <EntityActionDialog
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Rename document"
      dialogDescription="Enter a new name for this document below."
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      submitButtonText="Rename"
    >
      <NameField control={form.control} name="name" placeholder="e.g. My awesome document" />
    </EntityActionDialog>
  );
}
