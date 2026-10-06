import { NaturalPhoto, type AnyPhoto } from "./Photo";

export interface EventView {
  title: string;
  location: string;
  dateLabel: string;
  summary: string;
  lead: AnyPhoto;
  details: AnyPhoto[];
}

/**
 * One event: a numbered headline row over a lead photo beside two details, all
 * at one shared height and shown uncropped. Every other event reverses the
 * order so the column stays uneven.
 */
export function EventBlock({ event, index }: { event: EventView; index: number }) {
  const flipped = index % 2 === 1;
  const photos = [
    <NaturalPhoto
      key="lead"
      photo={event.lead}
      fallbackRatio={4 / 3}
      sizes="(max-width: 760px) 100vw, 620px"
      className="max-md:basis-full max-md:!grow-0 md:basis-0"
    />,
    ...[event.details[0], event.details[1]].map((photo, i) => (
      <NaturalPhoto
        key={i}
        photo={photo}
        fallbackRatio={2 / 3}
        sizes="(max-width: 760px) 50vw, 300px"
        className="max-md:basis-[calc(50%-8px)] max-md:!grow-0 md:basis-0"
      />
    )),
  ];
  if (flipped) photos.reverse();

  return (
    <article className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-7 gap-y-2.5 border-b border-rule pb-[18px]">
        <div className="flex items-baseline gap-5">
          <span className="text-[10px] tracking-[0.24em] text-brass">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-[clamp(24px,2.4vw,32px)] text-ink">{event.title}</h3>
        </div>
        <span className="text-[10px] tracking-[0.24em] text-muted uppercase">
          {[event.location, event.dateLabel].filter(Boolean).join(" · ")}
        </span>
      </div>
      {event.summary && (
        <p className="max-w-[64ch] font-serif text-lg leading-[1.7] font-light text-body">
          {event.summary}
        </p>
      )}
      <div className="flex flex-wrap items-start gap-4 md:flex-nowrap">{photos}</div>
    </article>
  );
}
