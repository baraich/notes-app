"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EntityActionDialog from "@/components/entity-action-dialog";

interface Props {
  open: boolean;
  requiredName: string;
  documentId: string;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function DeleteDocumentDialog({
  open,
  onOpenChange,
  documentId,
  requiredName,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const deleteMutation = useMutation(
    trpc.documents.delete.mutationOptions({
      onMutate() {
        toast.loading("Deleting the document", {
          id: "delete-document",
        });
      },
      onSuccess() {
        queryClient.invalidateQueries(
          trpc.documents.listUserDocuments.queryOptions(),
        );
        toast.success("Document deleted!", {
          id: "delete-document",
        });
        router.push("/");
      },
      onError() {
        toast.error("Failed to delete the document", {
          id: "delete-document",
        });
      },
      onSettled() {
        onOpenChange(false);
      },
    }),
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    deleteMutation.mutate({
      id: documentId,
    });
  }

  const nameValue = form.watch("name");

  return (
    <EntityActionDialog
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Delete document"
      dialogDescription={
        <>
          To confirm, type{" "}
          <span className="font-semibold text-primary">{requiredName}</span> in
          the box below. This action is not reversible.
        </>
      }
      form={form}
      onSubmit={onSubmit}
      isPending={deleteMutation.isPending}
      submitButtonText="Delete"
      submitButtonVariant="destructive"
      submitButtonDisabled={nameValue !== requiredName}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder={requiredName} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EntityActionDialog>
  );
}