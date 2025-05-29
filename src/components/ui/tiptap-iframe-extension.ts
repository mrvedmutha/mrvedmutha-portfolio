import { Node, mergeAttributes } from "@tiptap/core";

export const Iframe = Node.create({
  name: "iframe",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: "560" },
      height: { default: "315" },
      frameborder: { default: "0" },
      allow: { default: "" },
      allowfullscreen: { default: false },
      title: { default: "" },
      referrerpolicy: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["iframe", mergeAttributes(HTMLAttributes)];
  },
});
