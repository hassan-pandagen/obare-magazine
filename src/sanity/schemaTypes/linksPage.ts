import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Link-in-bio page singleton.
 *
 * Route: /links
 * Used as the target for OBARE's Instagram bio link.
 * All fields editable by the client — no developer needed.
 */
export const linksPage = defineType({
  name: "linksPage",
  title: "Link-in-Bio Page (/links)",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "OBARE Magazine",
    }),
    defineField({
      name: "tagline",
      title: "Tagline / Short Bio",
      type: "text",
      rows: 2,
      initialValue: "The magazine that's real.",
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image (circular avatar)",
      type: "image",
      options: { hotspot: true },
    }),

    /* ── Featured card (top spotlight) ─────────────────────────────── */
    defineField({
      name: "featuredEnabled",
      title: "Show Featured Card at top?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featuredTitle",
      title: "Featured Title",
      type: "string",
      hidden: ({ parent }) => !parent?.featuredEnabled,
    }),
    defineField({
      name: "featuredSubtitle",
      title: "Featured Subtitle",
      type: "string",
      hidden: ({ parent }) => !parent?.featuredEnabled,
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => !parent?.featuredEnabled,
    }),
    defineField({
      name: "featuredUrl",
      title: "Featured Link URL",
      type: "string",
      description: "Can be a relative path like /articles/xyz or a full URL",
      hidden: ({ parent }) => !parent?.featuredEnabled,
    }),

    /* ── Links list ─────────────────────────────────────────────────── */
    defineField({
      name: "links",
      title: "Links",
      description: "Buttons in display order. Drag to reorder.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "sublabel",
              title: "Sub-label (optional)",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "string",
              description: "Relative (/articles/xyz) or absolute (https://…)",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "accent",
              title: "Accent style",
              type: "string",
              options: {
                list: [
                  { title: "Standard (outlined)", value: "standard" },
                  { title: "Red (primary)", value: "red" },
                  { title: "Ghost (subtle)", value: "ghost" },
                ],
                layout: "radio",
              },
              initialValue: "standard",
            }),
            defineField({
              name: "active",
              title: "Active (show on page)",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        }),
      ],
    }),

    /* ── UTM tracking ───────────────────────────────────────────────── */
    defineField({
      name: "utmSource",
      title: "UTM Source",
      type: "string",
      description: "Auto-appended to every link for analytics (e.g. 'instagram').",
      initialValue: "instagram",
    }),
    defineField({
      name: "utmMedium",
      title: "UTM Medium",
      type: "string",
      initialValue: "bio",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Link-in-Bio Page (/links)" }),
  },
});
