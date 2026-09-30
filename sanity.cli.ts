import { defineCliConfig } from "sanity/cli";
import { readFileSync } from "node:fs";

/**
 * The Studio is embedded in the Next app at /studio, so nothing here is needed
 * to run it — this exists so the `sanity` CLI (datasets, users, webhooks) knows
 * which project it is talking to. It reads .env.local the same way the scripts
 * in scripts/ do, rather than keeping a second copy of the project id.
 */
try {
  for (const line of readFileSync(new URL(".env.local", import.meta.url), "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
} catch {
  // No .env.local (CI, a fresh clone) — fall back to whatever is in the env.
}

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
