# 唐局 v0.4 魏征视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-weizheng-import.zip`

## 变更摘要

### 视觉资产导入

- 导入魏征专属视觉资产三件套：
  - `public/images/characters/clean/wei-zheng_clean_v01.png`
  - `public/images/characters/card/wei-zheng_card_v01.png`
  - `public/images/characters/avatar/wei-zheng_avatar_v01.png`
- 为 `id: weizheng` 绑定：
  - `cleanPath: "/images/characters/clean/wei-zheng_clean_v01.png"`
  - `cardPath: "/images/characters/card/wei-zheng_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/wei-zheng_avatar_v01.png"`

### 数据字段核查与修正

- 确认真实 id 为 `weizheng`（魏征），未新建重复人物。
- 修正数据字段：

| 字段 | 修正后 |
|---|---|
| `name` / `canonicalName` / `displayName` / `personalName` | 魏征 |
| `letter` | 魏 |
| `aliases` | `["魏征", "魏徵", "郑国公", "直谏名臣", "贞观谏臣"]` |
| `category` / `primaryCategory` | 宰相/大臣 |
| `subCategory` | 贞观谏臣 / 凌烟阁功臣 |
| `role` | 魏征/魏徵/郑国公/直谏名臣/贞观谏臣，唐初名相 |
| `summary` | 魏征（字玄成），唐初名相，封郑国公，以直谏闻名，凌烟阁功臣。相关事件：玄武门之变、凌烟阁功臣。 |

## 核验

- 已查看 `tangju_v04_wei_zheng_assets_for_kimi.zip` 中的 `contact_wei_zheng.jpg`。
- 确认人物为魏征，card 图称号为「郑国公」，avatar 脸部完整显示。
- 未新建 `wei-zheng` / `weizheng` 等新人物。

## 构建验证

`npm run build` 通过，生成 899 个静态页面无报错。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `weizheng-search-name-desktop.png` | 群英录搜索「魏征」 |
| `weizheng-search-variant-desktop.png` | 群英录搜索「魏徵」 |
| `weizheng-search-title-desktop.png` | 群英录搜索「郑国公」 |
| `weizheng-ranking-desktop.png` | 人物榜「宰相/大臣」分类中魏征 |
| `weizheng-detail-desktop.png` | 魏征详情页 |
| `weizheng-graph-desktop.png` | 权力图谱魏征侧栏 |

## 文件清单

```
data/characters.json
public/images/characters/clean/wei-zheng_clean_v01.png
public/images/characters/card/wei-zheng_card_v01.png
public/images/characters/avatar/wei-zheng_avatar_v01.png
screenshots/weizheng-search-name-desktop.png
screenshots/weizheng-search-variant-desktop.png
screenshots/weizheng-search-title-desktop.png
screenshots/weizheng-ranking-desktop.png
screenshots/weizheng-detail-desktop.png
screenshots/weizheng-graph-desktop.png
WEIZHENG_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
