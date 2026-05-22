import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Generic "static page" type — used for About, Advertise, ToS, Privacy,
 * Content Guidelines, and any other flat editorial pages.
 */
export const page = defineType({
  name: "page",
  title: "Page",
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
      description: "e.g. 'about', 'advertise', 'terms-of-service'",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image (Desktop)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text (SEO)" })],
    }),
    defineField({
      name: "heroImageMobile",
      title: "Hero Image (Mobile) — optional",
      type: "image",
      options: { hotspot: true },
      description: "Leave empty to use desktop image on mobile.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
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
              {
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
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string", title: "Alt text (SEO)" })],
        }),
      ],
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
    select: { title: "title", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `/${subtitle}` }),
  },
});