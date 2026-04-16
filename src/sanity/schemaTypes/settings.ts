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
        defineField({ name: "twitter", type: "url", title: "Twitter / X" }),
        defineField({ name: "youtube", type: "url", title: "YouTube" }),
        defineField({ name: "tiktok", type: "url", title: "TikTok" }),
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
        defineField({ name: "videoFile", type: "file", title: "Video File", options: { accept: "video/*" } }),
        defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
        defineField({ name: "headline", type: "string", title: "Headline" }),
        defineField({ name: "subheadline", type: "string", title: "Sub-headline" }),
      ],
    }),
    defineField({
      name: "homepageProjects",
      title: "Homepage Folder Stack (4 cards)",
      type: "array",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title", validation: (r) => r.required() }),
            defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
            defineField({ name: "category", type: "string", title: "Category" }),
            defineField({ name: "author", type: "string", title: "Author" }),
            defineField({ name: "videoFile", type: "file", title: "Video", options: { accept: "video/*" } }),
            defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
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