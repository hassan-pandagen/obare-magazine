"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import AdvertiseModal from "@/components/modals/AdvertiseModal";
import EventModal from "@/components/modals/EventModal";
import { client } from "@/sanity/client";
import { siteLogoQuery } from "@/sanity/queries/homepage";

interface SiteLogo {
  url: string | null;
  alt: string | null;
}
const LOGO_CACHE_KEY = "obare-site-logo-v1";

type NavItem =
  | { label: string; href: string; modal?: never }
  | { label: string; modal: "advertise" | "event"; href?: never };

const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Advertise", modal: "advertise" },
  { label: "Event", modal: "event" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Submission", href: "/submissions" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openModal, setOpenModal] = useState<"advertise" | "event" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Logo is fetched client-side so we don't have to thread it through 12 page components.
  // Cached in sessionStorage on first load — subsequent page navigations are instant.
  const [logo, setLogo] = useState<SiteLogo | null>(null);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(LOGO_CACHE_KEY);
      if (cached) {
        setLogo(JSON.parse(cached));
        return;
      }
    } catch {
      // sessionStorage can throw in private mode — just fall through to fetch.
    }
    client.fetch<SiteLogo | null>(siteLogoQuery).then((l) => {
      if (!l) return;
      setLogo(l);
      try {
        sessionStorage.setItem(LOGO_CACHE_KEY, JSON.stringify(l));
      } catch {
        // ignore storage failures
      }
    }).catch(() => {
      // Silent — navbar falls back to OBARE text logo.
    });
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setIsMobileOpen(false);
    window.location.href = `/articles?q=${encodeURIComponent(q)}`;
  };
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerTopRef = useRef<HTMLSpanElement>(null);
  const hamburgerMidRef = useRef<HTMLSpanElement>(null);
  const hamburgerBotRef = useRef<HTMLSpanElement>(null);

  const [isHidden, setIsHidden] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (self) => {
        setIsScrolled(self.progress > 0);
      },
    });
  });

  // Smart-hide — hide on scroll down, show on scroll up.
  // Uses rAF throttling + a directional-accumulator so momentum-scroll
  // noise doesn't cause flicker on iOS.
  useEffect(() => {
    let lastY = window.scrollY;
    let accum = 0;
    let ticking = false;

    const check = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y < 80 || isMobileOpen) {
        setIsHidden(false);
        accum = 0;
      } else {
        // Accumulate same-direction motion; flip accumulator on reverse
        if ((accum > 0 && delta < 0) || (accum < 0 && delta > 0)) accum = 0;
        accum += delta;

        if (accum > 12) {
          setIsHidden(true);
          accum = 0;
        } else if (accum < -12) {
          setIsHidden(false);
          accum = 0;
        }
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileOpen]);

  useEffect(() => {
    const top = hamburgerTopRef.current;
    const bot = hamburgerBotRef.current;
    if (!top || !bot) return;

    // 2-bar X: top bar rotates to "/", bottom to "\", both converge to the center line.
    // Gap between bars is 7px + 3px bar height = 10px → converge by 5px each.
    if (isMobileOpen) {
      gsap.to(top, { rotate: 45, y: 5, duration: 0.3, ease: "power2.inOut" });
      gsap.to(bot, { rotate: -45, y: -5, duration: 0.3, ease: "power2.inOut" });
    } else {
      gsap.to(top, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
      gsap.to(bot, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
    }
  }, [isMobileOpen]);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (isMobileOpen) {
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(
        menu,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.inOut" }
      );
      gsap.fromTo(
        menu.querySelectorAll(".mobile-link"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.2, ease: "power2.out" }
      );
      document.documentElement.classList.add("lenis-stopped");
    } else {
      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
      document.documentElement.classList.remove("lenis-stopped");
    }
  }, [isMobileOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[transform,background-color,backdrop-filter] duration-300 ease-out will-change-transform",
          isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent",
          isHidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-10 md:py-5 lg:px-14">
          {/* Logo — uploaded image if available, else OBARE wordmark fallback */}
          <a href="/" className="relative z-50 flex items-center" aria-label="OBARE — Home">
            {logo?.url ? (
              <img
                src={logo.url}
                alt={logo.alt ?? "OBARE"}
                className="h-7 w-auto md:h-8"
                draggable={false}
              />
            ) : (
              <span
                className="font-archivo text-lg font-bold tracking-[0.25em] text-white md:text-xl"
                style={{ fontStretch: "125%" }}
              >
                OBARE
              </span>
            )}
          </a>

          {/* Desktop nav — slash-separated with red active dot */}
          <div className="hidden items-center gap-0 md:flex">
            {NAV_LINKS.map((link, i) => {
              const isActive = link.href ? pathname === link.href : false;
              const cls = cn(
                "group relative flex items-center gap-2 px-2 font-archivo text-[13px] font-bold uppercase tracking-[0.04em] transition-colors",
                isActive ? "text-red" : "text-white/80 hover:text-white"
              );
              const inner = (
                <>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-red" />}
                  {link.label}
                </>
              );
              return (
                <div key={link.label} className="flex items-center">
                  {link.modal ? (
                    <button
                      type="button"
                      onClick={() => setOpenModal(link.modal!)}
                      className={cls}
                      style={{ fontStretch: "125%" }}
                    >
                      {inner}
                    </button>
                  ) : (
                    <a href={link.href} className={cls} style={{ fontStretch: "125%" }}>
                      {inner}
                    </a>
                  )}
                  {i < NAV_LINKS.length - 1 && (
                    <span className="font-archivo text-sm text-white/30">/</span>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="ml-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all hover:border-red hover:text-red"
            >
              <SearchIcon />
            </button>
          </div>

          {/* Hamburger — two thick bars, matches client reference */}
          <button
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[7px] md:hidden"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span ref={hamburgerTopRef} className="block h-[3px] w-8 origin-center bg-white" />
            <span ref={hamburgerBotRef} className="block h-[3px] w-8 origin-center bg-white" />
            {/* Unused in the 2-bar design; kept so GSAP refs resolve cleanly. */}
            <span ref={hamburgerMidRef} className="hidden" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center gap-5 bg-black"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = link.href ? pathname === link.href : false;
          const cls = cn(
            "mobile-link flex items-center gap-3 font-archivo text-[2rem] font-bold uppercase tracking-[0.04em] transition-colors",
            isActive ? "text-red" : "text-white hover:text-red"
          );
          const inner = (
            <>
              {isActive && <span className="h-2 w-2 rounded-full bg-red" />}
              {link.label}
            </>
          );
          if (link.modal) {
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  setOpenModal(link.modal!);
                }}
                className={cls}
                style={{ fontStretch: "125%" }}
              >
                {inner}
              </button>
            );
          }
          return (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cls}
              style={{ fontStretch: "125%" }}
            >
              {inner}
            </a>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setIsMobileOpen(false);
            setSearchOpen(true);
          }}
          aria-label="Search articles"
          className="mobile-link mt-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 text-white transition-all hover:border-red hover:text-red"
        >
          <SearchIcon large />
        </button>
        <div className="mt-8">
          <span className="font-archivo text-sm uppercase tracking-widest text-white/40">
            info@ObareMag.com
          </span>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/90 px-6 pt-24 backdrop-blur-md md:pt-32"
          onClick={() => setSearchOpen(false)}
        >
          <form
            onSubmit={submitSearch}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl"
          >
            <div className="flex items-center gap-3 border-b-2 border-red pb-3">
              <SearchIcon large />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Obare"
                className="w-full bg-transparent font-poppins text-2xl font-bold text-white outline-none placeholder:text-white/30 md:text-3xl"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="ml-2 text-white/60 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1L13 13M13 1L1 13" />
                </svg>
              </button>
            </div>
            <p className="mt-4 font-montserrat text-xs uppercase tracking-[0.3em] text-white/40">
              Press Enter to search
            </p>
          </form>
        </div>
      )}

      <AdvertiseModal open={openModal === "advertise"} onClose={() => setOpenModal(null)} />
      <EventModal open={openModal === "event"} onClose={() => setOpenModal(null)} />
    </>
  );
}

function SearchIcon({ large = false }: { large?: boolean }) {
  const size = large ? 22 : 16;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}
