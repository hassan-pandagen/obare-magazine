export default function StudioLayout({ children }: { children: React.ReactNode }) {
  // Studio gets its own clean layout — no GSAP, no Lenis, no site chrome.
  return <>{children}</>;
}