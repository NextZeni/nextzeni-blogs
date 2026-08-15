import { Mark, mergeAttributes } from "@tiptap/core";
import { TEXT_STYLES, type TextStyleName } from "@/data/dummy";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    zeniTextStyle: {
      setZeniTextStyle: (styleName: TextStyleName) => ReturnType;
      unsetZeniTextStyle: () => ReturnType;
    };
  }
}

/**
 * A curated text style (lede / serif / small) rather than a raw font picker,
 * so every article stays inside the type hierarchy in DESIGN_GUIDELINES.md.
 * The style name round-trips through markdown as [[name|text]].
 */
export const ZeniTextStyle = Mark.create({
  name: "zeniTextStyle",

  addAttributes() {
    return {
      styleName: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-zeni-style"),
        renderHTML: (attributes) => {
          const name = attributes.styleName as TextStyleName | null;
          if (!name || !(name in TEXT_STYLES)) return {};
          return { "data-zeni-style": name, class: TEXT_STYLES[name] };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-zeni-style]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setZeniTextStyle:
        (styleName: TextStyleName) =>
        ({ commands }) =>
          commands.setMark(this.name, { styleName }),
      unsetZeniTextStyle:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
