import { defineType, defineField } from "sanity";

/** Stores RSVP submissions from visitors */
export const rsvp = defineType({
  name: "rsvp",
  title: "RSVP",
  type: "document",
  fields: [
    defineField({
      name: "event",
      title: "Event",
      type: "reference",
      to: [{ type: "event" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "guests", title: "Number of guests (incl. yourself)", type: "number", initialValue: 1 }),
    defineField({ name: "message", title: "Message", type: "text", rows: 3 }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["pending", "confirmed", "cancelled"], layout: "radio" },
      initialValue: "pending",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email", event: "event.title" },
    prepare: ({ title, subtitle, event }) => ({ title, subtitle: `${event ?? ""} — ${subtitle}` }),
  },
  orderings: [
    { title: "Newest first", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
});