import { defineType, defineField } from "sanity";

/** Stores creative submissions from visitors */
export const submission = defineType({
  name: "submission",
  title: "Submission",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Your Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required().email() }),
    defineField({ name: "instagram", title: "Instagram Handle", type: "string" }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Photography", "Videography", "Writing / Editorial", "Fashion", "Music", "Film", "Other"],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "subject", title: "Subject", type: "string", validation: (r) => r.required() }),
    defineField({ name: "message", title: "Message / Pitch", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({
      name: "files",
      title: "Attached Files",
      type: "array",
      of: [{ type: "file" }],
      description: "Up to 5 files — images, PDFs, or video",
    }),
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
      options: { list: ["new", "under_review", "accepted", "declined"], layout: "radio" },
      initialValue: "new",
    }),
    defineField({ name: "internalNotes", title: "Internal Notes", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", email: "email" },
    prepare: ({ title, subtitle, email }) => ({ title, subtitle: `${subtitle ?? ""} — ${email}` }),
  },
  orderings: [
    { title: "Newest first", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
});