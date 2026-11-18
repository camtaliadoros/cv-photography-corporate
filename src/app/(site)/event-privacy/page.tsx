import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import { settingsContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Event privacy notice",
  description:
    "How Cam Velucci Photography handles personal information when covering events, and your rights if you're photographed or filmed at one.",
  alternates: { canonical: "/event-privacy" },
};

/**
 * For clients who book an event and the people photographed at it. Linked from
 * clause 10.2 of the event contract and from /privacy, not from the site nav.
 */
export default async function EventPrivacyPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery, {}, ["siteSettings"]);
  const email = settings?.contactEmail || settingsContent.contactEmail;
  const mail = <a href={`mailto:${email}`}>{email}</a>;

  return (
    <>
      <Header solid />
      <article className="mx-auto max-w-[760px] px-(--gutter) py-(--section)">
        <span className="text-[10px] tracking-[0.28em] text-vermilion uppercase">Privacy</span>
        <h1 className="mt-5 text-[clamp(34px,4vw,54px)] leading-[1.06] tracking-[-0.015em] text-ink">
          Event privacy notice
        </h1>
        <p className="mt-4 text-xs tracking-[0.16em] text-muted uppercase">Last updated November 2026</p>

        <div className="mt-12 flex flex-col gap-5 font-serif text-lg leading-[1.75] font-light text-body [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-3 [&_a:hover]:text-vermilion [&_h2]:pt-8 [&_h2]:text-[26px] [&_h2]:text-ink [&_strong]:font-normal [&_strong]:text-ink [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
          <h2>Who this covers</h2>
          <p>
            This notice explains how <strong>Cam Velucci Photography</strong> (&ldquo;I&rdquo;,
            &ldquo;me&rdquo;) handles personal information when a business books me to cover an
            event, and when you are photographed or filmed at an event I cover.
          </p>

          <h2>When you book me</h2>
          <p>
            I collect the details I need to plan and deliver your event: your name, role, company,
            email address and phone number, billing details or PO number, your answers to my
            pre-event questionnaire, and contract and payment records.
          </p>

          <h2>Photography and filming at events</h2>
          <p>
            When I cover an event, I take photographs and may film short video clips. These can show
            the people attending. I deliver edited photos and videos to the client who booked me,
            through a private online gallery. The client decides how they use them, and is
            responsible for that use once they are delivered.
          </p>

          <h2>If you attend an event I&rsquo;m covering</h2>
          <p>
            The event organiser should let you know that photography and filming will take place. If
            you don&rsquo;t want to be photographed or filmed, tell me or the organiser on the day,
            and I&rsquo;ll do my best to leave you out.
          </p>
          <p>
            If you&rsquo;d like an image of you removed after the event,{" "}
            <a href={`mailto:${email}`}>email me</a>. I&rsquo;ll remove it from the files I hold and
            ask the client to remove it from theirs. I can&rsquo;t control copies the client has
            already shared.
          </p>

          <h2>Why I can use your information</h2>
          <ul>
            <li><strong>Booked events:</strong> to carry out my contract with the client who booked me.</li>
            <li><strong>Client staff contact details:</strong> my legitimate interests in running and delivering the booking.</li>
            <li>
              <strong>Photographing and filming attendees:</strong> my legitimate interests, and the
              client&rsquo;s, in recording their event. You have the right to object, as set out above.
            </li>
          </ul>

          <h2>How long I keep it</h2>
          <ul>
            <li>
              <strong>RAW files and unedited footage:</strong> until the client&rsquo;s gallery
              expires (1 month after delivery). Obvious rejects may be deleted sooner.
            </li>
            <li>
              <strong>Delivered photos and videos:</strong> I keep an archived copy for 12 months
              after the event, in case the client needs them again.
            </li>
            <li><strong>Contracts and invoices:</strong> 6 years, for tax and legal reasons.</li>
          </ul>

          <h2>Who I share it with</h2>
          <p>I don&rsquo;t sell your information or share it for advertising. I use these services to run my business:</p>
          <ul>
            <li><strong>Pixieset</strong>: client galleries, contracts, questionnaires and invoices</li>
            <li><strong>Google Drive</strong>: storing, backing up and sharing files, including video</li>
          </ul>
          <p>Some of these providers store data outside the UK, with safeguards in place.</p>

          <h2>Using event images in my portfolio</h2>
          <p>
            I only use images from an event on my website, social media or portfolio with the
            client&rsquo;s written permission.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask to access, correct or delete your information, object to or restrict how I
            use it, or ask for a copy. Email me at {mail} and I&rsquo;ll reply within a month. You can
            also complain to the Information Commissioner&rsquo;s Office at{" "}
            <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>.
          </p>
          <p>
            For how I handle enquiries sent through this website, see my{" "}
            <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
