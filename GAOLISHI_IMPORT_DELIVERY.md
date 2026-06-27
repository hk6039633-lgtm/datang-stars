# 唐局 v0.4 高力士视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-gaolishi-import.zip`

## 变更摘要

### 视觉资产导入

- 导入高力士专属视觉资产三件套：
  - `public/images/characters/clean/gao-lishi_clean_v01.png`
  - `public/images/characters/card/gao-lishi_card_v01.png`
  - `public/images/characters/avatar/gao-lishi_avatar_v01.png`
- 为 `id: gaolishi` 绑定：
  - `cleanPath: "/images/characters/clean/gao-lishi_clean_v01.png"`
  - `cardPath: "/images/characters/card/gao-lishi_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/gao-lishi_avatar_v01.png"`

### 数据字段核查与修正

- 确认真实 id 为 `gaolishi`（高力士），未新建重复人物。
- 修正数据字段：

| 字段 | 修正后 |
|---|---|
| `name` / `canonicalName` / `displayName` / `personalName` | 高力士 |
| `letter` | 高 |
| `aliases` | `["高力士", "冯元一", "玄宗近侍", "内廷权臣"]` |
| `category` / `primaryCategory` | 宦官 |
| `subCategory` | 玄宗内侍 / 内廷权臣 |
| `role` | 高力士/冯元一/玄宗近侍/内廷权臣，唐玄宗时期宦官 |
| `summary` | 高力士，唐玄宗时期著名宦官，原名冯元一，长期侍奉玄宗，为内廷权臣。相关事件：安史之乱、马嵬驿之变。 |

## 核验

- 已查看 `tangju_v04_gao_lishi_assets_for_kimi.zip` 中的 `contact_gao_lishi.jpg`。
- 确认人物为高力士，card 图称号为「内廷权臣」，avatar 脸部完整显示。
- 未新建 `gao-lishi` / `gaolishi` 等新人物。

## 构建验证

`npm run build` 通过，生成 899 个静态页面无报错。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `gaolishi-search-name-desktop.png` | 群英录搜索「高力士」 |
| `gaolishi-search-title-desktop.png` | 群英录搜索「玄宗近侍」 |
| `gaolishi-ranking-desktop.png` | 人物榜「宦官」分类中高力士 |
| `gaolishi-detail-desktop.png` | 高力士详情页 |
| `gaolishi-graph-desktop.png` | 权力图谱高力士侧栏 |

## 文件清单

```
data/characters.json
public/images/characters/clean/gao-lishi_clean_v01.png
public/images/characters/card/gao-lishi_card_v01.png
public/images/characters/avatar/gao-lishi_avatar_v01.png
screenshots/gaolishi-search-name-desktop.png
screenshots/gaolishi-search-title-desktop.png
screenshots/gaolishi-ranking-desktop.png
screenshots/gaolishi-detail-desktop.png
screenshots/gaolishi-graph-desktop.png
GAOLISHI_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
