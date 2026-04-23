import { defineType, defineField, defineArrayMember } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
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
      name: "date",
      title: "Date & Time",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date & Time",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        defineField({ name: "venueName", type: "string", title: "Venue Name" }),
        defineField({ name: "address", type: "string", title: "Address" }),
        defineField({ name: "city", type: "string", title: "City" }),
        defineField({ name: "country", type: "string", title: "Country" }),
        defineField({ name: "mapsUrl", type: "url", title: "Google Maps URL" }),
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image (Desktop) — 16:9",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text (SEO)" })],
    }),
    defineField({
      name: "coverImageMobile",
      title: "Cover Image (Mobile) — 9:16 — optional",
      type: "image",
      options: { hotspot: true },
      description: "Leave empty to use desktop cover on mobile.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "rsvpEnabled",
      title: "Enable RSVP",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "rsvpCapacity",
      title: "RSVP Capacity (leave blank for unlimited)",
      type: "number",
    }),
    defineField({
      name: "ticketUrl",
      title: "External Ticket URL (optional)",
      type: "url",
      description: "If set, RSVP button links here instead of the internal form",
    }),
    defineField({
      name: "isFeatured",
      title: "Feature on Events page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["upcoming", "ongoing", "past", "cancelled"],
        layout: "radio",
      },
      initialValue: "upcoming",
    }),
  ],
  preview: {
    select: { title: "title", date: "date", media: "coverImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString() : "No date set",
      media,
    }),
  },
  orderings: [
    { title: "Date (upcoming first)", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
  ],
});