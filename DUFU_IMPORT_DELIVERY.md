# 唐局 v0.4 杜甫视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-dufu-import-CLEAN.zip`

> 说明：第一次生成的 `datang-stars-v0.4-dufu-import.zip` 误包含旧 zip、临时素材、历史截图、完整图片目录等内容，体积达 687 MB，不符合交付规范。已重新清理打包为 `datang-stars-v0.4-dufu-import-CLEAN.zip`，详见 `DUFU_PACKAGE_AUDIT.md`。

## 变更摘要

- 导入杜甫专属视觉资产三件套：
  - `public/images/characters/clean/du-fu_clean_v01.png`
  - `public/images/characters/card/du-fu_card_v01.png`
  - `public/images/characters/avatar/du-fu_avatar_v01.png`
- 在 `data/characters.json` 中为 `id: dufu` 绑定：
  - `cleanPath: "/images/characters/clean/du-fu_clean_v01.png"`
  - `cardPath: "/images/characters/card/du-fu_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/du-fu_avatar_v01.png"`
- 构建验证：`npm run build` 通过，生成 900 页面无报错。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `dufu-detail-desktop.png` | 杜甫详情页：头部小头像 + 卡牌主视觉 |
| `dufu-characters-desktop.png` | 群英录搜索「杜甫」结果卡片 |
| `dufu-ranking-desktop.png` | 人物榜「文人」分类：杜甫排名第二 |
| `dufu-graph-desktop.png` | 权力图谱：杜甫侧栏信息 |

## 交付包内容

```
data/characters.json
public/images/characters/clean/du-fu_clean_v01.png
public/images/characters/card/du-fu_card_v01.png
public/images/characters/avatar/du-fu_avatar_v01.png
screenshots/dufu-detail-desktop.png
screenshots/dufu-characters-desktop.png
screenshots/dufu-ranking-desktop.png
screenshots/dufu-graph-desktop.png
app/...                         # 当前源码必要文件
package.json / package-lock.json
next.config.ts / tsconfig.json / next-env.d.ts
postcss.config.mjs / eslint.config.mjs
.gitignore / AGENTS.md / README.md
DUFU_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
DUFU_PACKAGE_AUDIT.md
```

## 备注

- 杜甫头像裁切已按 `contact_du_fu.jpg` 预览确认脸部完整，最终验收以 ChatGPT 验收为准。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `getCharacterAvatar()` 专属头像 → 分类默认头像回退逻辑。
