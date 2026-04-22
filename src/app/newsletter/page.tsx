"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NewsletterPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire to Mailchimp / Resend / email provider
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  };

  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Full-screen sign-up (desktop) / natural flow (mobile) ────── */}
        <section className="flex flex-col items-center justify-center px-6 pb-16 pt-32 text-center md:min-h-screen md:py-0">
          {status === "sent" ? (
            <div className="max-w-lg">
              <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
                You&apos;re In
              </span>
              <h1 className="font-poppins text-5xl font-black uppercase leading-[0.9] md:text-6xl">
                Welcome to OBARE.
              </h1>
              <p className="mt-6 font-montserrat text-base leading-relaxed text-white/60">
                Expect culture, stories, and a perspective you won&apos;t find anywhere else — straight
                to your inbox.
              </p>
              <button
                onClick={() => { setStatus("idle"); setEmail(""); }}
                className="mt-8 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white/40 underline hover:text-white"
              >
                Subscribe another address
              </button>
            </div>
          ) : (
            <div className="max-w-lg w-full">
              <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
                The OBARE Newsletter
              </span>
              <h1 className="font-poppins text-5xl font-black uppercase leading-[0.9] md:text-6xl">
                Stay in the know.
              </h1>
              <p className="mx-auto mt-6 max-w-md font-montserrat text-base leading-relaxed text-white/60">
                New stories, events, and cultural dispatches delivered weekly. No fluff.
                No spam. Just OBARE.
              </p>

              <form onSubmit={submit} className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full sm:w-72 border-b border-white/30 bg-transparent pb-3 text-center font-montserrat text-sm text-white outline-none placeholder:text-white/25 focus:border-white sm:text-left"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="shrink-0 rounded-full bg-red px-8 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {status === "sending" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>

              <p className="mt-6 font-montserrat text-xs text-white/25">
                By subscribing you agree to our{" "}
                <a href="/privacy" className="underline hover:text-white/60">Privacy Policy</a>.
                Unsubscribe at any time.
              </p>
            </div>
          )}
        </section>

        {/* ── What to expect ────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-20 md:px-14 lg:px-20">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-10 md:grid-cols-3">
              {[
                { label: "Weekly Drops", body: "Fresh stories every Monday — hand-picked by the editorial team." },
                { label: "Exclusive Access", body: "Newsletter subscribers get first access to OBARE events and limited releases." },
                { label: "No Noise", body: "We don't sell your data. We don't flood your inbox. Just the good stuff." },
              ].map((item) => (
                <div key={item.label} className="border-t border-white/10 pt-8">
                  <h3 className="font-poppins text-xl font-black uppercase text-white">{item.label}</h3>
                  <p className="mt-3 font-montserrat text-sm leading-relaxed text-white/55">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}