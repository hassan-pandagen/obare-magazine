"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TEAM = [
  { name: "Obi Nwachukwu", role: "Editor-in-Chief & Founder" },
  { name: "Amara Keita", role: "Creative Director" },
  { name: "Zara Osei", role: "Head of Photography" },
  { name: "Kai Mensah", role: "Senior Editor" },
];

const VALUES = [
  {
    label: "Raw",
    body: "We don't airbrush reality. Every story we tell is grounded in genuine human experience — unfiltered, unapologetic, and alive.",
  },
  {
    label: "Bold",
    body: "We push into uncomfortable territory because that's where the most important conversations live. Safe is forgettable.",
  },
  {
    label: "Real",
    body: "OBARE is built on trust. With our contributors, our readers, and the communities whose stories we amplify.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-screen items-end px-6 pb-16 pt-40 md:px-14 md:pb-24 lg:px-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

          <div className="relative z-10 max-w-4xl">
            <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
              About OBARE
            </span>
            <h1 className="font-poppins text-[13vw] font-black uppercase leading-[0.85] md:text-[9vw] lg:text-[8vw]">
              The Magazine
              <br />
              That&apos;s Real.
            </h1>
            <p className="mt-8 max-w-2xl font-montserrat text-base leading-relaxed text-white/70 md:text-lg">
              OBARE is an independent editorial platform dedicated to raw expression, bold creativity,
              and stories that move people. We exist at the intersection of culture, identity, and the
              human experience — across fashion, film, music, travel, and beyond.
            </p>
          </div>
        </section>

        {/* ── Mission ──────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 md:px-14 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-16 md:grid-cols-2 md:gap-24">
              <div>
                <span className="mb-4 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-red">
                  Our Mission
                </span>
                <h2 className="font-poppins text-4xl font-black uppercase leading-[0.9] md:text-5xl">
                  Amplify voices that deserve to be heard.
                </h2>
              </div>
              <div className="flex flex-col justify-center gap-6 font-montserrat text-sm leading-relaxed text-white/65">
                <p>
                  We launched OBARE because the mainstream wasn&apos;t covering the stories that
                  mattered to us. Not with depth. Not with honesty. Not with the respect those
                  stories deserve.
                </p>
                <p>
                  So we built our own platform — one that champions independent creatives,
                  emerging voices, and under-documented subcultures. A magazine that looks as
                  good as the stories it tells.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 md:px-14 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <span className="mb-12 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-red">
              What We Stand For
            </span>
            <div className="grid gap-px bg-white/10 md:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.label} className="bg-black p-8">
                  <h3 className="mb-4 font-poppins text-3xl font-black uppercase text-white">
                    {v.label}
                  </h3>
                  <p className="font-montserrat text-sm leading-relaxed text-white/60">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 md:px-14 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <span className="mb-12 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-red">
              The Team
            </span>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {TEAM.map((member) => (
                <div key={member.name} className="group">
                  {/* Placeholder portrait */}
                  <div className="mb-4 aspect-[3/4] w-full bg-zinc-900" />
                  <p className="font-poppins text-lg font-black uppercase leading-tight text-white">
                    {member.name}
                  </p>
                  <p className="mt-1 font-montserrat text-xs text-white/50">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 text-center md:px-14 lg:px-20">
          <h2 className="font-poppins text-4xl font-black uppercase leading-[0.9] md:text-5xl">
            Want to work with us?
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-montserrat text-sm leading-relaxed text-white/60">
            Whether you&apos;re a photographer, writer, stylist, or brand — we&apos;re always open
            to collaborations that push boundaries.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="rounded-full bg-red px-8 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
            >
              Contact Us
            </a>
            <a
              href="/submissions"
              className="rounded-full border border-white/30 px-8 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-white"
            >
              Submit Work
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}