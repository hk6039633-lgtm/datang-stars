import { chromium } from "playwright";

const BASE = "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${BASE}/galaxy`);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2000);
await page.screenshot({ path: "screenshots/galaxy-v2-overview.png", fullPage: false });
console.log("v2 overview saved");

const canvas = page.locator("canvas:not(.pointer-events-none)").first();

// Click central galaxy
await canvas.click({ position: { x: 720, y: 418 } });
await page.waitForTimeout(1800);
await page.screenshot({ path: "screenshots/galaxy-v2-imperial.png", fullPage: false });
console.log("v2 imperial saved");

// Click 李世民 (top of orbit, ~canvas y=280)
await canvas.click({ position: { x: 720, y: 280 } });
await page.waitForTimeout(1800);
await page.screenshot({ path: "screenshots/galaxy-v2-character.png", fullPage: false });
console.log("v2 character saved");

// Click a neighbor on the right (李建成)
await canvas.click({ position: { x: 900, y: 420 } });
await page.waitForTimeout(1800);
await page.screenshot({ path: "screenshots/galaxy-v2-deep.png", fullPage: false });
console.log("v2 deep saved");

await browser.close();
