"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "obare-age-verified";

interface AgeGateProps {
  onDismiss?: () => void;
}

export default function AgeGate({ onDismiss }: AgeGateProps = {}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const confirm = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setShow(false);
    onDismiss?.();
  };

  const deny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md text-center">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.45em] text-red mb-6">
          Age Verification
        </p>
        <p
          className="font-poppins font-black uppercase text-white"
          style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 0.9 }}
          aria-label="You must be 18 or older to enter"
        >
          You must be
          <br />
          <span className="text-red">18+</span> to enter
        </p>
        <p className="mt-6 font-montserrat text-sm leading-relaxed text-white/60">
          This website contains content intended for adults only.
          By entering, you confirm you are 18 years of age or older.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={confirm}
            className="rounded-full px-10 py-4 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#c42e15" }}
          >
            I am 18 or older
          </button>
          <button
            onClick={deny}
            className="rounded-full border border-white/20 px-10 py-4 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-white"
          >
            Exit
          </button>
        </div>
        <p className="mt-8 font-montserrat text-[10px] text-white/55">
          Your response is stored locally and will not be asked again.
        </p>
      </div>
    </div>
  );
}
