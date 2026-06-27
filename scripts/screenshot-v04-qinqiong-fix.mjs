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

  // 1. 群英录搜索“秦琼”
  await page.goto("http://localhost:3000/characters?q=%E7%A7%A6%E7%90%BC", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/qinqiong-fix-search-qinqiong-desktop.png`, fullPage: false });
  console.log("Saved qinqiong-fix-search-qinqiong-desktop.png");

  // 2. 群英录搜索“秦叔宝”
  await page.goto("http://localhost:3000/characters?q=%E7%A7%A6%E5%8F%94%E5%AE%9D", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/qinqiong-fix-search-shubao-desktop.png`, fullPage: false });
  console.log("Saved qinqiong-fix-search-shubao-desktop.png");

  // 3. 人物榜“武将/将领”分类中秦琼
  await page.goto(
    "http://localhost:3000/ranking?category=%E6%AD%A6%E5%B0%86%2F%E5%B0%86%E9%A2%86",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(2500);
  const row = page.locator("tr:has-text('秦琼')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
  await waitImages(page);
  await page.screenshot({ path: `${dir}/qinqiong-fix-ranking-desktop.png`, fullPage: false });
  console.log("Saved qinqiong-fix-ranking-desktop.png");

  // 4. 秦琼详情页
  await page.goto("http://localhost:3000/characters/qinshubao", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/qinqiong-fix-detail-desktop.png`, fullPage: false });
  console.log("Saved qinqiong-fix-detail-desktop.png");

  // 5. 权力图谱秦琼侧栏
  await page.goto("http://localhost:3000/graph?character=qinshubao", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/qinqiong-fix-graph-desktop.png`, fullPage: false });
  console.log("Saved qinqiong-fix-graph-desktop.png");

  await browser.close();
})();
