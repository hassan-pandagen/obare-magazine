"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import AdvertiseModal from "@/components/modals/AdvertiseModal";
import EventModal from "@/components/modals/EventModal";

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
    const mid = hamburgerMidRef.current;
    const bot = hamburgerBotRef.current;
    if (!top || !mid || !bot) return;

    if (isMobileOpen) {
      gsap.to(top, { rotate: 45, y: 8, duration: 0.3, ease: "power2.inOut" });
      gsap.to(mid, { opacity: 0, duration: 0.15 });
      gsap.to(bot, { rotate: -45, y: -8, duration: 0.3, ease: "power2.inOut" });
    } else {
      gsap.to(top, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
      gsap.to(mid, { opacity: 1, duration: 0.15, delay: 0.15 });
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
        <div className="flex items-center justify-between px-6 py-5 md:px-10 lg:px-14">
          {/* Logo */}
          <a href="/" className="relative z-50">
            <span
              className="font-archivo text-lg font-bold tracking-[0.25em] text-white md:text-xl"
              style={{ fontStretch: "125%" }}
            >
              OBARE
            </span>
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
          </div>

          {/* Hamburger */}
          <button
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span ref={hamburgerTopRef} className="block h-[2px] w-7 origin-center bg-white" />
            <span ref={hamburgerMidRef} className="block h-[2px] w-7 bg-white" />
            <span ref={hamburgerBotRef} className="block h-[2px] w-7 origin-center bg-white" />
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
            "mobile-link flex items-center gap-3 font-archivo text-3xl font-bold uppercase tracking-wide transition-colors",
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
        <div className="mt-8">
          <span className="font-archivo text-sm uppercase tracking-widest text-white/40">
            info@ObareMag.com
          </span>
        </div>
      </div>

      <AdvertiseModal open={openModal === "advertise"} onClose={() => setOpenModal(null)} />
      <EventModal open={openModal === "event"} onClose={() => setOpenModal(null)} />
    </>
  );
}
