import { defineArrayMember, defineField } from "sanity";

const highlightAnnotation = {
  name: "highlight",
  type: "object",
  title: "Highlight Color",
  fields: [
    defineField({
      name: "color",
      type: "string",
      title: "Color",
      options: {
        list: [
          { title: "Red (brand #e60303)", value: "#e60303" },
          { title: "Red 1 — Dark (#84151b)", value: "#84151b" },
          { title: "Red 2 — Mid (#aa272d)", value: "#aa272d" },
          { title: "Red 3 — Vivid (#de0c07)", value: "#de0c07" },
          { title: "Yellow (#f0ff0a)", value: "#f0ff0a" },
          { title: "White", value: "#F5F5F0" },
        ],
        layout: "radio",
      },
      initialValue: "#e60303",
    }),
  ],
};

/** Headline rich text — highlight color only, single line, no block formatting. */
export const headlineRichText = defineArrayMember({
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  lists: [],
  marks: {
    decorators: [],
    annotations: [highlightAnnotation],
  },
});

/** Simple rich text — bold, italic, highlight color. No headings, no images. */
export const simpleRichText = defineArrayMember({
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  lists: [],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [highlightAnnotation],
  },
});
