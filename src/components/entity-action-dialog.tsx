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
import { Button, type ButtonProps } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InlineSpinner from "@/components/common/inline-spinner";
import { type UseFormReturn } from "react-hook-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle: string;
  dialogDescription: React.ReactNode;
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  isPending: boolean;
  submitButtonText: string;
  submitButtonVariant?: ButtonProps["variant"];
  submitButtonDisabled?: boolean;
  children: React.ReactNode;
}

export default function EntityActionDialog({
  open,
  onOpenChange,
  dialogTitle,
  dialogDescription,
  form,
  onSubmit,
  isPending,
  submitButtonText,
  submitButtonVariant = "normal",
  submitButtonDisabled = false,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {children}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="normal">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant={submitButtonVariant}
                disabled={isPending || submitButtonDisabled}
              >
                {isPending ? (
                  <InlineSpinner />
                ) : (
                  <span>{submitButtonText}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
