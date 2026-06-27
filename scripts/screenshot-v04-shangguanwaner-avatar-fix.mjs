import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const shots = [
  {
    name: "shangguanwaner-avatar-fix-characters-desktop.png",
    url: "http://localhost:3001/characters?q=%E4%B8%8A%E5%AE%98%E5%A9%89%E5%84%BF",
    wait: 2500,
  },
  {
    name: "shangguanwaner-avatar-fix-ranking-desktop.png",
    url: "http://localhost:3001/ranking?category=%E5%90%8E%E5%AE%AB%2F%E5%A5%B3%E6%80%A7",
    wait: 2500,
  },
  {
    name: "shangguanwaner-avatar-fix-graph-desktop.png",
    url: "http://localhost:3001/graph?character=shangguanwaner",
    wait: 3000,
  },
  {
    name: "shangguanwaner-avatar-fix-detail-desktop.png",
    url: "http://localhost:3001/characters/shangguanwaner",
    wait: 2500,
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
  await browser.close();
})();
