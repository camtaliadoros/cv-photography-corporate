# Cam Velucci — corporate event photography

The corporate site at corporate.camvelucci.com. Next.js 16 (App Router),
Sanity with the Studio embedded at `/studio`, Tailwind 4, deployed on Netlify.
Built from the Claude Design export *Corporate Landing Page v3*.

## Running it

```bash
npm install
npm run dev        # http://localhost:3220
```

`.env.local` needs:

| Variable | What it's for |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `g2mimyyi` — the "Cam Velucci Corporate" project |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_WRITE_TOKEN` | Only for `scripts/seed.mjs` |
| `SANITY_REVALIDATE_SECRET` | Shared with the Sanity webhook (see below) |
| `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID` | Enquiries — same table as the family site, `Source` = "Corporate website" |
| `RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL` | Enquiry notification and confirmation emails |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional; analytics load only when set |

## How content works

Every section renders `cms ?? fallback`. The approved design copy lives in
`src/lib/content.ts`, so the page is complete with an empty dataset and a
field cleared in the Studio falls back rather than vanishing.

`node scripts/seed.mjs` loads that same copy, and the two photographs the
design used, into Sanity. It uses `createIfNotExists`, so rerunning it never
overwrites edits.

Photo frames with no image render as flat placeholders so the grid keeps its
shape; add the photographs in the Studio under **Events** and **Home page →
About → Portrait**.

## Before launch

- Add the photographs (event details, the Claude Cyber Meetup lead, the portrait).
- Replace the testimonial's placeholder attribution ("Organiser name").
- Set the env vars above in Netlify.
- Once the domain resolves, add a Sanity webhook (project → API → Webhooks):
  POST to `https://corporate.camvelucci.com/api/revalidate`, filter
  `_type in ["homePage","siteSettings","event"]`, projection `{_type}`, with
  `SANITY_REVALIDATE_SECRET` as the secret. Without it, edits appear within
  the hour instead of on the next visit.
- `public/email-logo.png` is referenced by the confirmation email at
  the production URL — it works once the site is live.
