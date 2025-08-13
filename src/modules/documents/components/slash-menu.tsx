"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  List,
  ListOrdered,
  Highlighter,
  Bold,
  Italic,
  Strikethrough,
  Code2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export type SlashItem = {
  title: string;
  description?: string;
  shortcut?: string;
  icon?: ReactNode;
  alias?: string[];
  action: () => void;
};

interface SlashMenuProps {
  items: SlashItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function SlashMenu({ items, selectedIndex, onSelect }: SlashMenuProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const computedItems = useMemo(() => items, [items]);

  useEffect(() => {
    const item = itemRefs.current[selectedIndex];
    if (item) {
      item.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  if (!computedItems.length) {
    return (
      <div className="max-h-[320px] w-80 rounded-md border border-zinc-800 bg-zinc-900/95 p-3 text-sm text-zinc-400">
        No results
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[320px] w-80 overflow-hidden border border-zinc-800 bg-zinc-900 p-1 shadow-xl">
      {computedItems.map((item, index) => (
        <button
          key={index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => onSelect(index)}
          className={cn(
            "flex w-full items-center gap-3 px-2 py-2 text-left hover:bg-zinc-800",
            index === selectedIndex && "bg-zinc-800",
          )}
        >
          <span className="grid h-7 w-7 place-items-center rounded bg-zinc-800/60 text-zinc-200">
            {item.icon ?? <Code2 className="h-4 w-4" />}
          </span>
          <div className="flex flex-col">
            <span className="text-sm text-zinc-100">{item.title}</span>
            {item.description ? (
              <span className="text-xs text-zinc-400">{item.description}</span>
            ) : null}
          </div>
          {item.shortcut ? (
            <span className="ml-auto text-[10px] tracking-wide text-zinc-500 uppercase">
              {item.shortcut}
            </span>
          ) : null}
        </button>
      ))}
    </ScrollArea>
  );
}

export function buildDefaultSlashItems(actions: {
  setHeading: (level: 1 | 2 | 3 | 4) => void;
  toggleBlockquote: () => void;
  toggleBulletList: () => void;
  toggleOrderedList: () => void;
  setCodeBlockTS: () => void;
}): SlashItem[] {
  return [
    {
      title: "Heading 1",
      description: "Big section heading",
      alias: ["h1", "title", "heading1"],
      icon: <Heading1 className="h-4 w-4" />,
      action: () => actions.setHeading(1),
    },
    {
      title: "Heading 2",
      description: "Medium section heading",
      alias: ["h2", "subtitle", "heading2"],
      icon: <Heading2 className="h-4 w-4" />,
      action: () => actions.setHeading(2),
    },
    {
      title: "Heading 3",
      description: "Small section heading",
      alias: ["h3", "heading3"],
      icon: <Heading3 className="h-4 w-4" />,
      action: () => actions.setHeading(3),
    },
    {
      title: "Heading 4",
      description: "Tiny section heading",
      alias: ["h4", "heading4"],
      icon: <Heading4 className="h-4 w-4" />,
      action: () => actions.setHeading(4),
    },
    {
      title: "Blockquote",
      description: "Call out a quote",
      alias: ["quote", "blockquote"],
      icon: <Quote className="h-4 w-4" />,
      action: actions.toggleBlockquote,
    },
    {
      title: "Bulleted list",
      description: "Create a simple bulleted list",
      alias: ["bullet", "ul", "list"],
      icon: <List className="h-4 w-4" />,
      action: actions.toggleBulletList,
    },
    {
      title: "Numbered list",
      description: "Create a numbered list",
      alias: ["ol", "ordered", "numbered"],
      icon: <ListOrdered className="h-4 w-4" />,
      action: actions.toggleOrderedList,
    },
    {
      title: "Code block (ts)",
      description: "Insert a TypeScript code block",
      alias: ["code", "ts", "typescript"],
      icon: <Code2 className="h-4 w-4" />,
      action: actions.setCodeBlockTS,
    },
  ];
}
