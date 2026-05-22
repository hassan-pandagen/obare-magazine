import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async redirects() {
    return [
      // ── Old article posts → new articles (slug preserved) ──────────────
      {
        source: "/posts/:slug",
        destination: "/articles/:slug",
        permanent: true,
      },

      // ── Old category/tag archive pages → articles index ─────────────────
      {
        source: "/article-categories/:slug*",
        destination: "/articles",
        permanent: true,
      },
      {
        source: "/tags/:slug*",
        destination: "/articles",
        permanent: true,
      },

      // ── Old specific pages → new equivalents ────────────────────────────
      { source: "/about", destination: "/about", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us-02", destination: "/about", permanent: true },
      { source: "/contact", destination: "/contact", permanent: true },
      { source: "/contact-copy", destination: "/contact", permanent: true },
      { source: "/contact-copy-2", destination: "/contact", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/submissions", destination: "/submissions", permanent: true },
      { source: "/subscribe", destination: "/newsletter", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/content-guidelines", destination: "/content-guidelines", permanent: true },
      { source: "/post-grids/articles", destination: "/articles", permanent: true },

      // ── Old home variants → homepage ────────────────────────────────────
      { source: "/old-home", destination: "/", permanent: true },
      { source: "/old-home-2", destination: "/", permanent: true },
      { source: "/old-home-4", destination: "/", permanent: true },
      { source: "/new-home", destination: "/", permanent: true },
      { source: "/new-home-02", destination: "/", permanent: true },
      { source: "/new-home-03", destination: "/", permanent: true },
      { source: "/home/:slug*", destination: "/", permanent: true },

      // ── Old post-grids → articles ───────────────────────────────────────
      { source: "/post-grids/:slug*", destination: "/articles", permanent: true },

      // ── Misc old pages → homepage ───────────────────────────────────────
      { source: "/instagram", destination: "/", permanent: true },
      { source: "/sunday-morning-view-gallery", destination: "/articles", permanent: true },
      { source: "/discover", destination: "/articles", permanent: true },
      { source: "/discover-2-0", destination: "/articles", permanent: true },
      { source: "/discover-copy", destination: "/articles", permanent: true },
      { source: "/discover-bunny-test", destination: "/articles", permanent: true },
      { source: "/search", destination: "/articles", permanent: true },
      { source: "/search-filter", destination: "/articles", permanent: true },
      { source: "/coming-soon", destination: "/", permanent: true },
      { source: "/shop", destination: "/", permanent: true },
      { source: "/checkout", destination: "/", permanent: true },
      { source: "/order-confirmation", destination: "/", permanent: true },
      { source: "/paypal-checkout", destination: "/", permanent: true },
      { source: "/log-in", destination: "/", permanent: true },
      { source: "/sign-up", destination: "/", permanent: true },
      { source: "/reset-password", destination: "/", permanent: true },
      { source: "/update-password", destination: "/", permanent: true },
      { source: "/access-denied", destination: "/", permanent: true },
      { source: "/user-account", destination: "/", permanent: true },
      { source: "/template/:slug*", destination: "/", permanent: true },
      { source: "/article-02", destination: "/articles", permanent: true },
    ];
  },
};

export default nextConfig;
