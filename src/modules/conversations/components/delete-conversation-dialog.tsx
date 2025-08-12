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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  required_name: string;
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
  required_name,
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
    trpc.conversations.delete.mutationOptions({
      onMutate() {
        toast.loading("Deleting the conversation", {
          id: "delete-conversation",
        });
      },
      onSuccess() {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions(),
        );
        toast.success("Conversation deleted!", {
          id: "delete-conversation",
        });
        router.push("/");
      },
      onError() {
        toast.error("Failed to delete the conversation", {
          id: "delete-conversation",
        });
      },
      onSettled() {
        onOpenChange(false);
      },
    }),
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    deleteMutation.mutate({
      id: conversationId,
    });
  }

  const nameValue = form.watch("name");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Delete conversation</DialogTitle>
          <DialogDescription>
            To confirm, type{" "}
            <span className="font-semibold text-primary">{required_name}</span>{" "}
            in the box below. This action is not reversible.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder={required_name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="normal">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant={"destructive"}
                disabled={nameValue !== required_name || deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <span>Delete</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
