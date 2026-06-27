import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const shots = [
  {
    name: "taipinggongzhu-detail-desktop.png",
    url: "http://localhost:3001/characters/taipinggongzhu",
    wait: 2500,
  },
  {
    name: "taipinggongzhu-characters-desktop.png",
    url: "http://localhost:3001/characters?q=%E5%A4%AA%E5%B9%B3%E5%85%AC%E4%B8%BB",
    wait: 2500,
  },
  {
    name: "taipinggongzhu-ranking-desktop.png",
    url: "http://localhost:3001/ranking?category=%E7%9A%87%E5%B8%9D%2F%E7%9A%87%E5%AE%A4",
    wait: 2500,
  },
  {
    name: "taipinggongzhu-graph-desktop.png",
    url: "http://localhost:3001/graph?character=taipinggongzhu",
    wait: 3000,
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
