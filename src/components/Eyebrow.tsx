const TONES = {
  accent: "text-vermilion",
  brass: "text-brass",
  muted: "text-muted",
  ink: "text-ink",
} as const;

/** The 10px tracked-caps label that heads each section. */
export function Eyebrow({
  children,
  tone = "accent",
  className = "",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span className={`text-[10px] tracking-[0.28em] uppercase ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
