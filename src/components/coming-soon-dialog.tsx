import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  description: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ComingSoonDialog({
  open,
  setOpen,
  description,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="bg-[#18181c] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            Coming soon!!!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
