import { Mark, mergeAttributes } from "@tiptap/core";
import { TEXT_COLORS, type TextColorName } from "@/data/dummy";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    zeniTextColor: {
      setZeniTextColor: (colorName: TextColorName) => ReturnType;
      unsetZeniTextColor: () => ReturnType;
    };
  }
}

/**
 * Text colour drawn from a fixed palette rather than a free colour picker, so
 * the class applied can never come from author input and articles stay legible
 * against the light background. Round-trips through markdown as {{name|text}}.
 */
export const ZeniTextColor = Mark.create({
  name: "zeniTextColor",

  addAttributes() {
    return {
      colorName: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-zeni-color"),
        renderHTML: (attributes) => {
          const name = attributes.colorName as TextColorName | null;
          if (!name || !(name in TEXT_COLORS)) return {};
          return { "data-zeni-color": name, class: TEXT_COLORS[name] };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-zeni-color]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setZeniTextColor:
        (colorName: TextColorName) =>
        ({ commands }) =>
          commands.setMark(this.name, { colorName }),
      unsetZeniTextColor:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
