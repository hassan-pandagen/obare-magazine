"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";

/**
 * Shared form field primitives in the OBARE submissions style:
 *   red uppercase labels, white text, white placeholders,
 *   underline-only borders that turn red on focus.
 */

const baseInputCls =
  "w-full border-b border-white/15 bg-transparent pb-3 font-montserrat text-sm text-white outline-none placeholder:text-white/50 transition-colors focus:border-red";

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-red">
        {label}
        {required && <span className="ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = "", ...props }, ref) {
  return <input ref={ref} className={`${baseInputCls} ${className}`} {...props} />;
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${baseInputCls} resize-none ${className}`}
      {...props}
    />
  );
});

// Custom Select — fully styled, no native browser dropdown popup
export function Select({
  name,
  value,
  onChange,
  required,
  children,
}: {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Collect options from children
  const options: { value: string; label: string; disabled?: boolean }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === "option") {
      const p = child.props as { value: string; children: string; disabled?: boolean };
      options.push({ value: p.value, label: p.children, disabled: p.disabled });
    }
  });

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (val: string) => {
    setOpen(false);
    if (onChange) {
      const fake = { target: { name: name ?? "", value: val } } as React.ChangeEvent<HTMLSelectElement>;
      onChange(fake);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Hidden real select for form validation */}
      <select name={name} value={value} onChange={onChange} required={required} className="sr-only" aria-hidden tabIndex={-1}>
        {children}
      </select>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${baseInputCls} flex w-full items-center justify-between pr-6 text-left ${!selected || selected.disabled ? "text-white/50" : "text-white"}`}
      >
        <span>{selected && !selected.disabled ? selected.label : "Select a category"}</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-xl">
          {options.filter((o) => !o.disabled).map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => pick(o.value)}
                className={`w-full px-4 py-3 text-left font-montserrat text-sm transition-colors hover:bg-white/5 hover:text-white ${value === o.value ? "text-red" : "text-white/70"}`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Checkbox({
  label,
  ...props
}: { label: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-sm border border-white/40 bg-transparent transition-colors checked:border-red checked:bg-red focus:outline-none"
        {...props}
      />
      <span className="font-montserrat text-xs leading-relaxed text-white/65">
        {label}
      </span>
    </label>
  );
}

export function SubmitButton({
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="self-start overflow-hidden rounded-full bg-red px-10 py-4 font-montserrat text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:opacity-90 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
