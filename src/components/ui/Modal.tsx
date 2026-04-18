"use client";

import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  eyebrow,
  title,
  description,
  children,
}: ModalProps) {
  // Lock scroll + ESC key
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative w-full max-w-lg rounded-lg border border-white/10 bg-[#0A0A0A] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.6)] md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-red hover:text-red md:right-5 md:top-5"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1L13 13M13 1L1 13" />
          </svg>
        </button>

        <div className="pr-10 md:pr-12">
          {eyebrow && (
            <span className="mb-4 block font-montserrat text-[10px] font-bold uppercase tracking-[0.4em] text-red">
              {eyebrow}
            </span>
          )}
          <h2 className="font-poppins text-2xl font-black uppercase leading-tight text-white md:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 font-montserrat text-sm leading-relaxed text-white/65">
              {description}
            </p>
          )}
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
