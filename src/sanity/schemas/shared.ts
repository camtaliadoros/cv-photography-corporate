import { defineField } from "sanity";

/**
 * Every image on this site is a photograph with a job to do, so alt text is
 * required, and the hotspot matters because the same frame is cropped to 4:3
 * in one place and 2:3 in another.
 */
export const photo = (name = "image", title = "Photograph", required = true) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        description:
          "Describe the frame for screen readers and search, e.g. 'Speaker on stage at a tech meetup in Shoreditch, London'.",
        validation: (rule) => rule.required().max(160),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  });

export const eyebrow = (name = "eyebrow", title = "Eyebrow") =>
  defineField({
    name,
    title,
    type: "string",
    description: "The small tracked-caps label above the heading.",
  });

/** Paragraphs are kept as plain strings — the design never styles inside them. */
export const paragraphs = (name = "body", title = "Body") =>
  defineField({
    name,
    title,
    type: "array",
    of: [{ type: "text", rows: 4 }],
  });
