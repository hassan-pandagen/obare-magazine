import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const DIR = "public/images";

// hero-bg and skin-tone photos need higher quality to preserve grain
const QUALITY = {
  "hero-bg": 89,
  "red-accent": 60,
  default: 82,
};

const files = await readdir(DIR);
const targets = files.filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

for (const file of targets) {
  const inPath = join(DIR, file);
  const { name } = parse(file);
  const outPath = join(DIR, `${name}.webp`);
  const q = QUALITY[name] ?? QUALITY.default;

  const before = (await stat(inPath)).size;
  await sharp(inPath).webp({ quality: q, effort: 6 }).toFile(outPath);
  const after = (await stat(outPath)).size;

  const pct = Math.round((1 - after / before) * 100);
  const kb = (n) => (n / 1024).toFixed(1) + " KB";
  console.log(`${file.padEnd(22)} q=${q}  ${kb(before)} → ${kb(after)}  (-${pct}%)`);
}
