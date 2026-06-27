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

const searchShots = [
  ["lijing", "%E6%9D%8E%E9%9D%96"],
  ["qinqiong", "%E7%A7%A6%E7%90%BC"],
  ["yuchigong", "%E5%B0%89%E8%BF%9F%E6%81%AD"],
  ["fangxuanling", "%E6%88%BF%E7%8E%84%E9%BE%84"],
  ["weizheng", "%E9%AD%8F%E5%BE%81"],
  ["lilinfu", "%E6%9D%8E%E6%9E%97%E7%94%AB"],
  ["gaolishi", "%E9%AB%98%E5%8A%9B%E5%A3%AB"],
  ["huangchao", "%E9%BB%84%E5%B7%A2"],
];

const detailIds = ["lijing", "qinshubao", "yuchigong", "fangxuanling", "weizheng", "lilinfu", "gaolishi", "huangchao"];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // 群英录搜索 8 人
  for (const [slug, query] of searchShots) {
    await page.goto(`http://localhost:3000/characters?q=${query}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    await waitImages(page);
    await page.screenshot({ path: `${dir}/group2-search-${slug}-desktop.png`, fullPage: false });
    console.log(`Saved group2-search-${slug}-desktop.png`);
  }

  // 人物榜分类
  const categories = [
    ["wujiang", "%E6%AD%A6%E5%B0%86%2F%E5%B0%86%E9%A2%86", "李靖"],
    ["zaixiang", "%E5%AE%B0%E7%9B%B8%2F%E5%A4%A7%E8%87%A3", "房玄龄"],
    ["huanguan", "%E5%AE%A6%E5%AE%98", "高力士"],
    ["panluan", "%E5%8F%9B%E4%B9%B1%E5%8A%BF%E5%8A%9B", "黄巢"],
  ];
  for (const [slug, cat, name] of categories) {
    await page.goto(`http://localhost:3000/ranking?category=${cat}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    const row = page.locator(`tr:has-text('${name}')`).first();
    try { await row.scrollIntoViewIfNeeded({ timeout: 5000 }); await page.waitForTimeout(500); } catch (e) {}
    await waitImages(page);
    await page.screenshot({ path: `${dir}/group2-ranking-${slug}-desktop.png`, fullPage: false });
    console.log(`Saved group2-ranking-${slug}-desktop.png`);
  }

  // 8 人详情页
  for (const id of detailIds) {
    await page.goto(`http://localhost:3000/characters/${id}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    await waitImages(page);
    await page.screenshot({ path: `${dir}/group2-detail-${id}-desktop.png`, fullPage: false });
    console.log(`Saved group2-detail-${id}-desktop.png`);
  }

  // 权力图谱 3 人侧栏
  for (const id of ["qinshubao", "weizheng", "huangchao"]) {
    await page.goto(`http://localhost:3000/graph?character=${id}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3200);
    await waitImages(page);
    await page.screenshot({ path: `${dir}/group2-graph-${id}-desktop.png`, fullPage: false });
    console.log(`Saved group2-graph-${id}-desktop.png`);
  }

  // 默认头像人物详情页
  await page.goto("http://localhost:3000/characters/dinghui", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/group2-default-avatar-desktop.png`, fullPage: false });
  console.log("Saved group2-default-avatar-desktop.png");

  // 核心 10 人展示：人物榜皇帝/皇室分类
  await page.goto("http://localhost:3000/ranking?category=%E7%9A%87%E5%B8%9D%2F%E7%9A%87%E5%AE%A4", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const row = page.locator("tr:has-text('李世民')").first();
  try { await row.scrollIntoViewIfNeeded({ timeout: 5000 }); await page.waitForTimeout(500); } catch (e) {}
  await waitImages(page);
  await page.screenshot({ path: `${dir}/group2-core10-desktop.png`, fullPage: false });
  console.log("Saved group2-core10-desktop.png");

  await browser.close();
})();
