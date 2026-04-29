"use client";

import { useEffect, useState } from "react";

// TEMP diagnostic — visit /?debug=1 to enable. Walks the ancestor tree of
// the first .folder-section and prints anything that could break CSS sticky
// (transform, overflow, contain, filter on any ancestor → new containing
// block → sticky becomes relative-to-that-ancestor instead of viewport).
// Refreshes on scroll so the rect numbers reflect the current state.
export default function DebugOverlay() {
  const [show, setShow] = useState(false);
  const [report, setReport] = useState<string>("Collecting...");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "1") return;
    setShow(true);

    const collect = () => {
      const sections = document.querySelectorAll<HTMLElement>(".folder-section");
      if (!sections.length) {
        setReport("No .folder-section elements found");
        return;
      }

      const out: string[] = [];
      out.push(`UA: ${navigator.userAgent.substring(0, 90)}`);
      out.push(`win: ${window.innerWidth}x${window.innerHeight} dpr=${window.devicePixelRatio}`);
      if (window.visualViewport) {
        const vv = window.visualViewport;
        out.push(`vv: ${Math.round(vv.width)}x${Math.round(vv.height)} offY=${Math.round(vv.offsetTop)} scl=${vv.scale.toFixed(2)}`);
      }
      out.push(`docH: ${document.documentElement.scrollHeight} scrollY: ${Math.round(window.scrollY)}`);
      out.push(`sections: ${sections.length}`);

      // Confirm which layout branch the FolderSection chose. The desktop+video
      // variant uses a CSS grid — if we find one of those on a narrow screen,
      // matchMedia is misreporting and we're in the wrong branch.
      const mqDesktop = window.matchMedia("(min-width: 768px)").matches;
      const splitGrids = document.querySelectorAll(".folder-card .grid").length;
      const fullBleeds = sections.length - splitGrids;
      out.push(`mq(min-w:768)=${mqDesktop} | layout: ${splitGrids}=desktop-split, ${fullBleeds}=mobile-full`);
      out.push("");

      out.push("=== SECTIONS (first 3) ===");
      for (let i = 0; i < Math.min(3, sections.length); i++) {
        const s = sections[i];
        const r = s.getBoundingClientRect();
        const cs = window.getComputedStyle(s);
        out.push(`[${i}] pos=${cs.position} top=${cs.top} z=${cs.zIndex}`);
        out.push(`    rect: x=${Math.round(r.left)} y=${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        const clip = cs.clipPath !== "none" ? cs.clipPath.substring(0, 25) : "none";
        out.push(`    overflow=${cs.overflow} clip=${clip}`);
      }
      out.push("");

      out.push("=== ANCESTRY of section[0] ===");
      let el: HTMLElement | null = sections[0];
      let depth = 0;
      while (el && depth < 15) {
        const tag = el.tagName.toLowerCase();
        const clsRaw = typeof el.className === "string" ? el.className : "";
        const cls = clsRaw.substring(0, 38);
        const cs = window.getComputedStyle(el);

        const breakers: string[] = [];
        if (cs.transform !== "none") breakers.push(`tf`);
        if (cs.filter !== "none") breakers.push(`flt`);
        if (cs.perspective !== "none") breakers.push(`psp`);
        if (cs.willChange !== "auto") breakers.push(`wc=${cs.willChange.substring(0, 12)}`);
        if (cs.contain !== "none") breakers.push(`ct=${cs.contain}`);
        if (cs.overflow !== "visible") breakers.push(`ov=${cs.overflow}`);
        if (cs.overflowX !== "visible") breakers.push(`ovX=${cs.overflowX}`);
        if (cs.overflowY !== "visible") breakers.push(`ovY=${cs.overflowY}`);
        const flag = breakers.length ? " <<" : "";

        out.push(`${depth} <${tag}.${cls}>${flag}`);
        out.push(`  pos=${cs.position} h=${Math.round(parseFloat(cs.height) || 0)}`);
        if (breakers.length) out.push(`  ${breakers.join(" ")}`);
        el = el.parentElement;
        depth++;
      }

      setReport(out.join("\n"));
    };

    const t1 = window.setTimeout(collect, 1500);

    let scrollTimer: number | null = null;
    const onScroll = () => {
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(collect, 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(t1);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      onClick={() => setCollapsed((c) => !c)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        background: "rgba(0,0,0,0.92)",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: "10px",
        lineHeight: "1.35",
        padding: "6px 8px",
        maxHeight: collapsed ? "22px" : "65vh",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        borderBottom: "2px solid #f00",
      }}
    >
      {collapsed ? "[debug — tap to expand]" : report}
    </div>
  );
}
