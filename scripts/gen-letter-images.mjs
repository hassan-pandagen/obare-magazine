import sharp from "sharp";
import { stat } from "node:fs/promises";

const sources = [
  "hero-bg",
  "magazine-real",
  "traveling",
  "story-portrait",
  "story-tech",
  "obare-o",
  "obare-r",
  "obare-e",
];

const kb = (n) => (n / 1024).toFixed(1) + " KB";

for (const name of sources) {
  const input = `public/images/${name}.webp`;
  const output = `public/images/${name}-letter.webp`;
  try {
    const before = (await stat(input)).size;
    await sharp(input)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toFile(output);
    const after = (await stat(output)).size;
    console.log(`${name.padEnd(18)} ${kb(before).padStart(10)} → ${kb(after)}`);
  } catch (err) {
    console.log(`${name}: skipped (${err.message})`);
  }
}
