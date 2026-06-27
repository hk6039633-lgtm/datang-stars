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

  // 1. 群英录搜索“黄巢”
  await page.goto("http://localhost:3000/characters?q=%E9%BB%84%E5%B7%A2", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/huangchao-search-name-desktop.png`, fullPage: false });
  console.log("Saved huangchao-search-name-desktop.png");

  // 2. 群英录搜索“冲天大将军”
  await page.goto("http://localhost:3000/characters?q=%E5%86%B2%E5%A4%A9%E5%A4%A7%E5%B0%86%E5%86%9B", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/huangchao-search-title-desktop.png`, fullPage: false });
  console.log("Saved huangchao-search-title-desktop.png");

  // 3. 人物榜“叛乱势力”分类中黄巢
  await page.goto(
    "http://localhost:3000/ranking?category=%E5%8F%9B%E4%B9%B1%E5%8A%BF%E5%8A%9B",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(2500);
  const row = page.locator("tr:has-text('黄巢')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
  await waitImages(page);
  await page.screenshot({ path: `${dir}/huangchao-ranking-desktop.png`, fullPage: false });
  console.log("Saved huangchao-ranking-desktop.png");

  // 4. 黄巢详情页
  await page.goto("http://localhost:3000/characters/huangchao", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/huangchao-detail-desktop.png`, fullPage: false });
  console.log("Saved huangchao-detail-desktop.png");

  // 5. 权力图谱黄巢侧栏
  await page.goto("http://localhost:3000/graph?character=huangchao", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/huangchao-graph-desktop.png`, fullPage: false });
  console.log("Saved huangchao-graph-desktop.png");

  await browser.close();
})();
