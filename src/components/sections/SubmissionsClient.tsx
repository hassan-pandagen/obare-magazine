"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Field, Input, Textarea, Select, SubmitButton } from "@/components/ui/FormField";

const CATEGORIES = [
  "Photography",
  "Videography",
  "Writing / Editorial",
  "Fashion",
  "Music",
  "Film",
  "Other",
];

export default function SubmissionsClient({ heroBgImage }: { heroBgImage?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    category: "",
    subject: "",
    message: "",
  });

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <>
      <Navbar />

      <main className="bg-black text-white overflow-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex flex-col justify-end px-6 pt-40 pb-16 md:px-14 lg:px-20 overflow-hidden">
          {/* Background image */}
          {heroBgImage && (
            <div
              className="absolute inset-0 -z-0 bg-cover"
              style={{
                backgroundImage: `url('${heroBgImage}')`,
                backgroundPosition: "center 65%",
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />

          {/* Red left bar */}
          <div className="absolute left-0 top-0 h-full w-1 bg-red" />

          <div className="relative z-10 max-w-4xl">
            <span className="mb-5 inline-block rounded-full border border-red/50 px-4 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.45em] text-red">
              Open Call
            </span>
            <h1
              className="font-poppins font-black uppercase leading-[0.85] text-white"
              style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}
            >
              Your Work.
              <br />
              <span className="text-red">Our Platform.</span>
            </h1>
            <p className="mt-8 max-w-lg font-montserrat text-base leading-relaxed text-white/55 md:text-lg">
              OBARE is always looking for photographers, videographers, writers, and creatives who
              have something real to say. Pitch us. Show us.
            </p>
          </div>
        </section>

        {/* ── WHAT WE LOOK FOR ─────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 md:px-14 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-0 md:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Original",
                  body: "Your work, your voice. No AI-generated content without clear disclosure.",
                },
                {
                  num: "02",
                  title: "Quality",
                  body: "Best 5–10 images. 600–2,000 words for editorial. Under 5 mins for video.",
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
                  className="group relative border-l border-white/10 px-8 py-10 transition-colors hover:border-red"
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

        {/* ── FORM SECTION ─────────────────────────────────────────────── */}
        <section className="relative px-6 py-0 md:px-14 lg:px-20">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red to-transparent" />

          <div className="mx-auto max-w-6xl py-20">
            <div className="grid gap-16 md:grid-cols-[1fr_1.4fr] md:gap-24">

              {/* Left: info */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="block font-montserrat text-sm font-bold uppercase tracking-[0.45em] text-red mb-6">
                    Submit Your Work
                  </span>
                  <h2 className="font-poppins text-4xl font-black uppercase leading-[0.9] md:text-5xl">
                    Ready to be seen?
                  </h2>
                  <p className="mt-6 font-montserrat text-sm leading-relaxed text-white/50">
                    Fill out the form and our editorial team will review your pitch within 2–3 weeks.
                    We reply to every submission that&apos;s a genuine fit.
                  </p>
                </div>

                <div className="mt-12 space-y-6 border-t border-white/10 pt-10">
                  <div>
                    <span className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.4em] text-red mb-1">
                      Editorial
                    </span>
                    <a
                      href="mailto:editorial@ObareMag.com"
                      className="font-montserrat text-sm text-white/60 hover:text-white transition-colors"
                    >
                      editorial@ObareMag.com
                    </a>
                  </div>
                  <div>
                    <span className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.4em] text-red mb-1">
                      Response Time
                    </span>
                    <p className="font-montserrat text-sm text-white/60">2–3 weeks</p>
                  </div>
                  <div>
                    <span className="block font-montserrat text-[9px] font-bold uppercase tracking-[0.4em] text-red mb-1">
                      Categories Open
                    </span>
                    <p className="font-montserrat text-sm text-white/60">
                      Photography · Film · Writing · Fashion · Music
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <div className="relative">
                <div className="absolute -inset-8 rounded-2xl bg-white/[0.02] hidden md:block" />

                {status === "sent" ? (
                  <div className="relative flex flex-col items-start justify-center py-16">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="block font-montserrat text-xs font-bold uppercase tracking-[0.35em] text-red mb-4">
                      Submission Received
                    </span>
                    <h2 className="font-poppins text-3xl font-black uppercase">We&apos;ve got it.</h2>
                    <p className="mt-4 max-w-sm font-montserrat text-sm leading-relaxed text-white/55">
                      Our editorial team reviews every submission. If it&apos;s a fit, we&apos;ll be in touch
                      within 2–3 weeks.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-8 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white/40 underline hover:text-white"
                    >
                      Submit another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="relative flex flex-col gap-7">
                    <div className="grid gap-7 sm:grid-cols-2">
                      <Field label="Full Name" required>
                        <Input required name="name" value={form.name} onChange={update} placeholder="Your name" />
                      </Field>
                      <Field label="Email" required>
                        <Input required type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" />
                      </Field>
                    </div>

                    <Field label="Instagram Handle">
                      <Input name="instagram" value={form.instagram} onChange={update} placeholder="@yourhandle" />
                    </Field>

                    <Field label="Category" required>
                      <Select required name="category" value={form.category} onChange={update}>
                        <option value="" disabled>Select a category</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </Select>
                    </Field>

                    <Field label="Subject / Title" required>
                      <Input required name="subject" value={form.subject} onChange={update} placeholder="What are you submitting?" />
                    </Field>

                    <Field label="Pitch / Message" required>
                      <Textarea required name="message" value={form.message} onChange={update} rows={5} placeholder="Tell us about your work, your vision, and why it belongs in OBARE." />
                    </Field>

                    <p className="font-montserrat text-[11px] leading-relaxed text-white/50">
                      Files (images, PDFs, video links) can be sent to{" "}
                      <a href="mailto:editorial@ObareMag.com" className="text-white font-semibold underline hover:text-red transition-colors">
                        editorial@ObareMag.com
                      </a>{" "}
                      with your submission title as the subject.
                    </p>

                    <SubmitButton disabled={status === "sending"}>
                      {status === "sending" ? "Submitting…" : "Submit Work →"}
                    </SubmitButton>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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