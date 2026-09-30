import { client } from "./client";

/**
 * All content on this site changes rarely and is read on every request, so
 * everything is cached and revalidated on a timer rather than fetched fresh.
 * Tagged so a webhook can purge a single type without flushing the whole site.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: 3600, tags },
    });
  } catch (error) {
    // A CMS outage should degrade the page, not take the site down. Pages
    // fall back to their built-in defaults when this returns null.
    console.error("Sanity fetch failed:", error);
    return null;
  }
}
