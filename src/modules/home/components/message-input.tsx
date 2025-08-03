"use client";
import ComingSoonDialog from "@/components/coming-soon-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, SendIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: (value: string) => void;
}

export default function MessageInput({
  value,
  setValue,
  onSubmit,
}: Props) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col shadow-sm">
        <div>
          <Textarea
            className="flex-1 bg-transparent border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-0 shadow-none"
            placeholder="Ask me anything..."
            rows={1}
            cols={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                onSubmit(value);
              }
            }}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
              className="flex items-center gap-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>

          <Button
            size="icon"
            onClick={() => onSubmit(value)}
            className="text-gray-100 bg-gray-600 hover:bg-gray-500"
          >
            <SendIcon />
          </Button>
        </div>
      </div>
      <ComingSoonDialog
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        description="The ability to upload files will be avaiable in future
            updates."
      />
    </div>
  );
}
