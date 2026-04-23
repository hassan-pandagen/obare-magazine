import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Global site settings — one document, used across the whole site.
 * Covers: nav, footer, homepage hero, homepage folder-stack projects,
 * social links, contact info, and SEO defaults.
 */
export const settings = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "OBARE",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      initialValue: "info@ObareMag.com",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "instagram", type: "url", title: "Instagram" }),
        defineField({ name: "youtube", type: "url", title: "YouTube" }),
        defineField({ name: "twitter", type: "url", title: "X / Twitter" }),
        defineField({ name: "facebook", type: "url", title: "Facebook" }),
        defineField({ name: "tiktok", type: "url", title: "TikTok" }),
      ],
    }),
    defineField({
      name: "logo",
      title: "Site Logo (Navbar) — optional",
      type: "image",
      options: { hotspot: false },
      description: "Upload the OBARE logo to show in the top-left of the navbar. Leave empty to fall back to the 'OBARE' text logo.",
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text (SEO)", initialValue: "OBARE" }),
      ],
    }),
    defineField({
      name: "heroMedia",
      title: "Homepage Hero",
      type: "object",
      fields: [
        defineField({
          name: "type",
          title: "Media Type",
          type: "string",
          options: { list: ["video", "image"], layout: "radio" },
          initialValue: "video",
        }),
        defineField({ name: "videoFile", type: "file", title: "Video File (Desktop) — 16:9 landscape", options: { accept: "video/*" } }),
        defineField({
          name: "videoFileMobile",
          type: "file",
          title: "Video File (Mobile) — 9:16 portrait — optional",
          options: { accept: "video/*" },
          description: "Leave empty to use desktop video on mobile.",
        }),
        defineField({ name: "image", type: "image", title: "Image (Desktop) — 16:9", options: { hotspot: true } }),
        defineField({
          name: "imageMobile",
          type: "image",
          title: "Image (Mobile) — 9:16 — optional",
          options: { hotspot: true },
          description: "Leave empty to use desktop image on mobile.",
        }),
        defineField({
          name: "imageAlt",
          type: "string",
          title: "Image Alt Text (SEO)",
          description: "Describe what's in the image for accessibility + search engines.",
        }),
        defineField({ name: "headline", type: "string", title: "Headline" }),
        defineField({ name: "subheadline", type: "string", title: "Sub-headline" }),
      ],
    }),
    defineField({
      name: "homepageProjects",
      title: "Homepage Folder Stack (unlimited)",
      description: "Add as many cards as you want — the stack grows as you scroll. Mix videos and images for pacing.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title", validation: (r) => r.required() }),
            defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
            defineField({ name: "category", type: "string", title: "Category" }),
            defineField({ name: "author", type: "string", title: "Author" }),
            defineField({ name: "videoFile", type: "file", title: "Video", options: { accept: "video/*" } }),
            defineField({
              name: "image",
              type: "image",
              title: "Image (Desktop) — 16:9 landscape",
              options: { hotspot: true },
              description: "Upload a horizontal image (e.g. 1920×1080) for desktop viewers.",
            }),
            defineField({
              name: "imageMobile",
              type: "image",
              title: "Image (Mobile) — 9:16 portrait — optional",
              options: { hotspot: true },
              description: "Upload a vertical image (e.g. 1080×1920) for mobile. Leave empty to use the desktop image on mobile too.",
            }),
            defineField({
              name: "imageAlt",
              type: "string",
              title: "Image Alt Text (SEO)",
              description: "Describe what's in the image for accessibility + search engines.",
            }),
            defineField({
              name: "linkedArticle",
              type: "reference",
              title: "Linked Article",
              to: [{ type: "article" }],
            }),
            defineField({ name: "externalHref", type: "url", title: "External URL (if no article)" }),
          ],
          preview: {
            select: { title: "title", subtitle: "category" },
            prepare: ({ title, subtitle }) => ({ title, subtitle }),
          },
        }),
      ],
    }),
    defineField({
      name: "editorialStories",
      title: "Editorial Grid (homepage story cards)",
      type: "array",
      validation: (r) => r.max(6),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title", validation: (r) => r.required() }),
            defineField({ name: "subtitle", type: "text", title: "Subtitle", rows: 2 }),
            defineField({ name: "category", type: "string", title: "Category" }),
            defineField({
              name: "image",
              type: "image",
              title: "Image (Desktop)",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "imageMobile",
              type: "image",
              title: "Image (Mobile) — optional",
              options: { hotspot: true },
              description: "Leave empty to use desktop image on mobile too.",
            }),
            defineField({
              name: "imageAlt",
              type: "string",
              title: "Image Alt Text (SEO)",
              description: "Describe what's in the image for accessibility + search engines.",
            }),
            defineField({
              name: "accent",
              title: "Accent Color",
              type: "string",
              options: {
                list: [
                  { title: "Red", value: "bg-red" },
                  { title: "White", value: "bg-white" },
                  { title: "None", value: "bg-transparent" },
                ],
                layout: "radio",
              },
              initialValue: "bg-red",
            }),
            defineField({
              name: "linkedArticle",
              type: "reference",
              title: "Linked Article",
              to: [{ type: "article" }],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "category", media: "image" },
            prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
          },
        }),
      ],
    }),
    defineField({
      name: "footerCtaVideo",
      title: "Footer CTA — Background Video (plays on Get Started hover)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description: "Short 8-second loop recommended. Plays behind the buttons when user hovers Get Started.",
    }),
    defineField({
      name: "contactHeroImage",
      title: "Contact Us — Hero Background (Desktop)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactHeroImageMobile",
      title: "Contact Us — Hero Background (Mobile) — optional",
      type: "image",
      options: { hotspot: true },
      description: "Leave empty to use desktop image on mobile.",
    }),
    defineField({
      name: "contactHeroImageAlt",
      title: "Contact Hero — Alt Text (SEO)",
      type: "string",
      description: "Describe what's in the image for accessibility + search engines.",
    }),
    defineField({
      name: "submissionsHeroImage",
      title: "Submissions — Hero Background (Desktop)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "submissionsHeroImageMobile",
      title: "Submissions — Hero Background (Mobile) — optional",
      type: "image",
      options: { hotspot: true },
      description: "Leave empty to use desktop image on mobile.",
    }),
    defineField({
      name: "submissionsHeroImageAlt",
      title: "Submissions Hero — Alt Text (SEO)",
      type: "string",
      description: "Describe what's in the image for accessibility + search engines.",
    }),
    defineField({
      name: "seoDefaults",
      title: "SEO Defaults",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", type: "string", title: "Default meta title" }),
        defineField({ name: "metaDescription", type: "text", title: "Default meta description", rows: 2 }),
        defineField({ name: "ogImage", type: "image", title: "Default OG image" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});