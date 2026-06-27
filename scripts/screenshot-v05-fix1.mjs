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
  ["v05-fix1-home-desktop", "/"],
  ["v05-fix1-detail-libai-desktop", "/characters/libai"],
];

const mobilePages = [
  ["v05-fix1-home-mobile", "/"],
  ["v05-fix1-characters-mobile", "/characters"],
  ["v05-fix1-detail-libai-mobile", "/characters/libai"],
  ["v05-fix1-ranking-mobile", "/ranking"],
  ["v05-fix1-graph-mobile", "/graph?character=weizheng"],
];

(async () => {
  const browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [name, path] of desktopPages) {
    await desktop.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
    await desktop.waitForTimeout(path.includes("graph") ? 3500 : 2500);
    await waitImages(desktop);
    await desktop.screenshot({ path: `${dir}/${name}.png`, fullPage: false });
    console.log(`Saved ${name}.png`);
  }

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
