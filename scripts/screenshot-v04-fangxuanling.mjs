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

  // 1. 群英录搜索“房玄龄”
  await page.goto("http://localhost:3000/characters?q=%E6%88%BF%E7%8E%84%E9%BE%84", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/fangxuanling-search-name-desktop.png`, fullPage: false });
  console.log("Saved fangxuanling-search-name-desktop.png");

  // 2. 群英录搜索“房谋杜断”
  await page.goto("http://localhost:3000/characters?q=%E6%88%BF%E8%B0%8B%E6%9D%9C%E6%96%AD", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/fangxuanling-search-chengyu-desktop.png`, fullPage: false });
  console.log("Saved fangxuanling-search-chengyu-desktop.png");

  // 3. 人物榜“宰相/大臣”分类中房玄龄
  await page.goto(
    "http://localhost:3000/ranking?category=%E5%AE%B0%E7%9B%B8%2F%E5%A4%A7%E8%87%A3",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(2500);
  const row = page.locator("tr:has-text('房玄龄')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
  await waitImages(page);
  await page.screenshot({ path: `${dir}/fangxuanling-ranking-desktop.png`, fullPage: false });
  console.log("Saved fangxuanling-ranking-desktop.png");

  // 4. 房玄龄详情页
  await page.goto("http://localhost:3000/characters/fangxuanling", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/fangxuanling-detail-desktop.png`, fullPage: false });
  console.log("Saved fangxuanling-detail-desktop.png");

  // 5. 权力图谱房玄龄侧栏
  await page.goto("http://localhost:3000/graph?character=fangxuanling", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/fangxuanling-graph-desktop.png`, fullPage: false });
  console.log("Saved fangxuanling-graph-desktop.png");

  await browser.close();
})();
