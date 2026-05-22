"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { optimizeImg } from "@/lib/sanityImg";
import RichText from "@/components/portable/RichText";

const CATEGORIES = [
  "Photography",
  "Videography",
  "Writing / Editorial",
  "Fashion",
  "Music",
  "Film",
  "Other",
];

export interface SubmissionsCopy {
  eyebrow?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  subtitle?: unknown[];
  formEyebrow?: string;
  formHeadline?: string;
}

export default function SubmissionsClient({
  heroBgImage,
  heroBgImageMobile,
  heroBgAlt,
  copy,
}: {
  heroBgImage?: string;
  heroBgImageMobile?: string;
  heroBgAlt?: string;
  copy?: SubmissionsCopy;
}) {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white overflow-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex flex-col justify-end px-6 pt-40 pb-16 md:px-14 lg:px-20 overflow-hidden">
          {/* Background image — mobile variant swaps via <picture> */}
          {heroBgImage && (
            <picture className="absolute inset-0 -z-0">
              {heroBgImageMobile && (
                <source
                  media="(max-width: 767px)"
                  srcSet={optimizeImg(heroBgImageMobile, { w: 900 })}
                />
              )}
              <img
                src={optimizeImg(heroBgImage, { w: 1600 })}
                alt={heroBgAlt ?? ""}
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 65%" }}
              />
            </picture>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />

          {/* Red left bar */}
          <div className="absolute left-0 top-0 h-full w-1 bg-red" />

          <div className="relative z-10 max-w-4xl">
            <span className="mb-5 inline-block rounded-full border border-red/50 px-4 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.45em] text-red">
              {copy?.eyebrow ?? "Open Call"}
            </span>
            <h1
              className="font-poppins font-black uppercase leading-[0.85] text-white"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              {copy?.headlineLine1 ?? "Your Work."}
              <br />
              <span className="text-red">{copy?.headlineLine2 ?? "On Obare Magazine."}</span>
            </h1>
            <p className="mt-8 max-w-lg font-montserrat text-base leading-relaxed text-white/55 md:text-lg">
              {copy?.subtitle ? <RichText value={copy.subtitle} /> : "We are always looking for photographers, models, and writers to share with our community."}
            </p>
          </div>
        </section>

        {/* ── WHAT WE LOOK FOR ─────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 pt-8 pb-16 md:px-14 md:py-20 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-0 md:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Original",
                  body: "Your work, your voice. No AI-generated content.",
                },
                {
                  num: "02",
                  title: "Quality",
                  body: "Best 5–10 images. 600–2,000 words for editorial.",
                },
                {
                  num: "03",
                  title: "Context",
                  body: "Tell us who you are and why this belongs in OBARE. That story matters.",
                },
                {
                  num: "04",
                  title: "Rights",
                  body: "You own everything you submit. People photographed must have consented.",
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="group relative border-l border-white/10 px-6 py-6 transition-colors hover:border-red md:px-8 md:py-10"
                >
                  <p className="font-poppins text-5xl font-black text-red/40 transition-colors group-hover:text-red">
                    {item.num}
                  </p>
                  <h3 className="mt-4 font-poppins text-xl font-black uppercase text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-montserrat text-sm leading-relaxed text-white/70">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBMISSION EMAIL ──────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 text-center md:px-14 lg:px-20">
          <p className="font-montserrat text-base leading-relaxed text-white/60 md:text-lg">
            Files (images, PDFs, video links) can be sent to{" "}
            <a
              href="mailto:editorial@ObareMag.com"
              className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-red"
            >
              editorial@ObareMag.com
            </a>
          </p>
        </section>

        {/* ── BOTTOM ───────────────────────────────────────────────────── */}
        <section className="px-6 py-10 text-center md:px-14 lg:px-20">
          <p
            className="font-poppins font-black uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
          >
            <span className="text-white">We read </span>
            <span className="text-red">every</span>
            <br />
            <span className="text-white">single </span>
            <span className="text-red">one.</span>
          </p>
        </section>

      </main>

      <Footer />
    </>
  );
}