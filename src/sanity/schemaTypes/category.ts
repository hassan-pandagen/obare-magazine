import { defineType, defineField } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Category name shown on articles (e.g. 'Going Bare', 'Feature', 'Interview').",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional — internal note about when to use this category.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
  orderings: [
    { title: "Title A→Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
});
