#!/usr/bin/env node
/**
 * 人物图片 WebP 优化脚本
 *
 * 将 public/images/characters 下的 PNG 图片转换为 WebP，保留原图。
 * - avatar: 512px 宽，quality 82
 * - card: 1200px 宽，quality 85
 * - clean: 1200px 宽，quality 85
 * - defaults: 512px 宽，quality 82
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images", "characters");

const CONFIG = {
  avatar: { width: 512, quality: 82 },
  card: { width: 1200, quality: 85 },
  clean: { width: 1200, quality: 85 },
  defaults: { width: 512, quality: 82 },
};

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name)) {
      yield fullPath;
    }
  }
}

async function optimize() {
  const totals = { before: 0, after: 0, count: 0 };

  for await (const filePath of walk(IMAGES_DIR)) {
    const relDir = path.relative(IMAGES_DIR, path.dirname(filePath));
    const category = relDir.split(path.sep)[0]; // avatar | card | clean | defaults
    const cfg = CONFIG[category];
    if (!cfg) continue;

    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath, ext);
    const outPath = path.join(path.dirname(filePath), `${baseName}.webp`);

    const beforeStat = await fs.stat(filePath);
    const beforeSize = beforeStat.size;

    await sharp(filePath)
      .resize(cfg.width, null, { withoutEnlargement: true, fit: "inside" })
      .webp({ quality: cfg.quality, effort: 4 })
      .toFile(outPath);

    const afterStat = await fs.stat(outPath);
    const afterSize = afterStat.size;

    totals.before += beforeSize;
    totals.after += afterSize;
    totals.count += 1;

    const ratio = ((1 - afterSize / beforeSize) * 100).toFixed(1);
    console.log(
      `[${category}] ${path.basename(filePath)} → ${baseName}.webp （${(beforeSize / 1024 / 1024).toFixed(2)} MB → ${(afterSize / 1024 / 1024).toFixed(2)} MB，减少 ${ratio}%）`
    );
  }

  console.log("\n优化完成：");
  console.log(`  处理文件数: ${totals.count}`);
  console.log(`  优化前总体积: ${(totals.before / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  优化后总体积: ${(totals.after / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  总体积减少: ${((1 - totals.after / totals.before) * 100).toFixed(1)}%`);
}

optimize().catch((err) => {
  console.error("优化失败:", err);
  process.exit(1);
});
