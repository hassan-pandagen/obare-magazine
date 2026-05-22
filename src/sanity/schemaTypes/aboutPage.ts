import { defineType, defineField, defineArrayMember } from "sanity";
import { simpleRichText, headlineRichText } from "./shared/richText";

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
      type: "array",
      of: [headlineRichText],
      description: "Big bold title. Select words and use the highlight picker to paint them in any color.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "array",
      of: [simpleRichText],
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
    defineField({
      name: "heroImageAlt",
      title: "Hero Image — Alt Text (SEO)",
      type: "string",
      description: "Describe what's in the image for accessibility + search engines.",
    }),
    defineField({
      name: "heroRedOverlay",
      title: "Red Overlay on Hero Image?",
      type: "boolean",
      initialValue: true,
      description: "Toggle the red tint overlay on the hero photo.",
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
              type: "array",
              of: [headlineRichText],
              description: "Select words and use the highlight picker to paint them in any color.",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [simpleRichText],
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
              name: "imageAlt",
              title: "Image — Alt Text (SEO)",
              type: "string",
              description: "Describe what's in the image for accessibility + search engines.",
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
              name: "imageAspectRatio",
              title: "Image Aspect Ratio",
              type: "string",
              options: {
                list: [
                  { title: "2:3 — Portrait tall", value: "2/3" },
                  { title: "4:5 — Portrait standard", value: "4/5" },
                  { title: "3:2 — Landscape", value: "3/2" },
                  { title: "1:1 — Square", value: "1/1" },
                  { title: "4:3 — Landscape wide", value: "4/3" },
                ],
                layout: "radio",
              },
              initialValue: "4/5",
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
      type: "array",
      of: [headlineRichText],
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
              type: "array",
              of: [headlineRichText],
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [simpleRichText],
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
              name: "imageAlt",
              title: "Image — Alt Text (SEO)",
              type: "string",
              description: "Describe what's in the image for accessibility + search engines.",
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
      type: "array",
      of: [headlineRichText],
    }),
    defineField({
      name: "ctaSubtitle",
      title: "Closing Subtitle",
      type: "array",
      of: [simpleRichText],
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
