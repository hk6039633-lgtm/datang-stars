const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3001";
const OUT_DIR = path.join(__dirname, "..", "screenshots");

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
  await page.setViewportSize({ width: 375, height: 667 });
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

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 桌面：首页
  {
    const page = await browser.newPage();
    await setDesktop(page);
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "home-desktop.png", { fullPage: true });
    await page.close();
  }

  // 桌面：群英录
  {
    const page = await browser.newPage();
    await setDesktop(page);

    // 默认排序
    await page.goto(`${BASE_URL}/characters`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "characters-desktop.png", { fullPage: false });

    // 分别搜索四个有视觉资产的人物
    for (const name of ["李世民", "武则天", "安禄山", "郭子仪"]) {
      await page.goto(`${BASE_URL}/characters?q=${encodeURIComponent(name)}`, { waitUntil: "networkidle" });
      await waitForImages(page);
      await screenshot(page, `characters-search-${name}-desktop.png`, { fullPage: false });
    }
    await page.close();
  }

  // 桌面：人物详情页
  for (const id of ["lishimin", "wuzetian", "anlushan", "guoziyi"]) {
    const page = await browser.newPage();
    await setDesktop(page);
    await page.goto(`${BASE_URL}/characters/${id}`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, `${id}-detail-desktop.png`, { fullPage: true });
    await page.close();
  }

  // 桌面：人物榜
  {
    const page = await browser.newPage();
    await setDesktop(page);
    await page.goto(`${BASE_URL}/ranking`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "ranking-desktop.png", { fullPage: true });
    await page.close();
  }

  // 桌面：权力图谱右侧人物面板（通过 URL 参数默认选中）
  for (const id of ["lishimin", "wuzetian", "anlushan", "guoziyi"]) {
    const page = await browser.newPage();
    await setDesktop(page);
    await page.goto(`${BASE_URL}/graph?character=${id}`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await page.waitForTimeout(1000);
    await screenshot(page, `graph-panel-${id}-desktop.png`, { fullPage: true });
    await page.close();
  }

  // 移动：群英录
  {
    const page = await browser.newPage();
    await setMobile(page);

    // 默认排序
    await page.goto(`${BASE_URL}/characters`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "characters-mobile.png", { fullPage: false });

    // 搜索李世民
    await page.goto(`${BASE_URL}/characters?q=${encodeURIComponent("李世民")}`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "characters-search-lishimin-mobile.png", { fullPage: false });
    await page.close();
  }

  // 移动：人物详情页（李世民）
  {
    const page = await browser.newPage();
    await setMobile(page);
    await page.goto(`${BASE_URL}/characters/lishimin`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "lishimin-detail-mobile.png", { fullPage: true });
    await page.close();
  }

  // 移动：人物榜
  {
    const page = await browser.newPage();
    await setMobile(page);
    await page.goto(`${BASE_URL}/ranking`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "ranking-mobile.png", { fullPage: true });
    await page.close();
  }

  // 无图人物检查：找一个没有图片的人物
  {
    const page = await browser.newPage();
    await setDesktop(page);
    await page.goto(`${BASE_URL}/characters/dinghui`, { waitUntil: "networkidle" });
    await waitForImages(page);
    await screenshot(page, "no-image-character-desktop.png", { fullPage: true });
    await page.close();
  }

  await browser.close();
  console.log("All screenshots done.");
})();
