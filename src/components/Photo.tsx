import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityPhoto } from "@/sanity/lib/types";
import type { FallbackPhoto } from "@/lib/content";

export type AnyPhoto = SanityPhoto | FallbackPhoto | undefined;

interface FrameProps {
  photo: AnyPhoto;
  /** Responsive sizes hint. Getting this right is most of image performance. */
  sizes: string;
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  aspect: string;
  /** Only the LCP image should set this. */
  priority?: boolean;
  className?: string;
}

function resolve(photo: AnyPhoto) {
  if (!photo) return null;
  if ("url" in photo) return { src: photo.url, alt: photo.alt, lqip: undefined };
  if (!photo.asset) return null;
  return { src: urlFor(photo).auto("format").url(), alt: photo.alt ?? "", lqip: photo.lqip };
}

/** A photograph filling whatever box its parent gives it. */
export function FillPhoto({
  photo,
  sizes,
  priority,
  className = "object-cover",
}: Omit<FrameProps, "aspect">) {
  const img = resolve(photo);
  if (!img) return null;

  return (
    <Image
      src={img.src}
      alt={img.alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      placeholder={img.lqip ? "blur" : undefined}
      blurDataURL={img.lqip}
      className={className}
    />
  );
}

/**
 * A fixed-ratio frame. The design crops photographs to set ratios rather than
 * letting them dictate layout; with nothing to show, the frame stays as a
 * quiet placeholder so the grid keeps its shape.
 */
export function Frame({ photo, sizes, aspect, priority, className = "" }: FrameProps) {
  return (
    <div className={`relative min-w-0 overflow-hidden bg-frame ${aspect} ${className}`}>
      <FillPhoto photo={photo} sizes={sizes} priority={priority} />
    </div>
  );
}
