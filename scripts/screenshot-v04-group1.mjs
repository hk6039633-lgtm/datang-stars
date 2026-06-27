import { chromium } from "playwright";
import fs from "fs";

const dir = "screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

function encodeQuery(str) {
  return encodeURIComponent(str);
}

const shots = [
  // 群英录：v0.4 第一组 4 人
  { name: "group1-characters-shangguanwaner-desktop.png", url: `http://localhost:3000/characters?q=${encodeQuery("上官婉儿")}`, wait: 2500 },
  { name: "group1-characters-taipinggongzhu-desktop.png", url: `http://localhost:3000/characters?q=${encodeQuery("太平公主")}`, wait: 2500 },
  { name: "group1-characters-libai-desktop.png", url: `http://localhost:3000/characters?q=${encodeQuery("李白")}`, wait: 2500 },
  { name: "group1-characters-dufu-desktop.png", url: `http://localhost:3000/characters?q=${encodeQuery("杜甫")}`, wait: 2500 },

  // 人物榜：4 人所在分类
  { name: "group1-ranking-shangguanwaner-desktop.png", url: `http://localhost:3000/ranking?category=${encodeQuery("后宫/女性")}`, wait: 2500 },
  { name: "group1-ranking-taipinggongzhu-desktop.png", url: `http://localhost:3000/ranking?category=${encodeQuery("皇帝/皇室")}`, wait: 2500 },
  { name: "group1-ranking-libai-desktop.png", url: `http://localhost:3000/ranking?category=${encodeQuery("文人")}`, wait: 2500 },
  { name: "group1-ranking-dufu-desktop.png", url: `http://localhost:3000/ranking?category=${encodeQuery("文人")}&scroll=1`, wait: 2500 },

  // 李白详情页与权力图谱侧栏
  { name: "group1-detail-libai-desktop.png", url: "http://localhost:3000/characters/libai", wait: 2500 },
  { name: "group1-graph-libai-desktop.png", url: `http://localhost:3000/graph?character=libai`, wait: 3500 },

  // 核心 10 人头像展示：皇帝/皇室分类下可看到多位核心人物
  { name: "group1-core10-desktop.png", url: `http://localhost:3000/characters?category=${encodeQuery("皇帝/皇室")}`, wait: 2500 },

  // 默认头像人物展示
  { name: "group1-default-avatars-desktop.png", url: `http://localhost:3000/characters?category=${encodeQuery("宦官")}`, wait: 2500 },
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
