import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const shots = [
  {
    name: "characters-default-avatar-desktop.png",
    url: "http://localhost:3001/characters?category=%E6%96%87%E4%BA%BA&sort=importance-desc",
    wait: 2000,
  },
  {
    name: "ranking-default-avatar-desktop.png",
    url: "http://localhost:3001/ranking?category=%E5%AE%B0%E7%9B%B8%2F%E5%A4%A7%E8%87%A3",
    wait: 2000,
  },
  {
    name: "graph-default-avatar-desktop.png",
    url: "http://localhost:3001/graph?character=shangguanyi",
    wait: 3000,
  },
  {
    name: "character-no-avatar-desktop.png",
    url: "http://localhost:3001/characters/shangguanyi",
    wait: 2000,
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
