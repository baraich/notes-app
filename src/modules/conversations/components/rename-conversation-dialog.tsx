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
  const renameMutation = useMutation(
    trpc.conversations.rename.mutationOptions({
      onMutate() {
        toast.loading("Renaming the conversation", {
          id: "rename-conversation",
        });
      },
      onSuccess() {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions(),
        );
        queryClient.invalidateQueries(
          trpc.conversations.listConversationWithMessages.queryOptions({
            id: conversationId,
          }),
        );
        toast.success("Conversation renamed!", {
          id: "rename-conversation",
        });
      },
      onError() {
        toast.error("Failed to rename the conversation", {
          id: "rename-conversation",
        });
      },
      onSettled() {
        onOpenChange(false);
      },
    }),
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
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="e.g. My awesome conversation" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EntityActionDialog>
  );
}
