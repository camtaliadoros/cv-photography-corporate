import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity's CDN serves every photograph once it's in the Studio.
      { protocol: "https", hostname: "cdn.sanity.io" },
      // The built-in fallbacks point at the Pixieset gallery covers the design used.
      { protocol: "https", hostname: "images.pixieset.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Sanity assets are immutable (the URL contains a content hash), so cache hard.
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
