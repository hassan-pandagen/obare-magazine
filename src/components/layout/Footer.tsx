"use client";

const INSTAGRAM_IMAGES = [
  "/images/insta-1.png",
  "/images/insta-2.png",
  "/images/insta-3.png",
  "/images/insta-4.png",
  "/images/insta-5.png",
];

const SITEMAP_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
  { label: "Style Guide", href: "/style-guide" },
  { label: "Image Licensing", href: "/image-licensing" },
];

const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-black">
      {/* Instagram strip */}
      <div className="border-t border-white/10 px-6 py-12 text-center md:px-10">
        <p className="mb-8 font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-white">
          Follow Us &mdash; @OBAREMAG
        </p>
        <div className="mx-auto flex max-w-5xl justify-center gap-3 md:gap-4">
          {INSTAGRAM_IMAGES.map((img, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square w-1/5 max-w-[160px] overflow-hidden rounded-sm"
            >
              <div
                className="h-full w-full bg-zinc-800 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                <svg
                  className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Big OBARE text */}
      <div className="py-12 text-center">
        <h2 className="font-poppins text-[15vw] font-bold leading-none tracking-[0.3em] text-white md:text-[10vw]">
          OBARE
        </h2>
      </div>

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
                    className="font-montserrat text-xs text-white/40 transition-colors hover:text-white"
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
        <p className="font-montserrat text-xs text-white/30">
          &copy; 2025 OBARE Magazine. All rights reserved.
        </p>
      </div>

      {/* Red bar at very bottom */}
      <div className="h-2 bg-red" />
    </footer>
  );
}
