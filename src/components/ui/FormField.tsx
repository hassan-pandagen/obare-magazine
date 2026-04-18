"use client";

import { forwardRef } from "react";

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

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = "", children, ...props }, ref) {
  return (
    <select ref={ref} className={`${baseInputCls} bg-black ${className}`} {...props}>
      {children}
    </select>
  );
});

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
