import { Header } from "@/components/Header";
import { Eyebrow } from "@/components/Eyebrow";
import { BracketLink, RuleLink } from "@/components/links";
import { EventBlock, type EventView } from "@/components/EventBlock";
import { EnquiryForm } from "@/components/EnquiryForm";
import { FillPhoto, Frame } from "@/components/Photo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homePageQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { HeroParallax } from "@/components/HeroParallax";
import { urlFor } from "@/sanity/lib/image";
import type { EventDoc, HomePage, SiteSettings } from "@/sanity/lib/types";
import { heroFallbackPhoto, homeContent as fb, settingsContent, type FallbackEvent } from "@/lib/content";
import { splitLeadSentence, toParagraphs, toPlainText } from "@/lib/text";
import { site } from "@/lib/site";

const shell = "mx-auto max-w-[1280px] px-(--gutter) py-(--section)";
const h2 = "text-[clamp(32px,3.6vw,48px)] leading-[1.1] tracking-[-0.015em] text-ink";
const prose = "font-serif text-lg leading-[1.75] font-light text-body";

/** "Sept 2026" — the design's short month, which en-GB formats natively. */
function monthYear(date?: string) {
  if (!date) return "";
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}

function toEventView(e: EventDoc | FallbackEvent): EventView {
  return {
    title: e.title ?? "",
    location: e.location ?? "",
    dateLabel: monthYear(e.date),
    summary: toPlainText(e.summary),
    lead: e.lead,
    details: e.details ?? [],
  };
}

