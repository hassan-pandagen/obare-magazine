"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
  { label: "Style Guide", href: "/style-guide" },
  { label: "Image Licensing", href: "/image-licensing" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerTopRef = useRef<HTMLSpanElement>(null);
  const hamburgerMidRef = useRef<HTMLSpanElement>(null);
  const hamburgerBotRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (self) => {
        setIsScrolled(self.progress > 0);
      },
    });
  });

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
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 md:px-10 lg:px-16">
          {/* Logo — bold */}
          <a href="/" className="relative z-50">
            <span className="font-poppins text-lg font-black tracking-[0.3em] text-white md:text-xl">
              OBARE
            </span>
          </a>

          {/* Desktop nav — bigger text */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative font-montserrat text-sm font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-red transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
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

      {/* Mobile menu — massive type */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center gap-6 bg-black"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsMobileOpen(false)}
            className="mobile-link font-poppins text-5xl font-black uppercase tracking-wide text-white transition-colors hover:text-red"
          >
            {link.label}
          </a>
        ))}
        <div className="mt-8">
          <span className="font-montserrat text-sm uppercase tracking-widest text-white/40">
            info@ObareMag.com
          </span>
        </div>
      </div>
    </>
  );
}
