"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import NameField from "@/components/form/name-field";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import EntityActionDialog from "@/components/entity-action-dialog";
import { useAppMutation } from "@/hooks/use-app-mutation";

interface Props {
  open: boolean;
  requiredName: string;
  conversationId: string;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function DeleteConversationDialog({
  open,
  onOpenChange,
  conversationId,
  requiredName,
}: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const deleteMutation = useAppMutation({
    base: trpc.conversations.delete.mutationOptions({
      onSuccess() {
        router.push("/");
      },
      onSettled() {
        onOpenChange(false);
      },
    }),
    toast: {
      id: "delete-conversation",
      loading: "Deleting the conversation",
      success: "Conversation deleted!",
      error: "Failed to delete the conversation",
    },
    invalidate: [
      (qc) =>
        qc.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions(),
        ),
    ],
  });

  function onSubmit() {
    deleteMutation.mutate({
      id: conversationId,
    });
  }

  const nameValue = form.watch("name");

  return (
    <EntityActionDialog
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Delete conversation"
      dialogDescription={
        <>
          To confirm, type{" "}
          <span className="text-primary font-semibold">{requiredName}</span> in
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
      <NameField
        control={form.control}
        name="name"
        placeholder={requiredName}
      />
    </EntityActionDialog>
  );
}
