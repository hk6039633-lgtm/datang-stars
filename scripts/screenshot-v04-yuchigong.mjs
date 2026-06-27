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

  // 1. 群英录搜索“尉迟恭”
  await page.goto("http://localhost:3000/characters?q=%E5%B0%89%E8%BF%9F%E6%81%AD", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/yuchigong-search-gong-desktop.png`, fullPage: false });
  console.log("Saved yuchigong-search-gong-desktop.png");

  // 2. 群英录搜索“尉迟敬德”
  await page.goto("http://localhost:3000/characters?q=%E5%B0%89%E8%BF%9F%E6%95%AC%E5%BE%B7", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/yuchigong-search-jingde-desktop.png`, fullPage: false });
  console.log("Saved yuchigong-search-jingde-desktop.png");

  // 3. 人物榜“武将/将领”分类中尉迟恭
  await page.goto(
    "http://localhost:3000/ranking?category=%E6%AD%A6%E5%B0%86%2F%E5%B0%86%E9%A2%86",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(2500);
  const row = page.locator("tr:has-text('尉迟恭')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
  await waitImages(page);
  await page.screenshot({ path: `${dir}/yuchigong-ranking-desktop.png`, fullPage: false });
  console.log("Saved yuchigong-ranking-desktop.png");

  // 4. 尉迟恭详情页
  await page.goto("http://localhost:3000/characters/yuchigong", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/yuchigong-detail-desktop.png`, fullPage: false });
  console.log("Saved yuchigong-detail-desktop.png");

  // 5. 权力图谱尉迟恭侧栏
  await page.goto("http://localhost:3000/graph?character=yuchigong", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/yuchigong-graph-desktop.png`, fullPage: false });
  console.log("Saved yuchigong-graph-desktop.png");

  await browser.close();
})();
