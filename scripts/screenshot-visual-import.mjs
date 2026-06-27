import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3001";
const OUT_DIR = path.join(process.cwd(), "screenshots");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function screenshot(page, name, options = {}) {
  const filePath = path.join(OUT_DIR, name);
  await page.screenshot({ path: filePath, fullPage: options.fullPage ?? false });
  console.log(`Saved: ${filePath}`);
}

async function setDesktop(page) {
  await page.setViewportSize({ width: 1280, height: 900 });
}

async function waitForImages(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", resolve);
        });
      })
    );
  });
}

const browser = await chromium.launch({ headless: true });

// 1-6: 六位人物详情页
for (const id of ["liyuan", "gaozong", "lilongji", "yangguifei", "limi-2", "zhuwen"]) {
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/characters/${id}`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, `${id}-detail-imported-desktop.png`, { fullPage: true });
  await page.close();
}

// 7: 群英录（按历史影响力排序，6 人基本都在前列）
{
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/characters?sort=importance-desc`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, "characters-imported-heroes-desktop.png", { fullPage: false });
  await page.close();
}

// 8: 人物榜
{
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/ranking`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, "ranking-imported-heroes-desktop.png", { fullPage: false });
  await page.close();
}

// 9: 权力图谱侧栏（逐一点击）
for (const id of ["liyuan", "gaozong", "lilongji", "yangguifei", "limi-2", "zhuwen"]) {
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/graph?character=${id}`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await page.waitForTimeout(800);
  await screenshot(page, `graph-panel-${id}-imported-desktop.png`, { fullPage: true });
  await page.close();
}

await browser.close();
console.log("Visual import screenshots done.");
