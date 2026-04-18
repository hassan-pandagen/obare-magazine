import { defineType, defineField } from "sanity";

export const reel = defineType({
  name: "reel",
  title: "Reel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Culture", "Travel", "Editorial", "Adventure", "Fashion", "Music", "Film"],
      },
    }),
    defineField({
      name: "videoFile",
      title: "Video File (9:16 portrait)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "posterImage",
      title: "Poster Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "linkedArticle",
      title: "Linked Article",
      type: "reference",
      to: [{ type: "article" }],
      description: "Optional — clicking the reel title goes to this article",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower = appears first",
      initialValue: 99,
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show on homepage reels section",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "posterImage" },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});