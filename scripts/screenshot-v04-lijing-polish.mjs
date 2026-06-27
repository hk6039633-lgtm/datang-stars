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

const searches = [
  ["name", "%E6%9D%8E%E9%9D%96"],
  ["yaoshi", "%E6%9D%8E%E8%8D%AF%E5%B8%88"],
  ["weiguo", "%E5%8D%AB%E5%9B%BD%E5%85%AC"],
  ["lingyan", "%E5%87%8C%E7%83%9F%E9%98%81%E5%8A%9F%E8%87%A3"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  for (const [slug, query] of searches) {
    await page.goto(`http://localhost:3000/characters?q=${query}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    await waitImages(page);
    await page.screenshot({ path: `${dir}/lijing-polish-search-${slug}-desktop.png`, fullPage: false });
    console.log(`Saved lijing-polish-search-${slug}-desktop.png`);
  }

  await page.goto("http://localhost:3000/characters/lijing", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  await waitImages(page);
  await page.screenshot({ path: `${dir}/lijing-polish-detail-desktop.png`, fullPage: false });
  console.log("Saved lijing-polish-detail-desktop.png");

  await browser.close();
})();
