# 唐局 v0.4 秦琼视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-qinqiong-import.zip`

## 变更摘要

- 导入秦琼（秦叔宝）专属视觉资产三件套：
  - `public/images/characters/clean/qin-qiong_clean_v01.png`
  - `public/images/characters/card/qin-qiong_card_v01.png`
  - `public/images/characters/avatar/qin-qiong_avatar_v01.png`
- 在 `data/characters.json` 中为 `id: qinshubao`（秦叔宝，名琼）绑定：
  - `cleanPath: "/images/characters/clean/qin-qiong_clean_v01.png"`
  - `cardPath: "/images/characters/card/qin-qiong_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/qin-qiong_avatar_v01.png"`
- 构建验证：`npm run build` 通过，生成 900 页面无报错。

## 人物核验

- 已查看 `tangju_v04_qin_qiong_assets_for_kimi.zip` 中的 `contact_qin_qiong.jpg`。
- 确认人物为秦琼，card 图称号为「胡国公」，avatar 脸部完整显示。
- `data/characters.json` 中秦琼真实 id 为 `qinshubao`（姓名：秦叔宝），未新建重复人物。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `qinqiong-detail-desktop.png` | 秦琼（秦叔宝）详情页：头部小头像 + 卡牌主视觉 |
| `qinqiong-characters-desktop.png` | 群英录搜索「秦叔宝」结果卡片 |
| `qinqiong-ranking-desktop.png` | 人物榜「其他」分类中滚动至秦叔宝行 |
| `qinqiong-graph-desktop.png` | 权力图谱：秦叔宝侧栏信息 |

## 文件清单

```
data/characters.json
public/images/characters/clean/qin-qiong_clean_v01.png
public/images/characters/card/qin-qiong_card_v01.png
public/images/characters/avatar/qin-qiong_avatar_v01.png
screenshots/qinqiong-detail-desktop.png
screenshots/qinqiong-characters-desktop.png
screenshots/qinqiong-ranking-desktop.png
screenshots/qinqiong-graph-desktop.png
QINQIONG_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
