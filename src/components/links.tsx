import Link from "next/link";

/*
 * The two link treatments from the design's button explorations. Both are
 * CSS-only: hover and keyboard focus drive the same state via group variants.
 */

const corner = "absolute h-2 w-2 border-paper transition-all duration-[520ms] ease-settle group-hover:border-brass group-focus-visible:border-brass";
const revealed = "opacity-0 group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100";

/**
 * "Four corners": two brackets at rest, the other two slide in on hover and
 * all four warm to brass. Used on dark grounds only.
 */
export function BracketLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center px-[22px] py-4 text-[11px] tracking-[0.28em] text-paper uppercase outline-none ${className}`}
    >
      <span aria-hidden className={`${corner} top-0 left-0 border-t border-l`} />
      <span aria-hidden className={`${corner} right-0 bottom-0 border-r border-b`} />
      <span aria-hidden className={`${corner} ${revealed} top-0 right-0 -translate-x-1.5 translate-y-1.5 border-t border-r`} />
      <span aria-hidden className={`${corner} ${revealed} bottom-0 left-0 translate-x-1.5 -translate-y-1.5 border-b border-l`} />
      <span>{children}</span>
    </Link>
  );
}

/** "Leading rule": a short brass line that stretches as the label brightens. */
export function RuleLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 text-[11px] tracking-[0.28em] text-paper/78 uppercase transition-colors duration-400 hover:text-paper focus-visible:text-paper"
    >
      <span
        aria-hidden
        className="h-px w-3.5 bg-brass transition-[width] duration-[520ms] ease-settle group-hover:w-7 group-focus-visible:w-7"
      />
      <span>{children}</span>
    </Link>
  );
}
