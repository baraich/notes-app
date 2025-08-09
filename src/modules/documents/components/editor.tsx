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
    injectCSS: false,
  });

  return (
    <div className="max-h-screen min-h-screen bg-zinc-900 px-4 py-3 text-white">
      <EditorContent
        translate="no"
        editor={editor}
        spellCheck={false}
        className="prose prose-invert prose-p:my-2 prose-h1:my-4 prose-h2:my-4 prose-h3:my-3 prose-h4:my-3 prose-h2:text-3xl prose-hr:h-0.5 prose-hr:bg-zinc-800 prose-hr:border-none prose-hr:my-6"
      />
    </div>
  );
}
