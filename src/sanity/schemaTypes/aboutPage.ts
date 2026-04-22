import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * About Us page singleton — hero + 4 narrative sections + 3 pillar cards + CTA.
 * All media uploaded by editors; layout chosen per section.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Us Page",
  type: "document",
  fields: [
    /* ── Hero ──────────────────────────────────────────── */
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow (small label)",
      type: "string",
      initialValue: "About OBARE",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "The Magazine That's Real",
      description: "Big bold title. Use a | to force a line break. Wrap words in **stars** to paint them red (e.g. Who We **Are**).",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image (Desktop)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageMobile",
      title: "Hero Image (Mobile) — optional",
      type: "image",
      options: { hotspot: true },
      description: "Leave empty to use desktop image on mobile too.",
    }),

    /* ── 4 narrative sections ─────────────────────────── */
    defineField({
      name: "sections",
      title: "Content Sections",
      description:
        "Narrative blocks like Who We Are, Our Mission, Bare Models. Add as many as you need.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({
              name: "eyebrow",
              title: "Eyebrow (small label)",
              type: "string",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required(),
              description: "Wrap words in **stars** to paint them red — e.g. Bare Models **Who Are They?**",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 6,
              description: "Hit Enter for paragraph breaks. Wrap words in **stars** for red emphasis.",
            }),
            defineField({
              name: "image",
              title: "Image (Desktop)",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "imageMobile",
              title: "Image (Mobile) — optional",
              type: "image",
              options: { hotspot: true },
              description: "Leave empty to use desktop image on mobile too.",
            }),
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              options: {
                list: [
                  { title: "Image left / text right", value: "image-left" },
                  { title: "Image right / text left", value: "image-right" },
                  { title: "Full-bleed image with text overlay", value: "full-bleed" },
                ],
                layout: "radio",
              },
              initialValue: "image-right",
            }),
            defineField({
              name: "redOverlay",
              title: "Red overlay on image?",
              type: "boolean",
              initialValue: false,
              description: "Tints the image red for extra mood.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "eyebrow", media: "image" },
          },
        }),
      ],
    }),

    /* ── 3 pillars (Cultural Diversity / Health / Community) ── */
    defineField({
      name: "pillarsTitle",
      title: "Pillars Section Title",
      type: "string",
      initialValue: "Things You Should Know About Us",
    }),
    defineField({
      name: "pillars",
      title: "Pillars (max 3)",
      type: "array",
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "image",
              title: "Image (Desktop)",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "imageMobile",
              title: "Image (Mobile) — optional",
              type: "image",
              options: { hotspot: true },
              description: "Leave empty to use desktop image on mobile too.",
            }),
          ],
          preview: {
            select: { title: "title", media: "image" },
          },
        }),
      ],
    }),

    /* ── Closing CTA ──────────────────────────────────── */
    defineField({
      name: "ctaHeadline",
      title: "Closing Headline",
      type: "string",
      initialValue: "Let's Talk",
    }),
    defineField({
      name: "ctaSubtitle",
      title: "Closing Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "ctaPrimaryLabel",
      title: "Primary Button Label",
      type: "string",
      initialValue: "Get Started",
    }),
    defineField({
      name: "ctaPrimaryLink",
      title: "Primary Button Link",
      type: "string",
      initialValue: "/submissions",
    }),
    defineField({
      name: "ctaSecondaryLabel",
      title: "Secondary Button Label",
      type: "string",
      initialValue: "Contact Us",
    }),
    defineField({
      name: "ctaSecondaryLink",
      title: "Secondary Button Link",
      type: "string",
      initialValue: "/contact",
    }),
    defineField({
      name: "ctaHoverVideo",
      title: "Background Video (plays on primary button hover)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description: "Like Sanity.io — hover the primary button, video plays behind.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Us Page" }),
  },
});
