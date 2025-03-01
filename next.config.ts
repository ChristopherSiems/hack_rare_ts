import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  // This is important for SVG files
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
