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

async function setMobile(page) {
  await page.setViewportSize({ width: 375, height: 812 });
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

// 桌面端：四位已有 clean 图的人物
for (const id of ["lishimin", "wuzetian", "anlushan", "guoziyi"]) {
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/characters/${id}`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, `${id}-detail-hero-desktop.png`, { fullPage: true });
  await page.close();
}

// 移动端：李世民
{
  const page = await browser.newPage();
  await setMobile(page);
  await page.goto(`${BASE_URL}/characters/lishimin`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, "lishimin-detail-hero-mobile.png", { fullPage: true });
  await page.close();
}

// 无图人物：丁会
{
  const page = await browser.newPage();
  await setDesktop(page);
  await page.goto(`${BASE_URL}/characters/dinghui`, { waitUntil: "networkidle" });
  await waitForImages(page);
  await screenshot(page, "dinghui-detail-no-hero-desktop.png", { fullPage: true });
  await page.close();
}

await browser.close();
console.log("Hero screenshots done.");
