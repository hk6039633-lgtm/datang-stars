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

const desktopPages = [
  ["v05-home-desktop", "/"],
  ["v05-characters-desktop", "/characters"],
  ["v05-detail-lishimin-desktop", "/characters/lishimin"],
  ["v05-detail-libai-desktop", "/characters/libai"],
  ["v05-detail-dufu-desktop", "/characters/dufu"],
  ["v05-detail-shangguanyi-desktop", "/characters/shangguanyi"],
  ["v05-ranking-desktop", "/ranking"],
  ["v05-ranking-wujiang-desktop", "/ranking?category=%E6%AD%A6%E5%B0%86%2F%E5%B0%86%E9%A2%86"],
  ["v05-graph-desktop", "/graph"],
  ["v05-graph-panel-qinshubao-desktop", "/graph?character=qinshubao"],
];

const mobilePages = [
  ["v05-home-mobile", "/"],
  ["v05-characters-mobile", "/characters"],
  ["v05-detail-libai-mobile", "/characters/libai"],
  ["v05-ranking-mobile", "/ranking"],
  ["v05-graph-panel-weizheng-mobile", "/graph?character=weizheng"],
];

(async () => {
  const browser = await chromium.launch();

  // desktop
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [name, path] of desktopPages) {
    await desktop.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
    await desktop.waitForTimeout(path.includes("graph") ? 3500 : 2500);
    await waitImages(desktop);
    await desktop.screenshot({ path: `${dir}/${name}.png`, fullPage: false });
    console.log(`Saved ${name}.png`);
  }

  // mobile
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const [name, path] of mobilePages) {
    await mobile.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
    await mobile.waitForTimeout(path.includes("graph") ? 3500 : 2500);
    await waitImages(mobile);
    await mobile.screenshot({ path: `${dir}/${name}.png`, fullPage: false });
    console.log(`Saved ${name}.png`);
  }

  await browser.close();
})();
