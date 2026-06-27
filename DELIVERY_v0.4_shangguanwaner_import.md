# 唐局 v0.4 上官婉儿专属视觉资产导入交付

## 来源与核验

- 素材包：`tangju_v04_shangguan_waner_assets_for_kimi_FIXED.zip`
- 已打开 `contact_shangguan_waner_fixed.jpg` 核验，确认人物为 **上官婉儿**。

## 导入内容

将素材包中 `card/`、`clean/`、`avatar/` 下的图片原样导入项目对应目录：

| 源文件 | 目标路径 |
|---|---|
| `card/shangguan-waner_card_v01.png` | `public/images/characters/card/shangguan-waner_card_v01.png` |
| `clean/shangguan-waner_clean_v01.png` | `public/images/characters/clean/shangguan-waner_clean_v01.png` |
| `avatar/shangguan-waner_avatar_v01.png` | `public/images/characters/avatar/shangguan-waner_avatar_v01.png` |

## 数据绑定

在 `data/characters.json` 中为 `id: shangguanwaner` 绑定以下字段：

```json
{
  "cardPath": "/images/characters/card/shangguan-waner_card_v01.png",
  "cleanPath": "/images/characters/clean/shangguan-waner_clean_v01.png",
  "avatarPath": "/images/characters/avatar/shangguan-waner_avatar_v01.png"
}
```

未修改该人物其他字段（`historicalImportanceScore`、`impactStatement`、`subCategory` 等保持不变）。

## 处理原则

- 未修改、未压缩、未重新设计任何图片。
- 未在前端对图片进行任何叠字处理。
- 上官婉儿专属 `avatarPath` 优先于其分类（后宫/女性）默认头像。
- 详情页主视觉仍只使用 `cardPath` / `cleanPath`。

## 构建结果

```text
npm run build
✓ Generating static pages using 11 workers (900/900)
```

## 验收截图

| 截图 | 说明 |
|---|---|
| `screenshots/shangguanwaner-detail-desktop.png` | 上官婉儿详情页：头部专属 avatar + 卡牌主视觉。 |
| `screenshots/shangguanwaner-characters-desktop.png` | 群英录搜索「上官婉儿」结果卡片显示专属头像。 |
| `screenshots/shangguanwaner-ranking-desktop.png` | 人物榜「后宫/女性」分类：杨贵妃与上官婉儿显示专属头像，其余使用 `female-default.png`。 |
| `screenshots/shangguanwaner-graph-desktop.png` | 权力图谱选中上官婉儿：右侧面板显示专属头像。 |

## 打包

- 交付包：`datang-stars-v0.4-shangguanwaner-import.zip`
- 已排除：`node_modules/`、`.next/`、所有旧 `.zip`（含源素材包）、`scripts/venv/`、`__pycache__/`。
