import { defineType, defineField, defineArrayMember } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({ name: "role", type: "string", title: "Role (e.g. Photographer)" }),
            defineField({ name: "photo", type: "image", title: "Photo", options: { hotspot: true } }),
          ],
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
        "Wellness",
        "Movement & Strength",
        "Mental Health",
        "Beauty",
        "Bare Models",
        "Features",
        "Self Improvement",
        "Inner World",
        "Travel",
        "Culture",
        "Editorial",
        "About OBARE",
      ],
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
        defineField({ name: "caption", type: "string", title: "Caption" }),
      ],
    }),
    defineField({
      name: "coverVideo",
      title: "Cover Video (overrides image if set)",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on article cards",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        // Standard text blocks
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({ name: "href", type: "url", title: "URL" }),
                  defineField({ name: "blank", type: "boolean", title: "Open in new tab" }),
                ],
              },
            ],
          },
        }),
        // Inline image
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
        }),
        // Inline video
        defineArrayMember({
          type: "object",
          name: "inlineVideo",
          title: "Video",
          fields: [
            defineField({ name: "file", type: "file", title: "Video file", options: { accept: "video/*" } }),
            defineField({ name: "posterImage", type: "image", title: "Poster image" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
            defineField({ name: "autoplay", type: "boolean", title: "Autoplay (muted loop)", initialValue: false }),
          ],
          preview: { select: { title: "caption" }, prepare: ({ title }) => ({ title: title || "Video" }) },
        }),
        // Inline reel (9:16 video)
        defineArrayMember({
          type: "object",
          name: "inlineReel",
          title: "Reel (9:16)",
          fields: [
            defineField({ name: "file", type: "file", title: "Reel file", options: { accept: "video/*" } }),
            defineField({ name: "posterImage", type: "image", title: "Poster image" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
          preview: { select: { title: "caption" }, prepare: ({ title }) => ({ title: title || "Reel" }) },
        }),
        // Image gallery
        defineArrayMember({
          type: "object",
          name: "gallery",
          title: "Image Gallery",
          fields: [
            defineField({
              name: "images",
              type: "array",
              title: "Images",
              of: [
                defineArrayMember({
                  type: "image",
                  options: { hotspot: true },
                  fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
                }),
              ],
            }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
          preview: { select: { title: "caption" }, prepare: ({ title }) => ({ title: title || "Gallery" }) },
        }),
        // Pull quote
        defineArrayMember({
          type: "object",
          name: "pullQuote",
          title: "Pull Quote",
          fields: [
            defineField({ name: "quote", type: "text", title: "Quote" }),
            defineField({ name: "attribution", type: "string", title: "Attribution" }),
          ],
          preview: { select: { title: "quote" }, prepare: ({ title }) => ({ title: title || "Pull Quote" }) },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", type: "string", title: "Meta title" }),
        defineField({ name: "metaDescription", type: "text", title: "Meta description", rows: 2 }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "authors.0.name",
      media: "coverImage",
    },
    prepare({ title, author, media }) {
      return { title, subtitle: author ? `by ${author}` : "", media };
    },
  },
  orderings: [
    { title: "Published (newest)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Title A→Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
});