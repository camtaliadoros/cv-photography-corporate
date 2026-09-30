"use client";

import dynamic from "next/dynamic";

const StudioInner = dynamic(() => import("./StudioInner"), { ssr: false });

export default function StudioClient() {
  return <StudioInner />;
}
