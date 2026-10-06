import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

const navLink =
  "text-[10px] tracking-[0.28em] text-paper uppercase transition-colors duration-200 hover:text-brass";

/**
 * Sits inside the hero on the home page, over the photograph; `solid` gives it
 * its own ink ground for pages without a hero. Work, Pricing and About drop out below
 * 720px, where the fixed mobile bar takes over as the way to enquire.
 */
export function Header({ solid = false }: { solid?: boolean }) {
  return (
    <header className={solid ? "bg-ink" : "relative z-10"}>
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-(--gutter) py-[26px]">
        <Link href="/" className="flex items-center" aria-label="Cam Velucci Photography, home">
          <Image src={logo} alt="" priority className="block h-11 w-auto" sizes="200px" />
        </Link>
        <nav className="flex items-center gap-[clamp(20px,3vw,40px)]" aria-label="Main">
          <Link href="/#work" className={`${navLink} max-[720px]:hidden`}>
            Work
          </Link>
          <Link href="/#details" className={`${navLink} max-[720px]:hidden`}>
            Pricing
          </Link>
          <Link href="/#about" className={`${navLink} max-[720px]:hidden`}>
            About
          </Link>
          <Link
            href="/#enquire"
            className="border border-paper/60 px-5 py-3 text-[10px] tracking-[0.28em] text-paper uppercase transition-colors duration-[240ms] hover:bg-paper hover:text-ink"
          >
            Enquire
          </Link>
        </nav>
      </div>
    </header>
  );
}
