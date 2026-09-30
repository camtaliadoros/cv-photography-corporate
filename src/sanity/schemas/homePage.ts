import { defineField, defineType } from "sanity";
import { eyebrow, paragraphs, photo } from "./shared";

const group = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: "object", options: { collapsible: true }, fields });

export default defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    group("hero", "Hero", [
      eyebrow(),
      defineField({ name: "heading", title: "Heading (H1)", type: "string" }),
      defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
      photo("image", "Hero photograph", false),
      defineField({ name: "primaryCta", title: "Primary button", type: "string" }),
      defineField({ name: "secondaryCta", title: "Secondary link", type: "string" }),
    ]),
    group("whatIDo", "What I do", [
      eyebrow(),
      defineField({ name: "heading", title: "Heading", type: "string" }),
      paragraphs(),
      defineField({ name: "services", title: "Services", type: "array", of: [{ type: "string" }] }),
    ]),
    group("work", "Selected work", [
      eyebrow(),
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({
        name: "events",
        title: "Events",
        description: "Drag to reorder. Alternate events flip their layout automatically.",
        type: "array",
        of: [{ type: "reference", to: [{ type: "event" }] }],
      }),
    ]),
    group("testimonial", "Testimonial", [
      eyebrow(),
      defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
      defineField({
        name: "attribution",
        title: "Attribution",
        type: "string",
        description: "e.g. 'Jane Smith · Claude Cyber Meetup, London'",
      }),
    ]),
    group("about", "About", [
      eyebrow(),
      defineField({ name: "heading", title: "Heading", type: "string" }),
      paragraphs(),
      photo("portrait", "Portrait", false),
    ]),
    group("details", "Practical details", [
      eyebrow(),
      defineField({ name: "priceLead", title: "Price lead-in", type: "string", description: "e.g. 'Coverage from'" }),
      defineField({ name: "price", title: "Price", type: "string", description: "e.g. '£350'" }),
      defineField({ name: "priceNote", title: "Price note", type: "text", rows: 2 }),
      defineField({ name: "cta", title: "Button", type: "string" }),
      defineField({
        name: "items",
        title: "Details",
        type: "array",
        of: [
          {
            type: "object",
            name: "detail",
            fields: [
              defineField({ name: "label", title: "Label", type: "string" }),
              defineField({ name: "headline", title: "Headline (optional)", type: "string" }),
              defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            ],
            preview: { select: { title: "label", subtitle: "body" } },
          },
        ],
      }),
    ]),
    group("enquire", "Enquire", [
      eyebrow(),
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
      defineField({ name: "successHeading", title: "Thank-you heading", type: "string" }),
      defineField({ name: "successBody", title: "Thank-you message", type: "text", rows: 3 }),
    ]),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
