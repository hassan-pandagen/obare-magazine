import sharp from "sharp";
import { stat } from "node:fs/promises";

const input = "public/images/hero-bg.webp";
const output = "public/images/hero-bg-mobile.webp";

const before = (await stat(input)).size;
await sharp(input)
  .resize({ width: 800, withoutEnlargement: true })
  .webp({ quality: 80, effort: 6 })
  .toFile(output);
const after = (await stat(output)).size;

const kb = (n) => (n / 1024).toFixed(1) + " KB";
console.log(`${input}  ${kb(before)} → ${output}  ${kb(after)}`);
