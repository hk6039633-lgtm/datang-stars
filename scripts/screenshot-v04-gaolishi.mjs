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

  // 1. 群英录搜索“高力士”
  await page.goto("http://localhost:3000/characters?q=%E9%AB%98%E5%8A%9B%E5%A3%AB", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/gaolishi-search-name-desktop.png`, fullPage: false });
  console.log("Saved gaolishi-search-name-desktop.png");

  // 2. 群英录搜索“玄宗近侍”
  await page.goto("http://localhost:3000/characters?q=%E7%84%96%E5%AE%97%E8%BF%91%E4%BE%8D", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/gaolishi-search-title-desktop.png`, fullPage: false });
  console.log("Saved gaolishi-search-title-desktop.png");

  // 3. 人物榜“宦官”分类中高力士
  await page.goto(
    "http://localhost:3000/ranking?category=%E5%AE%A6%E5%AE%98",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(2500);
  const row = page.locator("tr:has-text('高力士')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
  await waitImages(page);
  await page.screenshot({ path: `${dir}/gaolishi-ranking-desktop.png`, fullPage: false });
  console.log("Saved gaolishi-ranking-desktop.png");

  // 4. 高力士详情页
  await page.goto("http://localhost:3000/characters/gaolishi", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/gaolishi-detail-desktop.png`, fullPage: false });
  console.log("Saved gaolishi-detail-desktop.png");

  // 5. 权力图谱高力士侧栏
  await page.goto("http://localhost:3000/graph?character=gaolishi", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/gaolishi-graph-desktop.png`, fullPage: false });
  console.log("Saved gaolishi-graph-desktop.png");

  await browser.close();
})();
