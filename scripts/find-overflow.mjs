/**
 * Find elements causing horizontal overflow on mobile.
 * Run: node scripts/find-overflow.mjs https://obare.vercel.app
 */
import { chromium, devices } from "playwright";

const BASE = process.argv[2] || "https://obare.vercel.app";

const browser = await chromium.launch();
const ctx = await browser.newContext(devices["Pixel 7"]);
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });

// Try to dismiss age gate
try {
  await page.getByRole("button", { name: /18 or older/i }).first().click({ timeout: 2000 });
  await page.waitForTimeout(500);
} catch {}

const overflowing = await page.evaluate(() => {
  const docWidth = document.documentElement.clientWidth;
  const offenders = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > docWidth + 1 || r.left < -1) {
      const tag = el.tagName.toLowerCase();
      const cls = (el.className || "").toString().slice(0, 80);
      const id = el.id;
      // Skip fixed/absolute decorative elements that are intentionally larger
      const pos = getComputedStyle(el).position;
      offenders.push({
        tag,
        id,
        cls,
        pos,
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        docWidth,
        overflowBy: Math.round(r.right - docWidth),
      });
    }
  });
  // Only show static/relative elements (the ones causing actual document overflow)
  return offenders.filter(o => o.pos === "static" || o.pos === "relative").slice(0, 20);
});

console.log(`\nDocument width: ${overflowing[0]?.docWidth ?? "?"}px\n`);
console.log("Top overflowing elements:");
overflowing.forEach((o, i) => {
  console.log(`${i + 1}. <${o.tag}${o.id ? "#" + o.id : ""}> overflow by +${o.overflowBy}px`);
  console.log(`   class="${o.cls}"`);
  console.log(`   left=${o.left} right=${o.right} width=${o.width}\n`);
});

await browser.close();
