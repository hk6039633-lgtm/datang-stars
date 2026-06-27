# 唐局 v0.4 李靖视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-lijing-import.zip`

## 变更摘要

- 导入李靖专属视觉资产三件套：
  - `public/images/characters/clean/li-jing_clean_v01.png`
  - `public/images/characters/card/li-jing_card_v01.png`
  - `public/images/characters/avatar/li-jing_avatar_v01.png`
- 在 `data/characters.json` 中为 `id: lijing`（李靖）绑定：
  - `cleanPath: "/images/characters/clean/li-jing_clean_v01.png"`
  - `cardPath: "/images/characters/card/li-jing_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/li-jing_avatar_v01.png"`
- 构建验证：`npm run build` 通过，生成 900 页面无报错。

## 人物核验

- 已查看 `tangju_v04_li_jing_assets_for_kimi.zip` 中的 `contact_li_jing.jpg`。
- 确认人物为李靖，avatar 脸部完整显示。
- `data/characters.json` 中李靖真实 id 为 `lijing`，未新建重复人物。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `lijing-detail-desktop.png` | 李靖详情页：头部小头像 + 卡牌主视觉 |
| `lijing-characters-desktop.png` | 群英录搜索「李靖」结果卡片 |
| `lijing-ranking-desktop.png` | 人物榜「武将/将领」分类：李靖排名第二 |
| `lijing-graph-desktop.png` | 权力图谱：李靖侧栏信息 |

## 文件清单

```
data/characters.json
public/images/characters/clean/li-jing_clean_v01.png
public/images/characters/card/li-jing_card_v01.png
public/images/characters/avatar/li-jing_avatar_v01.png
screenshots/lijing-detail-desktop.png
screenshots/lijing-characters-desktop.png
screenshots/lijing-ranking-desktop.png
screenshots/lijing-graph-desktop.png
LIJING_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
