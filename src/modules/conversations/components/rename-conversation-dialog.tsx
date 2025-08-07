"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { conversationsRouter } from "@/trpc/routers/conversations-router";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

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
          trpc.conversations.listUserConversations.queryOptions()
        );
        queryClient.invalidateQueries(
          trpc.conversations.listConversationWithMessages.queryOptions(
            { id: conversationId }
          )
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
    })
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    renameMutation.mutate({
      id: conversationId,
      name: values.name,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Rename conversation</DialogTitle>
          <DialogDescription>
            Enter a new name for this conversation below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="e.g. My awesome conversation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant={"normal"}>
                {renameMutation.isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <span>Rename</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
