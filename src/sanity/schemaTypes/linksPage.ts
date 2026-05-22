import { defineType, defineField, defineArrayMember } from "sanity";

export const linksPage = defineType({
  name: "linksPage",
  title: "Link-in-Bio Page (/links)",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string", initialValue: "OBARE Magazine" }),
    defineField({ name: "tagline", title: "Tagline", type: "string", initialValue: "The magazine that's real." }),
    defineField({ name: "profileImage", title: "Profile Image (circle)", type: "image", options: { hotspot: true } }),
    defineField({
      name: "bannerImage",
      title: "Banner Image (full-width header — like British Vogue logo)",
      type: "image",
      options: { hotspot: false },
      description: "Upload your logo/banner here. Shows full-width above the grid.",
    }),

    /* ── Instagram-style image grid ─────────────────────────────────── */
    defineField({
      name: "gridItems",
      title: "Instagram Tiles",
      description: "Upload image + paste URL. 3-column grid. Drag to reorder.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: "url", title: "URL", type: "string", description: "Relative (/articles/xyz) or absolute (https://…)", validation: (r) => r.required() }),
            defineField({ name: "active", title: "Show on page", type: "boolean", initialValue: true }),
          ],
          preview: {
            select: { title: "url", media: "image" },
            prepare: ({ title, media }) => ({ title, media }),
          },
        }),
      ],
    }),

    /* ── UTM tracking ───────────────────────────────────────────────── */
    defineField({ name: "utmSource", title: "UTM Source", type: "string", initialValue: "instagram" }),
    defineField({ name: "utmMedium", title: "UTM Medium", type: "string", initialValue: "bio" }),
  ],
  preview: {
    prepare: () => ({ title: "Link-in-Bio Page (/links)" }),
  },
});
