# 唐局 v0.4 太平公主专属视觉资产导入交付

## 核验

- 素材包：`tangju_v04_taiping_gongzhu_assets_for_kimi_FIXED_FULL.zip`
- 已打开 `contact_taiping_gongzhu_FIXED.jpg` 核验，确认人物为 **太平公主**，avatar 头像脸部完整显示。

## 导入内容

| 源文件 | 目标路径 |
|---|---|
| `card/taiping-gongzhu_card_v01.png` | `public/images/characters/card/taiping-gongzhu_card_v01.png` |
| `clean/taiping-gongzhu_clean_v01.png` | `public/images/characters/clean/taiping-gongzhu_clean_v01.png` |
| `avatar/taiping-gongzhu_avatar_v01.png` | `public/images/characters/avatar/taiping-gongzhu_avatar_v01.png` |

## 数据绑定

在 `data/characters.json` 中为 `id: taipinggongzhu` 绑定了：

```json
{
  "cardPath": "/images/characters/card/taiping-gongzhu_card_v01.png",
  "cleanPath": "/images/characters/clean/taiping-gongzhu_clean_v01.png",
  "avatarPath": "/images/characters/avatar/taiping-gongzhu_avatar_v01.png"
}
```

未新建重复人物，未修改其他人物条目，未改动其他人物图片。

## 处理原则

- 未修改、未压缩、未重新设计任何图片。
- 未在前端对图片进行任何叠字处理。
- 详情页主视觉优先使用 `cardPath`。
- 群英录、人物榜、权力图谱右侧面板均使用 `avatarPath`。

## 构建结果

```text
npm run build
✓ Generating static pages using 11 workers (900/900)
```

## 验收截图

| 截图 | 说明 |
|---|---|
| `screenshots/taipinggongzhu-detail-desktop.png` | 太平公主详情页：头部专属 avatar + 卡牌主视觉。 |
| `screenshots/taipinggongzhu-characters-desktop.png` | 群英录搜索「太平公主」结果卡片显示专属头像。 |
| `screenshots/taipinggongzhu-ranking-desktop.png` | 人物榜「皇帝/皇室」分类中太平公主专属头像。 |
| `screenshots/taipinggongzhu-graph-desktop.png` | 权力图谱选中太平公主：右侧面板显示专属头像。 |

## 打包

- 交付包：`datang-stars-v0.4-taipinggongzhu-import.zip`
- 已排除：`node_modules/`、`.next/`、所有旧 `.zip`（含源素材包）、`scripts/venv/`、`__pycache__/`。
