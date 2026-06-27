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

// 1-4: 四位人物详情页
for (const id of ["lishimin", "wuzetian", "anlushan", "guoziyi"]) {
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/characters/${id}`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, `${id}-detail-card-backfill-desktop.png`, { fullPage: true });
  await page.close();
}

// 5: 人物榜前 10
{
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/ranking`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, "ranking-top10-card-backfill-desktop.png", { fullPage: false });
  await page.close();
}

// 6: 群英录包含这 4 人
{
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/characters?q=${encodeURIComponent("李世民 武则天 安禄山 郭子仪")}`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, "characters-v01-four-card-backfill-desktop.png", { fullPage: false });
  await page.close();
}

await browser.close();
console.log("v0.1 card backfill screenshots done.");
