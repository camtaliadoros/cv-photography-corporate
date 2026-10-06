"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Moves its photograph at a fraction of scroll speed, so the hero image
 * drifts slower than the content over it. The box is taller than the hero
 * (inset -12% top and bottom) so the drift never reveals an edge.
 */
export function HeroParallax({ children, speed = 0.3 }: { children: ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight * 1.5);
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className="absolute inset-x-0 -top-[12%] -bottom-[12%] will-change-transform">
      {children}
    </div>
  );
}
