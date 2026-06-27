import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const waitImages = async (page) => {
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.querySelectorAll("img")).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((r) => {
              img.addEventListener("load", r);
              img.addEventListener("error", r);
            })
      )
    );
  });
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // 1. 群英录搜索“魏征”
  await page.goto("http://localhost:3000/characters?q=%E9%AD%8F%E5%BE%81", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/weizheng-search-name-desktop.png`, fullPage: false });
  console.log("Saved weizheng-search-name-desktop.png");

  // 2. 群英录搜索“魏徵”
  await page.goto("http://localhost:3000/characters?q=%E9%AD%8F%E5%BE%B4", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/weizheng-search-variant-desktop.png`, fullPage: false });
  console.log("Saved weizheng-search-variant-desktop.png");

  // 3. 群英录搜索“郑国公”
  await page.goto("http://localhost:3000/characters?q=%E9%83%91%E5%9B%BD%E5%85%AC", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/weizheng-search-title-desktop.png`, fullPage: false });
  console.log("Saved weizheng-search-title-desktop.png");

  // 4. 人物榜“宰相/大臣”分类中魏征
  await page.goto(
    "http://localhost:3000/ranking?category=%E5%AE%B0%E7%9B%B8%2F%E5%A4%A7%E8%87%A3",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(2500);
  const row = page.locator("tr:has-text('魏征')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
  await waitImages(page);
  await page.screenshot({ path: `${dir}/weizheng-ranking-desktop.png`, fullPage: false });
  console.log("Saved weizheng-ranking-desktop.png");

  // 5. 魏征详情页
  await page.goto("http://localhost:3000/characters/weizheng", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/weizheng-detail-desktop.png`, fullPage: false });
  console.log("Saved weizheng-detail-desktop.png");

  // 6. 权力图谱魏征侧栏
  await page.goto("http://localhost:3000/graph?character=weizheng", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/weizheng-graph-desktop.png`, fullPage: false });
  console.log("Saved weizheng-graph-desktop.png");

  await browser.close();
})();
