import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${BASE}/galaxy`);
await page.waitForTimeout(2000);

const canvas = page.locator("canvas:not(.pointer-events-none)").first();
await canvas.click({ position: { x: 720, y: 418 } });
await page.waitForTimeout(1500);
await canvas.click({ position: { x: 720, y: 280 } });
await page.waitForTimeout(1500);

// fullscreen
await page.click("button[title='全屏沉浸']");
await page.waitForTimeout(1200);
await page.screenshot({ path: "screenshots/galaxy-v2-fullscreen.png", fullPage: false });

// ESC exit
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);
await page.screenshot({ path: "screenshots/galaxy-v2-esc.png", fullPage: false });

// toggle panel off
await page.click("button[title='切换信息面板']");
await page.waitForTimeout(800);
await page.screenshot({ path: "screenshots/galaxy-v2-panel-off.png", fullPage: false });

await browser.close();
