"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Placeholder events — will be replaced by Sanity data
const EVENTS = [
  {
    id: "1",
    title: "OBARE x The Collective: Art Night",
    date: "2025-08-15T19:00:00",
    endDate: "2025-08-15T23:00:00",
    venueName: "The Collective Space",
    city: "Lagos",
    country: "Nigeria",
    category: "Art & Culture",
    description:
      "An evening of curated visual art, live music, and candid conversations with creatives reshaping the African arts scene.",
    rsvpEnabled: true,
    isFeatured: true,
    status: "upcoming",
  },
  {
    id: "2",
    title: "OBARE Editorial Workshop",
    date: "2025-09-06T10:00:00",
    endDate: "2025-09-06T16:00:00",
    venueName: "Studio 14",
    city: "London",
    country: "UK",
    category: "Workshop",
    description:
      "A hands-on workshop for photographers and writers on building an editorial voice. Limited to 20 attendees.",
    rsvpEnabled: true,
    isFeatured: false,
    status: "upcoming",
  },
  {
    id: "3",
    title: "Issue 01 Launch Party",
    date: "2025-07-01T20:00:00",
    venueName: "Basement",
    city: "London",
    country: "UK",
    category: "Launch",
    description: "The official launch of OBARE Magazine Issue 01.",
    rsvpEnabled: false,
    isFeatured: false,
    status: "past",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// ── RSVP Modal ──────────────────────────────────────────────────────────────

function RSVPModal({ event, onClose }: { event: (typeof EVENTS)[0]; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", guests: "1", message: "" });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: POST to /api/rsvp route which writes to Sanity
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-5 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-black border border-white/10 p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 font-montserrat text-2xl text-white/40 hover:text-white leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {status === "sent" ? (
          <div>
            <span className="block font-montserrat text-xs font-bold uppercase tracking-[0.35em] text-red mb-4">
              RSVP Confirmed
            </span>
            <h3 className="font-poppins text-2xl font-black uppercase">You&apos;re on the list.</h3>
            <p className="mt-4 font-montserrat text-sm text-white/60">
              We&apos;ve noted your RSVP for <strong className="text-white">{event.title}</strong>. See you there.
            </p>
            <button
              onClick={onClose}
              className="mt-8 rounded-full bg-red px-8 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white hover:opacity-80"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="block font-montserrat text-xs font-bold uppercase tracking-[0.35em] text-red mb-2">
              RSVP
            </span>
            <h3 className="font-poppins text-xl font-black uppercase leading-tight mb-8">
              {event.title}
            </h3>
            <form onSubmit={submit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                  Full Name *
                </span>
                <input
                  required name="name" value={form.name} onChange={update}
                  className="border-b border-white/20 bg-transparent pb-2 font-montserrat text-sm text-white outline-none placeholder:text-white/20 focus:border-white"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                  Email *
                </span>
                <input
                  required type="email" name="email" value={form.email} onChange={update}
                  className="border-b border-white/20 bg-transparent pb-2 font-montserrat text-sm text-white outline-none placeholder:text-white/20 focus:border-white"
                  placeholder="you@example.com"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                  Guests (incl. you)
                </span>
                <select
                  name="guests" value={form.guests} onChange={update}
                  className="border-b border-white/20 bg-black pb-2 font-montserrat text-sm text-white outline-none focus:border-white"
                >
                  {["1","2","3","4","5"].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                  Message (optional)
                </span>
                <textarea
                  name="message" value={form.message} onChange={update} rows={3}
                  className="resize-none border-b border-white/20 bg-transparent pb-2 font-montserrat text-sm text-white outline-none placeholder:text-white/20 focus:border-white"
                  placeholder="Anything we should know?"
                />
              </label>
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 self-start rounded-full bg-red px-8 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white hover:opacity-80 disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Confirm RSVP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function EventPage() {
  const [rsvpEvent, setRsvpEvent] = useState<(typeof EVENTS)[0] | null>(null);

  const upcoming = EVENTS.filter((e) => e.status !== "past");
  const past = EVENTS.filter((e) => e.status === "past");

  return (
    <>
      <Navbar />

      <main className="bg-black text-white">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <section className="px-6 pb-16 pt-40 md:px-14 lg:px-20">
          <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.45em] text-red">
            What&apos;s On
          </span>
          <h1 className="font-poppins text-[12vw] font-black uppercase leading-[0.85] md:text-[7vw]">
            Events
          </h1>
        </section>

        {/* ── Upcoming ───────────────────────────────────────────────── */}
        <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
          <div className="mx-auto max-w-5xl space-y-px">
            {upcoming.map((ev) => (
              <div
                key={ev.id}
                className="group flex flex-col gap-6 border-b border-white/10 py-10 md:flex-row md:items-start md:gap-10"
              >
                {/* Date block */}
                <div className="shrink-0 md:w-28">
                  <p className="font-poppins text-4xl font-black leading-none text-red">
                    {new Date(ev.date).getDate()}
                  </p>
                  <p className="mt-1 font-montserrat text-xs uppercase tracking-[0.25em] text-white/50">
                    {new Date(ev.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                  </p>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.35em] text-red mb-2">
                    {ev.category}
                  </span>
                  <h2 className="font-poppins text-2xl font-black uppercase leading-tight md:text-3xl">
                    {ev.title}
                  </h2>
                  <p className="mt-3 font-montserrat text-xs text-white/50">
                    {formatDate(ev.date)}
                    {ev.endDate && ` · Until ${formatTime(ev.endDate)}`}
                    {" · "}
                    {ev.venueName}, {ev.city}
                  </p>
                  <p className="mt-4 max-w-xl font-montserrat text-sm leading-relaxed text-white/65">
                    {ev.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="shrink-0 flex flex-col items-start gap-3 md:items-end">
                  {ev.rsvpEnabled && (
                    <button
                      onClick={() => setRsvpEvent(ev)}
                      className="rounded-full bg-red px-6 py-2.5 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
                    >
                      RSVP
                    </button>
                  )}
                  <span
                    className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] ${
                      ev.status === "upcoming" ? "text-white/30" : "text-red"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Past Events ────────────────────────────────────────────── */}
        {past.length > 0 && (
          <section className="border-t border-white/10 px-6 py-16 md:px-14 lg:px-20">
            <div className="mx-auto max-w-5xl">
              <span className="mb-10 block font-montserrat text-xs font-bold uppercase tracking-[0.4em] text-white/30">
                Past Events
              </span>
              <div className="space-y-px">
                {past.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-baseline justify-between border-b border-white/5 py-5 opacity-40"
                  >
                    <div>
                      <h3 className="font-poppins text-lg font-black uppercase">{ev.title}</h3>
                      <p className="mt-1 font-montserrat text-xs text-white/50">
                        {formatDate(ev.date)} · {ev.venueName}, {ev.city}
                      </p>
                    </div>
                    <span className="ml-6 shrink-0 font-montserrat text-[10px] uppercase tracking-[0.25em] text-white/30">
                      Past
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {rsvpEvent && <RSVPModal event={rsvpEvent} onClose={() => setRsvpEvent(null)} />}
    </>
  );
}