import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const shots = [
  {
    name: "lijing-detail-desktop.png",
    url: "http://localhost:3000/characters/lijing",
    wait: 2500,
  },
  {
    name: "lijing-characters-desktop.png",
    url: "http://localhost:3000/characters?q=%E6%9D%8E%E9%9D%96",
    wait: 2500,
  },
  {
    name: "lijing-ranking-desktop.png",
    url: "http://localhost:3000/ranking?category=%E6%AD%A6%E5%B0%86%2F%E5%B0%86%E9%A2%86",
    wait: 2500,
  },
  {
    name: "lijing-graph-desktop.png",
    url: "http://localhost:3000/graph?character=lijing",
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
  await browser.close();
})();
