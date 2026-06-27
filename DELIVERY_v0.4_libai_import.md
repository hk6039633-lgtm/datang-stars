# 唐局 v0.4 李白专属视觉资产导入交付

## 核验

- 素材包：`tangju_v04_li_bai_assets_for_kimi.zip`
- 已打开 `contact_li_bai.jpg` 核验，确认人物为 **李白**，avatar 头像脸部完整显示。

## 导入内容

| 源文件 | 目标路径 |
|---|---|
| `card/li-bai_card_v01.png` | `public/images/characters/card/li-bai_card_v01.png` |
| `clean/li-bai_clean_v01.png` | `public/images/characters/clean/li-bai_clean_v01.png` |
| `avatar/li-bai_avatar_v01.png` | `public/images/characters/avatar/li-bai_avatar_v01.png` |

## 数据绑定

经确认，`data/characters.json` 中李白的真实 `id` 为 `libai`。已为该条目绑定：

```json
{
  "cardPath": "/images/characters/card/li-bai_card_v01.png",
  "cleanPath": "/images/characters/clean/li-bai_clean_v01.png",
  "avatarPath": "/images/characters/avatar/li-bai_avatar_v01.png"
}
```

未新建重复人物，未修改其他人物条目或图片。

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
| `screenshots/libai-detail-desktop.png` | 李白详情页：头部专属 avatar + 卡牌主视觉。 |
| `screenshots/libai-characters-desktop.png` | 群英录搜索「李白」结果卡片显示专属头像。 |
| `screenshots/libai-ranking-desktop.png` | 人物榜「文人」分类中李白专属头像。 |
| `screenshots/libai-graph-desktop.png` | 权力图谱选中李白：右侧面板显示专属头像。 |

## 打包

- 交付包：`datang-stars-v0.4-libai-import.zip`
- 已排除：`node_modules/`、`.next/`、所有旧 `.zip`（含源素材包）、`scripts/venv/`、`__pycache__/`。
