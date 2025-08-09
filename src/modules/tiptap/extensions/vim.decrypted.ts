/**
 * Decryped, WILL BE REMOVED IN NEXT RELEASE!!!
 */
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin, PluginKey } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { Editor, Extension } from "@tiptap/react";

export enum VimMode {
  NORMAL = "NORMAL",
  INSERT = "INSERT",
  VISUAL = "VISUAL",
  COMMAND = "COMMAND",
  REPLACE = "REPLACE",
}

export type Keymap =
  | {
      keys: string;
      type: "motion";
      motion: Motion;
    }
  | {
      keys: string;
      type: "action";
      action: Action;
    };

export enum Motion {
  // Cursor Movement
  MOVE_CURSOR_LEFT_H = "MOVE_CURSOR_LEFT_H", // h
  MOVE_CURSOR_DOWN_J = "MOVE_CURSOR_DOWN_J", // j
  MOVE_CURSOR_UP_K = "MOVE_CURSOR_UP_K", // k
  MOVE_CURSOR_RIGHT_L = "MOVE_CURSOR_RIGHT_L", // l

  JUMP_FORWARDS_TO_NEXT_WORD_W = "JUMP_FORWARDS_TO_NEXT_WORD_W", // w
  JUMP_FORWARDS_TO_END_OF_WORD_E = "JUMP_FORWARDS_TO_END_OF_WORD_E", // e

  JUMP_BACKWARDS_TO_START_OF_WORD_B = "JUMP_BACKWARDS_TO_START_OF_WORD_B", // b

  // Insert Mode
  INSERT_BEFORE_CURSOR_I = "INSERT_BEFORE_CURSOR_I", // i
  INSERT_AT_BEGINING_OF_LINE_I = "INSERT_AT_BEGINING_OF_LINE_I", // I
  APPEND_AFTER_CURSOR_A = "APPEND_AFTER_CURSOR_A", // a
  OPEN_A_NEW_LINE_O = "OPEN_A_NEW_LINE_O", // o
  OPEN_A_NEW_LINE_ABOVE_O = "OPEN_A_NEW_LINE_ABOVE_O", // O
}

export enum Action {
  Undo = "undo",
  Redo = "redo",
}

export enum TransactionMeta {
  CHANGE_MODE_TO = "CHANGE_MODE_TO",
  SET_SHOW_CURSOR = "SET_SHOW_CURSOR",
}

export type MotionFn = (editor: Editor) => boolean;
export type ActionFn = (editor: Editor) => boolean;

export interface VimExtensionOptions {
  // Keeps the user updated about the current active vim mode.
  modeUpdates: (mode: string) => void;
}

export interface VimExtensionStorage {
  editor: Editor;
  showCursor: boolean;
  currentVimMode: VimMode;
  decorationSet: DecorationSet;
  prosemirror: HTMLDivElement;
  cursorDecoration: Decoration;
}

export const defaultKeymap: Keymap[] = [
  {
    keys: "i",
    type: "motion",
    motion: Motion.INSERT_BEFORE_CURSOR_I,
  },
];

const motions: Partial<{ [key in Motion]: MotionFn }> = {
  // i
  [Motion.INSERT_BEFORE_CURSOR_I]: ({ state: { tr }, view: { dispatch } }) => {
    dispatch(tr.setMeta(TransactionMeta.CHANGE_MODE_TO, VimMode.INSERT));
    return true;
  },
};

export const VimExtension = Extension.create<
  VimExtensionOptions,
  VimExtensionStorage
>({
  name: "vim",

  addOptions() {
    return {
      modeUpdates: () => {},
    };
  },

  addStorage() {
    return {
      currentVimMode: VimMode.NORMAL,
      editor: null as unknown as Editor,
      prosemirror: null as unknown as HTMLDivElement,
      cursorDecoration: null as unknown as Decoration,
      decorationSet: null as unknown as DecorationSet,

      showCursor: false,
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    const options = this.options;
    const getStorage = () => this.storage;

    const vimModePlugin = new Plugin({
      key: new PluginKey("vimPlugin"),
      props: {
        decorations(state) {
          return this.getState(state).decorationSet;
        },
        attributes() {
          const storage = getStorage();
          return {
            "vim-active": "true",
            mode: storage.currentVimMode,
            "show-cursor": storage.showCursor ? "true" : "false",
          };
        },
        handleDOMEvents: {
          keypress: (view, event) => {
            if (getStorage().currentVimMode !== VimMode.INSERT) {
              return event.preventDefault();
            }
            return true;
          },
        },
      },
      state: {
        init: (_, state) => {
          const storage = getStorage();
          const { from, to } = state.selection;

          storage.cursorDecoration = Decoration.widget(from, () => {
            const span = document.createElement("span");
            span.className = "vim-cursor";
            span.textContent = " ";
            return span;
          });
          options.modeUpdates(storage.currentVimMode);
          storage.decorationSet = DecorationSet.create(state.doc, [
            storage.cursorDecoration,
          ]);

          return {
            mode: storage.currentVimMode,
            decorationSet: storage.decorationSet,
          };
        },
        apply: (tr, _, __, newState) => {
          const storage = getStorage();
          const { from, to } = newState.selection;

          storage.cursorDecoration = Decoration.widget(from, () => {
            const span = document.createElement("span");
            span.className = "vim-cursor";
            span.textContent = " ";
            return span;
          });
          const changeModeTo: VimMode = tr.getMeta(
            TransactionMeta.CHANGE_MODE_TO,
          );

          const vimModes = [
            VimMode.COMMAND,
            VimMode.INSERT,
            VimMode.NORMAL,
            VimMode.REPLACE,
            VimMode.VISUAL,
          ];
          if (vimModes.includes(changeModeTo)) {
            storage.currentVimMode = changeModeTo;
            options.modeUpdates(storage.currentVimMode);
          }

          const showCursorVal: boolean = tr.getMeta(
            TransactionMeta.SET_SHOW_CURSOR,
          );
          if ([true, false].includes(showCursorVal)) {
            storage.showCursor = showCursorVal;
          }

          storage.decorationSet = DecorationSet.create(newState.doc, [
            storage.cursorDecoration,
          ]);

          return {
            mode: storage.currentVimMode,
            decorationSet: storage.decorationSet,
          };
        },
      },
    });

    const handleKey = function (
      mode: VimMode,
      type: "motion" | "action",
      motion: Motion,
    ) {
      const storage = getStorage();
      if (mode && mode !== storage.currentVimMode) return false;

      if (type == "motion" && motions && motions?.[motion]) {
        return motions[motion]?.(editor);
      }

      return false;
    };

    // eslint-disable-next-line
    const baseVimKeyMap: Record<string, Function> = {};
    for (const entry of defaultKeymap) {
      if (entry.type === "motion") {
        baseVimKeyMap[entry.keys] = () =>
          handleKey(getStorage().currentVimMode, entry.type, entry.motion);
      }
    }

    // eslint-disable-next-line
    // @ts-ignore
    const vimKeymap = keymap(baseVimKeyMap);
    return [vimModePlugin, vimKeymap];
  },
});
