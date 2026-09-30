import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import { settingsContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Cam Velucci Photography handles the details you send through the enquiry form.",
  alternates: { canonical: "/privacy" },
};

/**
 * Adapted from the family site's policy, cut down to what this site actually
 * collects: one enquiry form, no mailing list, no cookies.
 */
export default async function PrivacyPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery, {}, ["siteSettings"]);
  const email = settings?.contactEmail || settingsContent.contactEmail;
  const mail = <a href={`mailto:${email}`}>{email}</a>;

  return (
    <>
      <Header solid />
      <article className="mx-auto max-w-[760px] px-(--gutter) py-(--section)">
        <span className="text-[10px] tracking-[0.28em] text-vermilion uppercase">Privacy</span>
        <h1 className="mt-5 text-[clamp(34px,4vw,54px)] leading-[1.06] tracking-[-0.015em] text-ink">
          Privacy policy
        </h1>
        <p className="mt-4 text-xs tracking-[0.16em] text-muted uppercase">Last updated 30 September 2026</p>

        <div className="mt-12 flex flex-col gap-5 font-serif text-lg leading-[1.75] font-light text-body [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-3 [&_a:hover]:text-vermilion [&_h2]:pt-8 [&_h2]:text-[26px] [&_h2]:text-ink [&_strong]:font-normal [&_strong]:text-ink [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
          <p>
            This policy explains how <strong>Cam Velucci Photography</strong> (&ldquo;I&rdquo;,
            &ldquo;me&rdquo;) handles the information you send through this website. I am the
            data controller for it. Questions go to {mail}.
          </p>

          <h2>What I collect</h2>
          <p>When you send an enquiry, I collect your name, company, email address, and whatever you tell me about the event: its date, location and details.</p>
          <p>This site sets no cookies. Visitor numbers are counted with Plausible Analytics, which records no personal data.</p>

          <h2>How I use it</h2>
          <p>
            Only to reply to your enquiry, quote for the work, and, if you book, to arrange and
            deliver it. I won&rsquo;t add you to a mailing list or send you marketing.
          </p>

          <h2>Lawful basis</h2>
          <p>
            My <strong>legitimate interests</strong> in responding to enquiries and running my
            business, and, where relevant, taking steps at your request to enter into a contract.
          </p>

          <h2>Who else handles it</h2>
          <p>I don&rsquo;t sell or share your data. These services process it on my behalf:</p>
          <ul>
            <li><strong>Airtable</strong>: stores enquiry submissions</li>
            <li><strong>Resend</strong>: sends me the enquiry and you a confirmation</li>
            <li><strong>Netlify</strong>: hosts this website</li>
            <li><strong>Sanity</strong>: stores the words and photographs on this site (no visitor data)</li>
            <li><strong>Plausible Analytics</strong>: anonymous visitor statistics</li>
          </ul>
          <p>
            Some of these providers store data outside the UK. Where they do, the transfer is
            covered by appropriate safeguards, such as the UK extension to the EU-US Data
            Privacy Framework or Standard Contractual Clauses.
          </p>

          <h2>How long I keep it</h2>
          <p>
            As long as I need to respond to you, and for a reasonable period afterwards (normally
            up to two years) in case you get back in touch. If you book, your details are kept for
            the duration of the work and any period required for tax or legal reasons. You can ask
            me to delete your data at any time.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask to see, correct or delete the information I hold about you, object to how
            I use it, ask me to restrict it, or request a portable copy. Email {mail} and I&rsquo;ll respond within a month.
            If you&rsquo;re unhappy with how I&rsquo;ve handled your data, you can complain to the
            Information Commissioner&rsquo;s Office at{" "}
            <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>.
          </p>

          <h2>Changes</h2>
          <p>Any changes to this policy will be posted here with a new date above.</p>
        </div>
      </article>
    </>
  );
}
