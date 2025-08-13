import Suggestion from "@tiptap/suggestion";
import { ReactRenderer, Extension } from "@tiptap/react";
import tippy, { type Instance, type Props } from "tippy.js";
import {
  SlashMenu,
  buildDefaultSlashItems,
  type SlashItem,
} from "../components/slash-menu";

export interface SlashCommandOptions {
  items?: (query: string) => SlashItem[];
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: "slashCommand",

  addOptions() {
    return {
      items: undefined,
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    const suggestion = Suggestion<SlashItem>({
      editor,
      char: "/",
      allowSpaces: true,
      startOfLine: false,
      command: ({ editor, range, props }) => {
        // Remove the slash+query
        editor.chain().focus().deleteRange(range).run();
        // Run the action
        props.action();
      },
      items: ({ query }) => {
        if (this.options.items) return this.options.items(query);
        const base = buildDefaultSlashItems({
          setHeading: (level) =>
            editor.chain().focus().toggleHeading({ level }).run(),
          toggleBlockquote: () =>
            editor.chain().focus().toggleBlockquote().run(),
          toggleBulletList: () =>
            editor.chain().focus().toggleBulletList().run(),
          toggleOrderedList: () =>
            editor.chain().focus().toggleOrderedList().run(),
          setCodeBlockTS: () =>
            editor.chain().focus().setCodeBlock({ language: "ts" }).run(),
        });
        const q = query.trim().toLowerCase();
        if (!q) return base;
        return base.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.alias?.some((a) => a.toLowerCase().includes(q)),
        );
      },
      render: () => {
        let component: ReactRenderer | null = null;
        let popup: Instance<Props>[] = [];
        let selectedIndex = 0;
        let currentItems: SlashItem[] = [];
        let applyCommand: ((item: SlashItem) => void) | null = null;

        return {
          onStart: (props) => {
            component = new ReactRenderer(SlashMenu, {
              props: {
                items: props.items,
                selectedIndex,
                onSelect: (index: number) => {
                  const item = props.items[index];
                  if (item) props.command(item);
                },
              },
              editor: props.editor,
            });

            if (!props.clientRect) return;

            currentItems = props.items;
            applyCommand = props.command;

            popup = tippy("body", {
              // eslint-disable-next-line
              getReferenceClientRect: props.clientRect as any,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: "bottom-start",
              theme: "light-border",
            });
          },
          onUpdate(props) {
            currentItems = props.items;
            if (selectedIndex >= currentItems.length) {
              selectedIndex = Math.max(0, currentItems.length - 1);
            }
            applyCommand = props.command;

            component?.updateProps({
              items: currentItems,
              selectedIndex,
              onSelect: (index: number) => {
                const item = currentItems[index];
                if (item) props.command(item);
              },
            });
            if (!props.clientRect) return;
            popup[0]?.setProps({
              // eslint-disable-next-line
              getReferenceClientRect: props.clientRect as any,
            });
          },
          onKeyDown(props) {
            if (props.event.key === "Escape") {
              popup[0]?.hide();
              return true;
            }
            if (props.event.key === "Enter" || props.event.key === "Tab") {
              const item = currentItems[selectedIndex];
              if (item && applyCommand) applyCommand(item);
              return true;
            }
            if (props.event.key === "ArrowUp") {
              selectedIndex =
                (selectedIndex - 1 + currentItems.length) %
                Math.max(currentItems.length, 1);
              component?.updateProps({
                items: currentItems,
                selectedIndex,
                onSelect: (index: number) => {
                  const item = currentItems[index];
                  if (item && applyCommand) applyCommand(item);
                },
              });
              return true;
            }
            if (props.event.key === "ArrowDown") {
              selectedIndex =
                currentItems.length === 0
                  ? 0
                  : (selectedIndex + 1) % currentItems.length;
              component?.updateProps({
                items: currentItems,
                selectedIndex,
                onSelect: (index: number) => {
                  const item = currentItems[index];
                  if (item && applyCommand) applyCommand(item);
                },
              });
              return true;
            }
            return false;
          },
          onExit() {
            popup.forEach((p) => p.destroy());
            popup = [];
            component?.destroy();
            component = null;
          },
        };
      },
    });

    return [suggestion];
  },
});
