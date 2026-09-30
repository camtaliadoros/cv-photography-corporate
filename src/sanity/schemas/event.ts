import { defineField, defineType } from "sanity";
import { photo } from "./shared";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Event name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. 'Shoreditch, London'",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Only the month and year are shown.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One or two sentences: size, format, what was covered.",
    }),
    photo("lead", "Lead photograph (landscape)", false),
    defineField({
      name: "details",
      title: "Detail photographs (portrait)",
      description: "Up to two. Shown side by side, cropped to 2:3.",
      type: "array",
      of: [{ ...photo("detail", "Photograph"), validation: undefined }],
      validation: (r) => r.max(2),
    }),
  ],
  orderings: [{ title: "Date, newest", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "location", media: "lead" },
  },
});
