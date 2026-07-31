import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = join(root, "public", "images", "generated", "v1");
const publicPrefix = "/images/generated/v1";
await mkdir(outputDir, { recursive: true });

const manifest = { portfolio: [], studio: [] };

async function optimize(sourceRelative, key, widths, options = {}) {
  const source = join(root, sourceRelative);
  const input = await readFile(source);
  const hash = createHash("sha256").update(input).digest("hex").slice(0, 10);
  const metadata = await sharp(input).metadata();
  const originalWidth = metadata.width || widths.at(-1);
  const originalHeight = metadata.height || originalWidth;
  const usableWidths = [...new Set(widths.map((width) => Math.min(width, originalWidth)))].sort((a, b) => a - b);
  const sources = { avif: [], webp: [] };

  for (const width of usableWidths) {
    for (const format of ["avif", "webp"]) {
      const filename = `${key}-${hash}-${width}.${format}`;
      const pipeline = sharp(input, { animated: options.animated === true }).resize({
        width,
        withoutEnlargement: true,
        fit: "inside",
      });
      if (format === "avif") {
        await pipeline.avif({ quality: options.avifQuality ?? 48, effort: 2 }).toFile(join(outputDir, filename));
      } else {
        await pipeline.webp({ quality: options.webpQuality ?? 72, effort: 3 }).toFile(join(outputDir, filename));
      }
      sources[format].push({ width, src: `${publicPrefix}/${filename}` });
    }
  }

  return {
    original: `/${sourceRelative.replaceAll("\\", "/").replace(/^public\//, "")}`,
    width: originalWidth,
    height: originalHeight,
    sources,
  };
}

const portfolioDir = join(root, "public", "images", "portfolio");
const portfolioFiles = (await readdir(portfolioDir))
  .filter((file) => /\.(avif|gif|jpe?g|png|webp)$/i.test(file))
  .sort();

for (const [index, file] of portfolioFiles.entries()) {
  manifest.portfolio.push(await optimize(
    join("public", "images", "portfolio", file),
    `portfolio-${String(index + 1).padStart(2, "0")}`,
    [320, 480, 640, 960],
  ));
}

manifest.logo = await optimize(join("public", "images", "logo.webp"), "logo", [96], {
  avifQuality: 58,
  webpQuality: 78,
});

manifest.promo = await optimize(
  join("public", "images", "Gemini_Generated_Image_1z3ixb1z3ixb1z3i-ezgif.com-png-to-webp-converter.webp"),
  "new-client",
  [480, 720, 960],
);

for (const [index, file] of ["asmos1.webp", "asmos2.webp", "asmos3.webp"].entries()) {
  manifest.studio.push(await optimize(join("public", "images", file), `studio-${index + 1}`, [320, 480, 640, 960]));
}

manifest.album = await optimize(join("public", "images", "album.jpg"), "album", [64], {
  avifQuality: 55,
  webpQuality: 76,
});

await mkdir(join(root, "src", "data"), { recursive: true });
await writeFile(
  join(root, "src", "data", "assets.generated.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Optimized ${portfolioFiles.length} portfolio images plus shared assets.`);
