"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DEPARTMENTS = [
  { label: "General Enquiries", value: "general" },
  { label: "Editorial / Pitches", value: "editorial" },
  { label: "Advertising", value: "advertising" },
  { label: "Events", value: "events" },
  { label: "Partnerships", value: "partnerships" },
  { label: "Other", value: "other" },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "general",
    message: "",
  });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire to API route / email provider
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
  };

  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <section className="px-6 pb-16 pt-40 md:px-14 lg:px-20">
          <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
            Get in Touch
          </span>
          <h1 className="font-poppins text-[12vw] font-black uppercase leading-[0.85] md:text-[7vw]">
            Contact Us
          </h1>
        </section>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 md:px-14 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-16 md:grid-cols-2 md:gap-24">

              {/* Left: info */}
              <div>
                <h2 className="font-poppins text-2xl font-black uppercase">Let&apos;s talk.</h2>
                <p className="mt-4 font-montserrat text-sm leading-relaxed text-white/60">
                  Reach out about editorial pitches, advertising opportunities, event partnerships,
                  or anything else on your mind. We read every email.
                </p>

                <div className="mt-10 space-y-6 border-t border-white/10 pt-10">
                  <div>
                    <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.35em] text-red">
                      Email
                    </span>
                    <a
                      href="mailto:info@ObareMag.com"
                      className="mt-1 block font-montserrat text-sm text-white/80 transition-colors hover:text-white"
                    >
                      info@ObareMag.com
                    </a>
                  </div>
                  <div>
                    <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.35em] text-red">
                      Editorial Pitches
                    </span>
                    <a
                      href="mailto:editorial@ObareMag.com"
                      className="mt-1 block font-montserrat text-sm text-white/80 transition-colors hover:text-white"
                    >
                      editorial@ObareMag.com
                    </a>
                  </div>
                  <div>
                    <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.35em] text-red">
                      Advertising
                    </span>
                    <a
                      href="mailto:ads@ObareMag.com"
                      className="mt-1 block font-montserrat text-sm text-white/80 transition-colors hover:text-white"
                    >
                      ads@ObareMag.com
                    </a>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  {[
                    { label: "Instagram", href: "#" },
                    { label: "X / Twitter", href: "#" },
                    { label: "YouTube", href: "#" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right: form */}
              <div>
                {status === "sent" ? (
                  <div className="flex h-full flex-col items-start justify-center py-10">
                    <span className="mb-4 block font-montserrat text-xs font-bold uppercase tracking-[0.35em] text-red">
                      Message Sent
                    </span>
                    <h2 className="font-poppins text-3xl font-black uppercase">We&apos;ll be in touch.</h2>
                    <p className="mt-4 font-montserrat text-sm text-white/60">
                      Thanks for reaching out. Expect a reply within 2 business days.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-8 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white/50 underline hover:text-white"
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                          Name *
                        </span>
                        <input
                          required
                          name="name"
                          value={form.name}
                          onChange={update}
                          className="border-b border-white/20 bg-transparent pb-2 font-montserrat text-sm text-white outline-none placeholder:text-white/20 focus:border-white"
                          placeholder="Your name"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                          Email *
                        </span>
                        <input
                          required
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={update}
                          className="border-b border-white/20 bg-transparent pb-2 font-montserrat text-sm text-white outline-none placeholder:text-white/20 focus:border-white"
                          placeholder="you@example.com"
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                        Department
                      </span>
                      <select
                        name="department"
                        value={form.department}
                        onChange={update}
                        className="border-b border-white/20 bg-black pb-2 font-montserrat text-sm text-white outline-none focus:border-white"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                        Message *
                      </span>
                      <textarea
                        required
                        name="message"
                        value={form.message}
                        onChange={update}
                        rows={6}
                        className="resize-none border-b border-white/20 bg-transparent pb-2 font-montserrat text-sm text-white outline-none placeholder:text-white/20 focus:border-white"
                        placeholder="What's on your mind?"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="mt-2 self-start rounded-full bg-red px-8 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}