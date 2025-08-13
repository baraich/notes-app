"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Code2,
} from "lucide-react";

interface BubbleToolbarProps {
  editor: Editor | null;
  attachRef?: (el: HTMLDivElement | null) => void;
}

function BubbleButton({
  label,
  onClick,
  active,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  const baseButtonClass =
    "rounded p-1.5 text-sm hover:bg-zinc-800 text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const activeClass = "bg-zinc-700";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseButtonClass, active && activeClass)}
    >
      {children}
    </button>
  );
}

export function BubbleToolbar({ editor, attachRef }: BubbleToolbarProps) {
  if (!editor) return null;
  const Divider = () => <div className="mx-1 h-4 w-px bg-zinc-700" />;

  const [, forceRender] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceRender((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    editor.on("update", rerender);
    editor.on("focus", rerender);
    editor.on("blur", rerender);

    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
      editor.off("update", rerender);
      editor.off("focus", rerender);
      editor.off("blur", rerender);
    };
  }, [editor]);

  return (
    <div
      ref={attachRef}
      className="absolute -left-full z-50 flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/95 p-1 shadow-xl backdrop-blur"
    >
      <BubbleButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold className="h-4 w-4" />
      </BubbleButton>

      <BubbleButton
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic className="h-4 w-4" />
      </BubbleButton>

      <BubbleButton
        label="Strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      >
        <Strikethrough className="h-4 w-4" />
      </BubbleButton>

      <Divider />

      <BubbleButton
        label="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
      >
        <Heading1 className="h-4 w-4" />
      </BubbleButton>
      <BubbleButton
        label="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 className="h-4 w-4" />
      </BubbleButton>
      <BubbleButton
        label="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 className="h-4 w-4" />
      </BubbleButton>
      <BubbleButton
        label="Heading 4"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        active={editor.isActive("heading", { level: 4 })}
      >
        <Heading4 className="h-4 w-4" />
      </BubbleButton>

      <Divider />

      <BubbleButton
        label="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote className="h-4 w-4" />
      </BubbleButton>

      <BubbleButton
        label="TS code block"
        onClick={() => {
          const isActive = editor.isActive("codeBlock");
          const chain = editor.chain().focus();
          if (isActive) {
            chain.toggleCodeBlock().run();
          } else {
            chain.setCodeBlock({ language: "ts" }).run();
          }
        }}
        active={editor.isActive("codeBlock")}
      >
        <Code2 className="h-4 w-4" />
      </BubbleButton>

      <Divider />

      <BubbleButton
        label="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        active={editor.isActive("highlight")}
      >
        <Highlighter className="h-4 w-4" />
      </BubbleButton>

      <Divider />

      <BubbleButton
        label="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List className="h-4 w-4" />
      </BubbleButton>

      <BubbleButton
        label="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered className="h-4 w-4" />
      </BubbleButton>
    </div>
  );
}
