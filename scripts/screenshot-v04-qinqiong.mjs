import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const shots = [
  {
    name: "qinqiong-detail-desktop.png",
    url: "http://localhost:3000/characters/qinshubao",
    wait: 2500,
  },
  {
    name: "qinqiong-characters-desktop.png",
    url: "http://localhost:3000/characters?q=%E7%A7%A6%E5%8F%94%E5%AE%9D",
    wait: 2500,
  },
  {
    name: "qinqiong-graph-desktop.png",
    url: "http://localhost:3000/graph?character=qinshubao",
    wait: 3500,
  },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  for (const s of shots) {
    await page.goto(s.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(s.wait);
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
    const path = `${dir}/${s.name}`;
    await page.screenshot({ path, fullPage: false });
    console.log("Saved", path);
  }

  // 人物榜：分类「其他」并滚动到秦叔宝所在行
  await page.goto(
    "http://localhost:3000/ranking?category=%E5%85%B6%E4%BB%96",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(1500);
  const row = page.locator("tr:has-text('秦叔宝')").first();
  try {
    await row.scrollIntoViewIfNeeded({ timeout: 5000 });
    await page.waitForTimeout(500);
  } catch (e) {
    console.log("scroll warning:", e.message);
  }
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
  const rankingPath = `${dir}/qinqiong-ranking-desktop.png`;
  await page.screenshot({ path: rankingPath, fullPage: false });
  console.log("Saved", rankingPath);

  await browser.close();
})();
