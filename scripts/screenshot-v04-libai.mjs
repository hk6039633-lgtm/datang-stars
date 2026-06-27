import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const shots = [
  {
    name: "libai-detail-desktop.png",
    url: "http://localhost:3001/characters/libai",
    wait: 2500,
  },
  {
    name: "libai-characters-desktop.png",
    url: "http://localhost:3001/characters?q=%E6%9D%8E%E7%99%BD",
    wait: 2500,
  },
  {
    name: "libai-ranking-desktop.png",
    url: "http://localhost:3001/ranking?category=%E6%96%87%E4%BA%BA",
    wait: 2500,
  },
  {
    name: "libai-graph-desktop.png",
    url: "http://localhost:3001/graph?character=libai",
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
