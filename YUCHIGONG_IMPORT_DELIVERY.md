# 唐局 v0.4 尉迟恭视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-yuchigong-import.zip`

## 变更摘要

### 视觉资产导入

- 导入尉迟恭专属视觉资产三件套：
  - `public/images/characters/clean/yuchi-gong_clean_v01.png`
  - `public/images/characters/card/yuchi-gong_card_v01.png`
  - `public/images/characters/avatar/yuchi-gong_avatar_v01.png`
- 为 `id: yuchigong` 绑定：
  - `cleanPath: "/images/characters/clean/yuchi-gong_clean_v01.png"`
  - `cardPath: "/images/characters/card/yuchi-gong_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/yuchi-gong_avatar_v01.png"`

### 数据字段核查与修正

- 确认真实 id 为 `yuchigong`（尉迟恭）。
- 删除原重复条目 `yuchijingde`（该条目无独立事件，仅备注“同尉迟恭”）。
- 修正 `yuchigong` 数据字段：

| 字段 | 修正后 |
|---|---|
| `name` / `canonicalName` / `displayName` / `personalName` | 尉迟恭 |
| `letter` | 尉 |
| `aliases` | `["尉迟恭", "尉迟敬德", "敬德", "鄂国公", "凌烟阁功臣"]` |
| `category` / `primaryCategory` | 武将/将领 |
| `subCategory` | 唐初猛将 / 凌烟阁功臣 |
| `role` | 尉迟恭/尉迟敬德/鄂国公/唐初猛将/凌烟阁功臣，名恭，玄武门之变关键武将 |
| `summary` | 尉迟恭（字敬德），唐初猛将，封鄂国公，凌烟阁功臣。相关事件：玄武门之变、归唐、凌烟阁功臣。 |

## 核验

- 已查看 `tangju_v04_yuchi_gong_assets_for_kimi.zip` 中的 `contact_yuchi_gong.jpg`。
- 确认人物为尉迟恭，card 图称号为「鄂国公」，avatar 脸部完整显示。
- 未新建 `yuchigong` / `yuchi-gong` / `yuchijingde` 等新人物。

## 构建验证

`npm run build` 通过，生成 899 个静态页面无报错（删除重复条目后由 900 降至 899）。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `yuchigong-search-gong-desktop.png` | 群英录搜索「尉迟恭」 |
| `yuchigong-search-jingde-desktop.png` | 群英录搜索「尉迟敬德」 |
| `yuchigong-ranking-desktop.png` | 人物榜「武将/将领」分类中尉迟恭 |
| `yuchigong-detail-desktop.png` | 尉迟恭详情页 |
| `yuchigong-graph-desktop.png` | 权力图谱尉迟恭侧栏 |

## 文件清单

```
data/characters.json
public/images/characters/clean/yuchi-gong_clean_v01.png
public/images/characters/card/yuchi-gong_card_v01.png
public/images/characters/avatar/yuchi-gong_avatar_v01.png
screenshots/yuchigong-search-gong-desktop.png
screenshots/yuchigong-search-jingde-desktop.png
screenshots/yuchigong-ranking-desktop.png
screenshots/yuchigong-detail-desktop.png
screenshots/yuchigong-graph-desktop.png
YUCHIGONG_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
