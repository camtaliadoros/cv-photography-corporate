import { Header } from "@/components/Header";
import { BracketLink } from "@/components/links";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col bg-ink">
      <Header solid />
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center gap-7 px-(--gutter) py-(--section)">
        <span className="text-[10px] tracking-[0.28em] text-brass uppercase">Not found</span>
        <h1 className="max-w-[16ch] text-[clamp(40px,6vw,78px)] leading-[1.04] tracking-[-0.02em] text-paper">
          That page isn&rsquo;t here
        </h1>
        <BracketLink href="/" className="self-start">
          Back to the start
        </BracketLink>
      </div>
    </main>
  );
}
