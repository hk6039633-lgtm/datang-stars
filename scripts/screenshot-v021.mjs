import { chromium } from "playwright";

const BASE = "http://localhost:3001";

const desktopShots = [
  { path: "screenshots/home-desktop.png", url: "/" },
  { path: "screenshots/characters-desktop.png", url: "/characters" },
  { path: "screenshots/characters-search-taizong-desktop.png", url: "/characters?q=%E5%A4%AA%E5%AE%97" },
  { path: "screenshots/characters-search-minghuang-desktop.png", url: "/characters?q=%E6%98%8E%E7%9A%87" },
  { path: "screenshots/ranking-historical-impact-desktop.png", url: "/ranking" },
  { path: "screenshots/ranking-imperial-desktop.png", url: "/ranking?category=%E7%9A%87%E5%B8%9D%2F%E7%9A%87%E5%AE%A4" },
  { path: "screenshots/gaozong-detail-desktop.png", url: "/characters/gaozong" },
  { path: "screenshots/wuzetian-detail-desktop.png", url: "/characters/wuzetian" },
  { path: "screenshots/lijing-detail-desktop.png", url: "/characters/lijing" },
  { path: "screenshots/shangguanwaner-detail-desktop.png", url: "/characters/shangguanwaner" },
];

const mobileShots = [
  { path: "screenshots/home-mobile.png", url: "/" },
  { path: "screenshots/characters-mobile.png", url: "/characters" },
  { path: "screenshots/ranking-mobile.png", url: "/ranking" },
];

const browser = await chromium.launch();

// Desktop
const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
for (const shot of desktopShots) {
  await desktop.goto(`${BASE}${shot.url}`);
  await desktop.waitForLoadState("networkidle");
  await desktop.screenshot({ path: shot.path, fullPage: true });
  console.log("desktop:", shot.path);
}
await desktop.close();

// Mobile
const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
for (const shot of mobileShots) {
  await mobile.goto(`${BASE}${shot.url}`);
  await mobile.waitForLoadState("networkidle");
  await mobile.screenshot({ path: shot.path, fullPage: true });
  console.log("mobile:", shot.path);
}
await mobile.close();

await browser.close();
