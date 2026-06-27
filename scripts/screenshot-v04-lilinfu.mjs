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

  // 1. 群英录搜索“李林甫”
  await page.goto("http://localhost:3000/characters?q=%E6%9D%8E%E6%9E%97%E7%94%AB", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/lilinfu-search-name-desktop.png`, fullPage: false });
  console.log("Saved lilinfu-search-name-desktop.png");

  // 2. 群英录搜索“口蜜腹剑”
  await page.goto("http://localhost:3000/characters?q=%E5%8F%A3%E8%9C%9C%E8%85%B9%E5%89%91", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/lilinfu-search-chengyu-desktop.png`, fullPage: false });
  console.log("Saved lilinfu-search-chengyu-desktop.png");

  // 3. 人物榜“宰相/大臣”分类中李林甫
  await page.goto(
    "http://localhost:3000/ranking?category=%E5%AE%B0%E7%9B%B8%2F%E5%A4%A7%E8%87%A3",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(2500);
  const row = page.locator("tr:has-text('李林甫')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
  await waitImages(page);
  await page.screenshot({ path: `${dir}/lilinfu-ranking-desktop.png`, fullPage: false });
  console.log("Saved lilinfu-ranking-desktop.png");

  // 4. 李林甫详情页
  await page.goto("http://localhost:3000/characters/lilinfu", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/lilinfu-detail-desktop.png`, fullPage: false });
  console.log("Saved lilinfu-detail-desktop.png");

  // 5. 权力图谱李林甫侧栏
  await page.goto("http://localhost:3000/graph?character=lilinfu", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/lilinfu-graph-desktop.png`, fullPage: false });
  console.log("Saved lilinfu-graph-desktop.png");

  await browser.close();
})();
