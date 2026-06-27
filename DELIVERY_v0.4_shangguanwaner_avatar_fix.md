# 唐局 v0.4 上官婉儿头像修正交付

## 修正内容

- 素材包：`tangju_v04_shangguan_waner_avatar_FIX_ONLY.zip`
- 仅替换一个文件：
  - `avatar/shangguan-waner_avatar_v01.png` → `public/images/characters/avatar/shangguan-waner_avatar_v01.png`

## 未修改项

- 未修改 `cardPath` 与 `public/images/characters/card/shangguan-waner_card_v01.png`。
- 未修改 `cleanPath` 与 `public/images/characters/clean/shangguan-waner_clean_v01.png`。
- 未修改 `data/characters.json` 中上官婉儿的任何字段。
- 未压缩、未重新设计图片。
- 未在前端对图片进行叠字处理。

## 构建结果

```text
npm run build
✓ Generating static pages using 11 workers (900/900)
```

## 验收截图

| 截图 | 说明 |
|---|---|
| `screenshots/shangguanwaner-avatar-fix-characters-desktop.png` | 群英录搜索「上官婉儿」结果卡片头像。 |
| `screenshots/shangguanwaner-avatar-fix-ranking-desktop.png` | 人物榜「后宫/女性」分类中上官婉儿头像。 |
| `screenshots/shangguanwaner-avatar-fix-graph-desktop.png` | 权力图谱右侧面板中上官婉儿头像。 |
| `screenshots/shangguanwaner-avatar-fix-detail-desktop.png` | 上官婉儿详情页顶部小头像。 |

## 打包

- 交付包：`datang-stars-v0.4-shangguanwaner-avatar-fix.zip`
- 已排除：`node_modules/`、`.next/`、所有旧 `.zip`（含源素材包）、`scripts/venv/`、`__pycache__/`。
