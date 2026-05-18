/**
 * Cross-browser visual audit for OBARE Magazine.
 *
 * Runs Playwright across Chromium + WebKit, simulates iOS Safari, Android Chrome,
 * Samsung Internet user-agents, captures full-page scroll screenshots + console
 * errors + network failures across all major pages.
 *
 * Run:  node scripts/audit-browsers.mjs [base_url]
 * Example:  node scripts/audit-browsers.mjs https://obare.vercel.app
 *
 * Output: ./audit-output/<device>/<page>.png + audit-report.json
 */

import { chromium, webkit, devices } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.argv[2] || "https://obare.vercel.app";
const OUT_DIR = path.resolve("./audit-output");

// Pages to audit
const PAGES = [
  { name: "home", path: "/" },
  { name: "articles-index", path: "/articles" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "submissions", path: "/submissions" },
  { name: "event", path: "/event" },
  { name: "newsletter", path: "/newsletter" },
  { name: "reels", path: "/reels" },
  { name: "links", path: "/links" },
];

// Device matrix — iOS Safari, Android Chrome, Samsung Internet, Desktop
const DEVICE_PROFILES = [
  {
    name: "ios-safari-iphone15",
    engine: "webkit",
    use: devices["iPhone 15 Pro"],
  },
  {
    name: "ios-safari-ipad",
    engine: "webkit",
    use: devices["iPad (gen 11)"] || devices["iPad Pro 11"],
  },
  {
    name: "android-chrome-pixel8",
    engine: "chromium",
    use: devices["Pixel 7"],
  },
  {
    name: "samsung-internet-s24",
    engine: "chromium",
    use: {
      ...devices["Galaxy S9+"],
      userAgent:
        "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/127.0.0.0 Mobile Safari/537.36",
    },
  },
  {
    name: "desktop-chromium-1440",
    engine: "chromium",
    use: {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
  },
  {
    name: "desktop-safari-1440",
    engine: "webkit",
    use: {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
  },
];

const report = {
  baseUrl: BASE_URL,
  runAt: new Date().toISOString(),
  results: [],
};

async function dismissAgeGate(page) {
  try {
    // Click "I am 18 or older" if present
    const btn = page.getByRole("button", { name: /18 or older/i }).first();
    await btn.click({ timeout: 1500 });
    await page.waitForTimeout(300);
  } catch {}
}

async function auditPage(browser, deviceName, deviceUse, pg) {
  const context = await browser.newContext(deviceUse);
  const page = await context.newPage();

  const errors = [];
  const networkFailures = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push({ text: msg.text() });
  });
  page.on("pageerror", (err) => {
    errors.push({ text: err.message, stack: err.stack });
  });
  page.on("requestfailed", (req) => {
    networkFailures.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  const url = `${BASE_URL}${pg.path}`;
  let loadOk = true;
  let loadError;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch (e) {
    loadOk = false;
    loadError = e.message;
  }

  await dismissAgeGate(page);
  // Allow GSAP / hero animations to settle
  await page.waitForTimeout(1500);

  const outDir = path.join(OUT_DIR, deviceName);
  await fs.mkdir(outDir, { recursive: true });

  // Above-the-fold screenshot
  try {
    await page.screenshot({
      path: path.join(outDir, `${pg.name}-fold.png`),
      fullPage: false,
    });
  } catch {}

  // Full-page scroll screenshot
  try {
    await page.screenshot({
      path: path.join(outDir, `${pg.name}-full.png`),
      fullPage: true,
    });
  } catch (e) {
    errors.push({ text: `Full-page screenshot failed: ${e.message}` });
  }

  // Measure scroll behavior issues — check if page is shorter than expected
  const metrics = await page.evaluate(() => ({
    docHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    bodyOverflowX: getComputedStyle(document.body).overflowX,
    htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
    horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    fixedElementsCount: document.querySelectorAll('[style*="position: fixed"], .fixed').length,
    videoCount: document.querySelectorAll("video").length,
  }));

  await context.close();

  return {
    device: deviceName,
    page: pg.name,
    url,
    loadOk,
    loadError,
    errors,
    networkFailures,
    metrics,
  };
}

async function runForEngine(engineName, profiles) {
  const browser = await (engineName === "webkit" ? webkit : chromium).launch();

  for (const profile of profiles) {
    console.log(`\n  📱 ${profile.name}`);
    for (const pg of PAGES) {
      process.stdout.write(`     ${pg.name}... `);
      const result = await auditPage(browser, profile.name, profile.use, pg);
      report.results.push(result);
      const flag =
        !result.loadOk
          ? "❌ FAILED"
          : result.errors.length
          ? `⚠️  ${result.errors.length} err`
          : result.metrics.horizontalScroll
          ? "⚠️  h-scroll"
          : "✅";
      console.log(flag);
    }
  }

  await browser.close();
}

async function main() {
  console.log(`\n🔍  Auditing ${BASE_URL}\n`);
  await fs.mkdir(OUT_DIR, { recursive: true });

  const webkitProfiles = DEVICE_PROFILES.filter((d) => d.engine === "webkit");
  const chromiumProfiles = DEVICE_PROFILES.filter((d) => d.engine === "chromium");

  console.log("🧭 WebKit (Safari engine)");
  await runForEngine("webkit", webkitProfiles);

  console.log("\n🧭 Chromium (Chrome/Samsung/Edge engine)");
  await runForEngine("chromium", chromiumProfiles);

  // Build summary
  const summary = {
    totalChecks: report.results.length,
    failed: report.results.filter((r) => !r.loadOk).length,
    withErrors: report.results.filter((r) => r.errors.length > 0).length,
    withHorizontalScroll: report.results.filter((r) => r.metrics?.horizontalScroll).length,
    withNetworkFailures: report.results.filter((r) => r.networkFailures.length > 0).length,
  };
  report.summary = summary;

  await fs.writeFile(
    path.join(OUT_DIR, "audit-report.json"),
    JSON.stringify(report, null, 2)
  );

  console.log("\n📊 Summary");
  console.log(`   Total checks:           ${summary.totalChecks}`);
  console.log(`   Failed to load:         ${summary.failed}`);
  console.log(`   With console errors:    ${summary.withErrors}`);
  console.log(`   With horizontal scroll: ${summary.withHorizontalScroll}`);
  console.log(`   With network failures:  ${summary.withNetworkFailures}`);
  console.log(`\n   Screenshots:  ${OUT_DIR}`);
  console.log(`   Full report:  ${path.join(OUT_DIR, "audit-report.json")}\n`);
}

main().catch((e) => {
  console.error("Audit failed:", e);
  process.exit(1);
});
