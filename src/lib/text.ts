/**
 * Content that a CMS field might hold either as a plain string or as Portable
 * Text, depending on how the document was written.
 */
export type MaybeRichText = string | { children?: { text?: string }[] }[] | null | undefined;

/**
 * Flattens a CMS text field to a plain string.
 *
 * Schemas drift — a field authored as Portable Text still returns blocks long
 * after the schema says `text`. Rendering those blocks directly throws
 * "Objects are not valid as a React child" and, in a static build, takes the
 * whole build down. Degrading to plain text keeps it readable instead.
 */
export function toPlainText(value: MaybeRichText): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (typeof block === "string") return block;
      const children = block?.children;
      if (!Array.isArray(children)) return "";
      return children.map((child) => child?.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

/** Same, for fields that hold a list of paragraphs. Empty entries are dropped. */
export function toParagraphs(value: (MaybeRichText | { children?: { text?: string }[] })[] | undefined): string[] {
  if (!Array.isArray(value)) return [];
  // A paragraph list that drifted to Portable Text holds blocks, not strings.
  return value
    .map((v) => (v && typeof v === "object" && !Array.isArray(v) ? toPlainText([v]) : toPlainText(v)))
    .filter(Boolean);
}
