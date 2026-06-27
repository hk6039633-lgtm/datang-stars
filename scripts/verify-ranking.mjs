import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const shots = [
  { path: "screenshots/ranking-historical-impact-desktop.png", url: "/ranking" },
  { path: "screenshots/ranking-imperial-desktop.png", url: "/ranking?category=%E7%9A%87%E5%B8%9D%2F%E7%9A%87%E5%AE%A4" },
  { path: "screenshots/characters-search-太宗-desktop.png", url: "/characters?q=%E5%A4%AA%E5%AE%97" },
  { path: "screenshots/characters-search-明皇-desktop.png", url: "/characters?q=%E6%98%8E%E7%9A%87" },
  { path: "screenshots/gaozong-detail-desktop.png", url: "/characters/gaozong" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

for (const shot of shots) {
  await page.goto(`${BASE}${shot.url}`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: shot.path, fullPage: true });
  console.log("screenshot:", shot.path);
}

await browser.close();
