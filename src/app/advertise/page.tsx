"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PACKAGES = [
  {
    name: "Digital",
    price: "From $500",
    features: [
      "Full-page banner on article pages",
      "Featured placement in newsletter",
      "1 social mention (story + post)",
      "Logo in footer for 30 days",
    ],
  },
  {
    name: "Editorial",
    price: "From $1,500",
    features: [
      "Sponsored editorial feature (600+ words)",
      "Professional photography session",
      "Featured on homepage for 7 days",
      "3 social posts across platforms",
      "Included in newsletter spotlight",
    ],
    highlighted: true,
  },
  {
    name: "Brand Partnership",
    price: "Custom",
    features: [
      "Multi-platform campaign",
      "Video reel + editorial",
      "Event presence",
      "Long-term ambassador options",
      "Custom content strategy",
    ],
  },
];

const STATS = [
  { number: "50K+", label: "Monthly Readers" },
  { number: "28K+", label: "Instagram Followers" },
  { number: "18–34", label: "Core Demographic" },
  { number: "72%", label: "Engaged Readership" },
];

export default function AdvertisePage() {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <section className="px-6 pb-16 pt-40 md:px-14 lg:px-20">
          <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
            Partner With Us
          </span>
          <h1 className="font-poppins text-[12vw] font-black uppercase leading-[0.85] md:text-[7vw]">
            Advertise
          </h1>
          <p className="mt-8 max-w-2xl font-montserrat text-base leading-relaxed text-white/65">
            Reach a curated audience of culture-conscious readers who engage deeply with the
            stories we tell. OBARE connects brands with the next generation of tastemakers.
          </p>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-black p-8 text-center">
                <p className="font-poppins text-4xl font-black text-red">{s.number}</p>
                <p className="mt-2 font-montserrat text-xs uppercase tracking-[0.3em] text-white/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Packages ─────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 md:px-14 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <span className="mb-12 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-red">
              Packages
            </span>
            <div className="grid gap-6 md:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`flex flex-col p-8 ${
                    pkg.highlighted
                      ? "bg-red text-white"
                      : "border border-white/10 text-white"
                  }`}
                >
                  <h3 className="font-poppins text-2xl font-black uppercase">{pkg.name}</h3>
                  <p className={`mt-2 font-montserrat text-sm font-bold ${pkg.highlighted ? "text-white/80" : "text-white/50"}`}>
                    {pkg.price}
                  </p>
                  <ul className="mt-8 flex flex-col gap-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className={`mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full ${pkg.highlighted ? "bg-white" : "bg-red"}`} />
                        <span className={`font-montserrat text-sm leading-snug ${pkg.highlighted ? "text-white/90" : "text-white/65"}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact"
                    className={`mt-auto pt-8 self-start font-montserrat text-xs font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-70 ${pkg.highlighted ? "text-white" : "text-red"}`}
                  >
                    Enquire →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 text-center md:px-14 lg:px-20">
          <h2 className="font-poppins text-4xl font-black uppercase md:text-5xl">
            Ready to partner?
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-montserrat text-sm leading-relaxed text-white/60">
            Every campaign is tailored. Let&apos;s build something that actually resonates with our audience.
          </p>
          <a
            href="/contact"
            className="mt-10 inline-block rounded-full bg-red px-10 py-4 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80"
          >
            Get in Touch
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}