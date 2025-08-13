"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditorProps {
  initialContent: string;
  documentId: string;
}

export default function Editor({ initialContent, documentId }: EditorProps) {
  const trpc = useTRPC();
  const [editorContent, setEditorContent] = useState<string>(initialContent);
  const isFirstRender = useRef(true);

  const saveMutation = useMutation(
    trpc.documents.save.mutationOptions({
      onMutate() {
        toast.loading("Saving document", {
          id: "saving-document",
        });
      },
      onError() {
        toast.error("Failed to save the document", {
          id: "saving-document",
        });
      },
      onSuccess() {
        toast.success("Document saved", {
          id: "saving-document",
        });
      },
    }),
  );
  const debouncedEditorContent = useDebounce(editorContent.trim(), 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const saveContent = async (content: string) => {
      await saveMutation.mutateAsync({ content, id: documentId });
    };

    if (debouncedEditorContent) {
      saveContent(debouncedEditorContent);
    }
  }, [debouncedEditorContent]);

  const editor = useEditor({
    content: initialContent,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Highlight,
      Placeholder.configure({
        placeholder: "Write something...",
        emptyNodeClass: cn(
          "cursor-text before:content-[attr(data-placeholder)] before:opacity-50 before:pointer-events-none before:float-left before:h-0",
        ),
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    injectCSS: false,
  });

  return (
    <div className="h-full min-h-screen px-4 py-3 text-white">
      <EditorContent
        translate="no"
        editor={editor}
        spellCheck={false}
        className="prose prose-invert prose-p:my-2 prose-h1:my-4 prose-h2:my-4 prose-h3:my-3 prose-h4:my-3 prose-h2:text-3xl prose-hr:h-0.5 prose-hr:bg-zinc-800 prose-hr:border-none prose-hr:my-6"
      />
    </div>
  );
}
