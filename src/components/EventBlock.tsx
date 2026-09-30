import { Frame, type AnyPhoto } from "./Photo";

export interface EventView {
  title: string;
  location: string;
  dateLabel: string;
  summary: string;
  lead: AnyPhoto;
  details: AnyPhoto[];
}

/**
 * One event: a numbered headline row over a 4:3 lead frame beside two 2:3
 * details. Every other event flips the pair so the column stays uneven.
 */
export function EventBlock({ event, index }: { event: EventView; index: number }) {
  const flipped = index % 2 === 1;
  const details = [event.details[0], event.details[1]];

  const lead = (
    <Frame photo={event.lead} aspect="aspect-[4/3]" sizes="(max-width: 760px) 100vw, 620px" />
  );
  const pair = (
    <div className="grid min-w-0 grid-cols-2 gap-4">
      {details.map((photo, i) => (
        <Frame key={i} photo={photo} aspect="aspect-[2/3]" sizes="(max-width: 760px) 50vw, 300px" />
      ))}
    </div>
  );

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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-4">
        {flipped ? (
          <>
            {pair}
            {lead}
          </>
        ) : (
          <>
            {lead}
            {pair}
          </>
        )}
      </div>
    </article>
  );
}
