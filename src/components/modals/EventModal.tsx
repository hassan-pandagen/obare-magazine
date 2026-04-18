"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Field, Input, Textarea, Checkbox, SubmitButton } from "@/components/ui/FormField";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EventModal({ open, onClose }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram: "",
    interest: "",
    agreed: false,
  });

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  const reset = () => {
    setStatus("idle");
    setForm({ name: "", email: "", instagram: "", interest: "", agreed: false });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        if (status === "sent") reset();
      }}
      eyebrow="OBARE Events"
      title={status === "sent" ? "You're on the list." : "Events"}
      description={
        status === "sent"
          ? "We'll be in touch with event details and your RSVP confirmation."
          : "Get first access to OBARE events, launches, and private gatherings."
      }
    >
      {status === "sent" ? (
        <button
          onClick={() => {
            onClose();
            reset();
          }}
          className="font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-red hover:text-white"
        >
          Close →
        </button>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-6">
          <Field label="Full Name" required>
            <Input
              required
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Your name"
            />
          </Field>

          <Field label="Email" required>
            <Input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Instagram Handle">
            <Input
              name="instagram"
              value={form.instagram}
              onChange={update}
              placeholder="@yourhandle"
            />
          </Field>

          <Field label="What kind of events interest you?">
            <Textarea
              name="interest"
              value={form.interest}
              onChange={update}
              rows={3}
              placeholder="Launches, art nights, workshops, editorial showcases…"
            />
          </Field>

          <Checkbox
            required
            name="agreed"
            checked={form.agreed}
            onChange={update}
            label={
              <>
                I confirm that I&apos;ve read and agree to the{" "}
                <a href="/privacy" className="font-bold text-white underline hover:text-red">
                  Privacy Policy
                </a>
              </>
            }
          />

          <SubmitButton disabled={status === "sending" || !form.agreed}>
            {status === "sending" ? "Submitting…" : "Notify Me →"}
          </SubmitButton>
        </form>
      )}
    </Modal>
  );
}
