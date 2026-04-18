"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Field, Input, Textarea, Checkbox, SubmitButton } from "@/components/ui/FormField";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdvertiseModal({ open, onClose }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({
    email: "",
    description: "",
    instagram: "",
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
    // TODO: wire to /api/advertise or email provider
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  const reset = () => {
    setStatus("idle");
    setForm({ email: "", description: "", instagram: "", agreed: false });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        if (status === "sent") reset();
      }}
      eyebrow="Partner with OBARE"
      title={status === "sent" ? "We got it." : "Advertise with us"}
      description={
        status === "sent"
          ? "Our partnerships team will be in touch within 2–3 business days."
          : "Join brands making a real impact. Start your partnership with us today."
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
          <Field label="Email" required>
            <Input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@brand.com"
            />
          </Field>

          <Field label="Describe your product / brand" required>
            <Textarea
              required
              name="description"
              value={form.description}
              onChange={update}
              rows={4}
              placeholder="Tell us about your brand and what you'd like to partner on"
            />
          </Field>

          <Field label="Your company's Instagram handle">
            <Input
              name="instagram"
              value={form.instagram}
              onChange={update}
              placeholder="@yourbrand"
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
            {status === "sending" ? "Submitting…" : "Submit →"}
          </SubmitButton>
        </form>
      )}
    </Modal>
  );
}
