"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
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
  });

  return (
    <div className="max-h-screen min-h-screen bg-zinc-900 px-4 py-3 text-white shadow-lg">
      <EditorContent
        editor={editor}
        spellCheck={false}
        className="prose prose-invert prose-headings:mt-[1.5rem] prose-headings:mb-2 prose-hr:my-[1.5rem] prose-li:mb-1 prose-ol:list-decimal"
      />
    </div>
  );
}
