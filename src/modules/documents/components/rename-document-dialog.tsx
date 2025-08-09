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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Rename document</DialogTitle>
          <DialogDescription>
            Enter a new name for this document below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="normal">
                {isPending ? (
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
