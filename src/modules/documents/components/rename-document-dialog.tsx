"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import EntityActionDialog from "@/components/entity-action-dialog";

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

  const { mutate: renameDocument, isPending } = useMutation(
    trpc.documents.rename.mutationOptions({
      onMutate: async () => {
        toast.loading("Renaming the document", {
          id: "rename-document",
        });
      },
      onSuccess: () => {
        toast.success("Document renamed!", {
          id: "rename-document",
        });
        queryClient.invalidateQueries(
          trpc.documents.listUserDocuments.queryOptions(),
        );
        queryClient.invalidateQueries(
          trpc.documents.getById.queryOptions({ documentId }),
        );
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error("Failed to rename the document", {
          id: "rename-document",
        });
        console.error(error);
      },
    }),
  );

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
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="e.g. My awesome document" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EntityActionDialog>
  );
}
