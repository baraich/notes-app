import {
  Dialog,
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
      <DialogContent className="bg-gray-800 border border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            Coming soon!!!
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
