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
  conversationId: string;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function RenameConversationDialog({
  open,
  onOpenChange,
  conversationId,
}: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const renameMutation = useAppMutation(
    {
      base: trpc.conversations.rename.mutationOptions({
        onSettled() {
          onOpenChange(false);
        },
      }),
      toast: {
        id: "rename-conversation",
        loading: "Renaming the conversation",
        success: "Conversation renamed!",
        error: "Failed to rename the conversation",
      },
      invalidate: [
        (qc) => qc.invalidateQueries(trpc.conversations.listUserConversations.queryOptions()),
        (qc) =>
          qc.invalidateQueries(
            trpc.conversations.listConversationWithMessages.queryOptions({ id: conversationId }),
          ),
      ],
    },
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    renameMutation.mutate({
      id: conversationId,
      name: values.name,
    });
  }

  return (
    <EntityActionDialog
      open={open}
      onOpenChange={onOpenChange}
      dialogTitle="Rename conversation"
      dialogDescription="Enter a new name for this conversation below."
      form={form}
      onSubmit={onSubmit}
      isPending={renameMutation.isPending}
      submitButtonText="Rename"
    >
      <NameField control={form.control} name="name" placeholder="e.g. My awesome conversation" />
    </EntityActionDialog>
  );
}
