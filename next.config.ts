import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Inline Tailwind CSS in <head> instead of external <link> — eliminates
    // the render-blocking CSS request for first-time visitors.
    inlineCss: true,
  },
};

export default nextConfig;
