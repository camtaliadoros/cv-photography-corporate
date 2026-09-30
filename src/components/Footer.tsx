import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

const small = "text-[10px] tracking-[0.24em] uppercase";

export function Footer({
  email,
  familySiteUrl,
  familySiteLabel,
  areas,
}: {
  email: string;
  familySiteUrl: string;
  familySiteLabel: string;
  areas: string;
}) {
  return (
    // The bottom padding on small screens keeps the copyright clear of the
    // fixed mobile bar.
    <footer className="bg-ink text-mist max-[720px]:pb-[72px]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-8 px-(--gutter) py-[clamp(48px,6vw,72px)]">
        <Image src={logo} alt="Cam Velucci Photography" className="block h-[60px] w-auto" sizes="270px" />
        <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
          <a href={`mailto:${email}`} className={`${small} transition-colors hover:text-brass`}>
            {email}
          </a>
          <a href={familySiteUrl} rel="noopener" className={`${small} transition-colors hover:text-brass`}>
            {familySiteLabel}
          </a>
          <span className={`${small} text-stone`}>{areas}</span>
          <Link href="/privacy" className={`${small} text-stone transition-colors hover:text-brass`}>
            Privacy
          </Link>
        </div>
      </div>
      <div className="border-t border-ink-rule">
        <div className="mx-auto max-w-[1280px] px-(--gutter) py-5 text-xs text-stone">
          © {new Date().getFullYear()} Cam Velucci Photography
        </div>
      </div>
    </footer>
  );
}
