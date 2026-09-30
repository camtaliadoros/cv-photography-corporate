import Link from "next/link";

/** Fixed enquiry prompt for phones, where the header's nav links are hidden. */
export function MobileBar({ text, cta }: { text: string; cta: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-60 hidden items-center justify-between gap-3.5 border-t border-ink-rule bg-ink/95 px-4 py-3 backdrop-blur-[8px] max-[720px]:flex">
      <span className="font-serif text-base text-paper italic">{text}</span>
      <Link
        href="/#enquire"
        className="inline-flex items-center bg-vermilion px-5 py-[15px] text-[10px] tracking-[0.24em] text-white uppercase"
      >
        {cta}
      </Link>
    </div>
  );
}