export default async function HomePageRoute() {
  const [page, settings] = await Promise.all([
    sanityFetch<HomePage>(homePageQuery, {}, ["homePage", "event"]),
    sanityFetch<SiteSettings>(siteSettingsQuery, {}, ["siteSettings"]),
  ]);

  const hero = { ...fb.hero, ...stripEmpty(page?.hero) };
  const heroImage = page?.hero?.image?.asset ? page.hero.image : heroFallbackPhoto;
  const heroIntro = toPlainText(page?.hero?.intro) || fb.hero.intro;

  const whatIDo = {
    eyebrow: page?.whatIDo?.eyebrow || fb.whatIDo.eyebrow,
    heading: page?.whatIDo?.heading || fb.whatIDo.heading,
    body: nonEmpty(toParagraphs(page?.whatIDo?.body), fb.whatIDo.body),
    services: nonEmpty(page?.whatIDo?.services?.filter(Boolean), fb.whatIDo.services),
  };

  const events = (
    page?.work?.events?.filter(Boolean).length ? page.work.events.filter(Boolean) : fb.work.events
  ).map(toEventView);

  const about = {
    eyebrow: page?.about?.eyebrow || fb.about.eyebrow,
    heading: page?.about?.heading || fb.about.heading,
    body: nonEmpty(toParagraphs(page?.about?.body), fb.about.body),
  };

  const d = page?.details;
  const details = {
    eyebrow: d?.eyebrow || fb.details.eyebrow,
    priceLead: d?.priceLead || fb.details.priceLead,
    price: d?.price || fb.details.price,
    priceNote: toPlainText(d?.priceNote) || fb.details.priceNote,
    cta: d?.cta || fb.details.cta,
    items: d?.items?.length
      ? d.items.map((i) => ({ label: i.label ?? "", headline: i.headline, body: toPlainText(i.body) }))
      : fb.details.items,
  };

  const enquire = {
    eyebrow: page?.enquire?.eyebrow || fb.enquire.eyebrow,
    heading: page?.enquire?.heading || fb.enquire.heading,
    intro: toPlainText(page?.enquire?.intro) || fb.enquire.intro,
    successHeading: page?.enquire?.successHeading || fb.enquire.successHeading,
    successBody: toPlainText(page?.enquire?.successBody) || fb.enquire.successBody,
  };

  const email = settings?.contactEmail || settingsContent.contactEmail;
  const areaLine = settings?.areaLine || settingsContent.areaLine;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: "Cam Velucci Photography: Corporate Event Photography",
    image: "url" in heroImage ? heroImage.url : urlFor(heroImage).width(1200).url(),
    url: `${site.url}/`,
    email,
    description:
      "Corporate event photographer covering conferences, meetups and company events in London and Hertfordshire.",
    priceRange: "££",
    address: { "@type": "PostalAddress", addressRegion: site.region, addressCountry: "GB" },
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "AdministrativeArea", name: "Hertfordshire" },
    ],
    serviceType: "Corporate event photography",
    sameAs: [site.familySiteUrl],
  };

  return (
    <>
      {/* Hero */}
      <section
        id="top"
        className="relative flex min-h-[clamp(620px,100vh,920px)] flex-col justify-between overflow-hidden bg-ink"
      >
        <HeroParallax>
          <FillPhoto photo={heroImage} sizes="100vw" priority className="object-cover" />
        </HeroParallax>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.6)_0%,rgba(17,17,17,0.08)_28%,rgba(17,17,17,0.3)_58%,rgba(17,17,17,0.92)_100%)]"
        />
        <Header />
        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-8 px-(--gutter) pb-[clamp(40px,6vw,64px)] max-[720px]:pb-[104px]">
          <div className="flex max-w-[760px] flex-col gap-[22px]">
            <Eyebrow tone="brass">{hero.eyebrow}</Eyebrow>
            <h1 className="text-[clamp(30px,3.8vw,50px)] leading-[1.1] tracking-[-0.02em] text-paper">
              {hero.heading}
            </h1>
            <p className="max-w-[50ch] font-serif text-[clamp(17px,1.4vw,20px)] leading-[1.6] font-light text-mist">
              {heroIntro}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <BracketLink href="#enquire">{hero.primaryCta}</BracketLink>
            <RuleLink href="#work">{hero.secondaryCta}</RuleLink>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section id="what-i-do" className={shell}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] items-start gap-[clamp(36px,6vw,96px)]">
          <div className="flex flex-col gap-[22px]">
            <Eyebrow>{whatIDo.eyebrow}</Eyebrow>
            <h2 className={h2}>{whatIDo.heading}</h2>
          </div>
          <div className="flex flex-col gap-6">
            {whatIDo.body.map((p, i) => {
              const { lead, rest } = splitLeadSentence(p);
              return (
                <p key={i} className={`${prose} text-[19px]`}>
                  {lead && <strong className="font-semibold text-ink">{lead}</strong>}
                  {lead && " "}
                  {rest}
                </p>
              );
            })}
            <ul className="m-0 flex list-none flex-wrap gap-x-7 gap-y-3.5 p-0 pt-2.5">
              {whatIDo.services.map((s) => (
                <li
                  key={s}
                  className="border-b border-rule pb-1.5 text-[10px] tracking-[0.24em] text-ink uppercase"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section id="work" className="bg-frame">
        <div className={`${shell} flex flex-col gap-[clamp(56px,7vw,104px)]`}>
          <div className="flex max-w-[680px] flex-col gap-[22px]">
            <Eyebrow>{page?.work?.eyebrow || fb.work.eyebrow}</Eyebrow>
            <h2 className={h2}>{page?.work?.heading || fb.work.heading}</h2>
          </div>
          {events.map((event, i) => (
            <EventBlock key={i} event={event} index={i} />
          ))}
        </div>
      </section>

      {/* Practical details */}
      <section id="details" className="bg-ink text-paper">
        <div className={`${shell} grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] items-end gap-[clamp(56px,7vw,120px)]`}>
          <div className="flex flex-col gap-7">
            <Eyebrow tone="brass">{details.eyebrow}</Eyebrow>
            <div className="flex flex-col gap-1.5">
              <span className="font-quote text-[clamp(26px,2.6vw,34px)] text-paper/78 italic">
                {details.priceLead}
              </span>
              <span className="font-heading text-[clamp(96px,13vw,184px)] leading-[0.9] tracking-[-0.04em] text-paper">
                {details.price}
              </span>
            </div>
            <p className="max-w-[400px] font-serif text-lg leading-[1.65] font-light text-paper/78">
              {details.priceNote}
            </p>
            <BracketLink href="#enquire" className="self-start">
              {details.cta}
            </BracketLink>
          </div>
          <dl className="m-0 flex flex-col border-b border-paper/18">
            {details.items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[44px_minmax(0,1fr)] gap-5 border-t border-paper/18 py-7"
              >
                <span aria-hidden className="pt-1 font-serif text-[15px] font-light text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2.5">
                  <dt className="text-[10px] tracking-[0.26em] text-brass uppercase">{item.label}</dt>
                  <dd className="m-0 flex flex-col gap-2.5">
                    {item.headline && (
                      <span className="font-heading text-[clamp(24px,2.4vw,30px)] leading-[1.2] text-paper">
                        {item.headline}
                      </span>
                    )}
                    {item.body && (
                      <p className="font-serif text-[17px] leading-[1.65] font-light text-paper/78">
                        {item.body}
                      </p>
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className={`${shell} grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] items-center gap-[clamp(40px,6vw,96px)]`}>
          <Frame
            photo={page?.about?.portrait}
            aspect="aspect-[4/5]"
            sizes="(max-width: 760px) 100vw, 480px"
            className="w-full max-w-[480px]"
          />
          <div className="flex flex-col gap-6">
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2 className={h2}>{about.heading}</h2>
            {about.body.map((p, i) => (
              <p key={i} className={prose}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Enquire */}
      <section id="enquire">
        <div className={`${shell} grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] items-start gap-[clamp(40px,6vw,96px)]`}>
          <div className="flex flex-col gap-6">
            <Eyebrow>{enquire.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(34px,4vw,54px)] leading-[1.06] tracking-[-0.015em] text-ink">
              {enquire.heading}
            </h2>
            <p className="max-w-[44ch] font-serif text-lg leading-[1.7] font-light text-body">
              {enquire.intro}
            </p>
            <div className="flex flex-col gap-2.5 border-t border-rule pt-5">
              <a
                href={`mailto:${email}`}
                className="font-serif text-[22px] font-light text-ink transition-colors hover:text-vermilion"
              >
                {email}
              </a>
              <span className="text-[10px] tracking-[0.22em] text-muted uppercase">{areaLine}</span>
            </div>
          </div>
          <EnquiryForm
            email={email}
            successHeading={enquire.successHeading}
            successBody={enquire.successBody}
          />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

/** Drops empty strings and nulls so they don't overwrite a fallback when spread. */
function stripEmpty<T extends object>(obj: T | undefined): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => typeof v === "string" && v.trim() !== ""),
  ) as Partial<T>;
}

function nonEmpty<T>(value: T[] | undefined, fallback: T[]): T[] {
  return value && value.length ? value : fallback;
}
