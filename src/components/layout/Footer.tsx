"use client";

import FooterCTA from "@/components/sections/FooterCTA";

const SITEMAP_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/event" },
  { label: "Advertise", href: "/advertise" },
  { label: "Submit Work", href: "/submissions" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
];

const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Content Guidelines", href: "/content-guidelines" },
];

export default function Footer() {
  return (
    <>
      <FooterCTA />
      <footer className="bg-black">

      {/* Footer columns */}
      <div className="border-t border-white/10 px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 md:flex-row md:justify-between">
          {/* Sitemap */}
          <div>
            <h3 className="mb-4 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-white">
              Sitemap
            </h3>
            <ul className="flex flex-col gap-2">
              {SITEMAP_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-montserrat text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-white">
              Contact
            </h3>
            <a
              href="mailto:info@ObareMag.com"
              className="font-montserrat text-sm text-white/60 transition-colors hover:text-white"
            >
              info@ObareMag.com
            </a>
            <ul className="mt-4 flex gap-4">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-montserrat text-xs text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Scroll to top */}
          <div className="flex items-start">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white"
              aria-label="Back to top"
            >
              <svg
                className="h-4 w-4 text-white/60 transition-colors group-hover:text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-4 text-center">
        <p className="font-montserrat text-xs text-white/60">
          &copy; 2025 OBARE Magazine. All rights reserved.
        </p>
      </div>

      {/* Red bar at very bottom */}
      <div className="h-2 bg-red" />
    </footer>
    </>
  );
}
