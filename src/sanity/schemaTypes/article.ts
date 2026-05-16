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
            defineField({
              name: "photo",
              type: "image",
              title: "Photo",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", type: "string", title: "Alt text (SEO)" }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Use them based on structure: FEATURE = default · STORY = when the writing is more narrative · " +
        "GOING BARE = when the emotional transformation is the main hook · " +
        "INTERVIEW = when the article is mostly the model's direct voice. " +
        "Add new categories in the Categories section of the Studio.",
      options: {
        list: [
          { title: "Feature", value: "Feature" },
          { title: "Story", value: "Story" },
          { title: "Going Bare", value: "Going Bare" },
          { title: "Interview", value: "Interview" },
        ],
        layout: "radio",
      },
      initialValue: "Feature",
    }),
    defineField({
      name: "modelName",
      title: "Model Name",
      type: "string",
      description:
        "The name of the person featured in the story (e.g. 'Ashley Rose'). " +
        "Displayed next to the category as 'CATEGORY | BY [MODEL NAME]'.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "dropCapColor",
      title: "Drop Cap Color",
      type: "string",
      description:
        "Color of the large opening letter at the start of the article body. " +
        "Pick a brand color or enter a custom hex (e.g. #e60303). Leave empty for the default brand red.",
      options: {
        list: [
          { title: "Brand Red (default)", value: "" },
          { title: "White", value: "#F5F5F0" },
          { title: "Black", value: "#0A0A0A" },
          { title: "Custom (use any hex below)", value: "custom" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "dropCapColorCustom",
      title: "Drop Cap Custom Color (hex)",
      type: "string",
      description: "Only used when 'Custom' is selected above. Example: #bb1104",
      hidden: ({ parent }) => parent?.dropCapColor !== "custom",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image (Desktop) — 16:9 landscape",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text (SEO)" }),
        defineField({ name: "caption", type: "string", title: "Caption" }),
      ],
    }),
    defineField({
      name: "coverImageMobile",
      title: "Cover Image (Mobile) — 9:16 portrait — optional",
      type: "image",
      options: { hotspot: true },
      description: "Leave empty to use desktop cover on mobile.",
    }),
    defineField({
      name: "coverVideo",
      title: "Cover Video (Desktop) — overrides image if set",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "coverVideoMobile",
      title: "Cover Video (Mobile) — 9:16 — optional",
      type: "file",
      options: { accept: "video/*" },
      description: "Leave empty to use desktop video on mobile.",
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
        // Inline image
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "imageMobile",
              type: "image",
              title: "Mobile version — optional",
              options: { hotspot: true },
              description: "Upload a vertical cut for mobile. Leave empty to use this image on mobile too.",
            }),
            defineField({ name: "alt", type: "string", title: "Alt text (SEO)" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
            defineField({
              name: "credit",
              type: "string",
              title: "Photo Credit — optional",
              description: "Photographer or source attribution (e.g. 'Jane Smith' or 'Getty'). Shown small under the image.",
            }),
            defineField({
              name: "creditUrl",
              type: "url",
              title: "Photo Credit Link — optional",
              description: "Link the credit to a portfolio, Instagram, or source URL.",
            }),
          ],
        }),
        // Inline video
        defineArrayMember({
          type: "object",
          name: "inlineVideo",
          title: "Video",
          fields: [
            defineField({
              name: "file",
              type: "file",
              title: "Video File (Desktop) — 16:9 landscape recommended",
              options: { accept: "video/*" },
              description: "Upload a 16:9 horizontal video for desktop.",
            }),
            defineField({
              name: "fileMobile",
              type: "file",
              title: "Video File (Mobile) — 9:16 portrait recommended — optional",
              options: { accept: "video/*" },
              description: "Optional — upload a 9:16 vertical cut for mobile. Leave empty to use the desktop video on mobile too.",
            }),
            defineField({ name: "posterImage", type: "image", title: "Poster (Desktop)" }),
            defineField({
              name: "posterImageMobile",
              type: "image",
              title: "Poster (Mobile) — optional",
              description: "Leave empty to use desktop poster on mobile.",
            }),
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
        // Media Carousel — TikTok/Instagram style mixed photos + videos
        defineArrayMember({
          type: "object",
          name: "mediaCarousel",
          title: "Media Carousel (Photos + Videos)",
          fields: [
            defineField({
              name: "items",
              type: "array",
              title: "Media Items",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "carouselItem",
                  fields: [
                    defineField({
                      name: "type",
                      type: "string",
                      title: "Type",
                      options: { list: [{ title: "Photo", value: "photo" }, { title: "Video", value: "video" }], layout: "radio" },
                      initialValue: "photo",
                    }),
                    defineField({ name: "image", type: "image", title: "Photo", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
                    defineField({ name: "video", type: "file", title: "Video", options: { accept: "video/*" } }),
                    defineField({ name: "poster", type: "image", title: "Video Poster" }),
                    defineField({ name: "caption", type: "string", title: "Caption" }),
                  ],
                  preview: { select: { title: "caption", type: "type" }, prepare: ({ title, type }) => ({ title: title || type || "Item" }) },
                }),
              ],
            }),
            defineField({ name: "caption", type: "string", title: "Carousel Caption" }),
          ],
          preview: { select: { title: "caption" }, prepare: ({ title }) => ({ title: title || "Media Carousel" }) },
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