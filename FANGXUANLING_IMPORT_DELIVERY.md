# 唐局 v0.4 房玄龄视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-fangxuanling-import.zip`

## 变更摘要

### 视觉资产导入

- 导入房玄龄专属视觉资产三件套：
  - `public/images/characters/clean/fang-xuanling_clean_v01.png`
  - `public/images/characters/card/fang-xuanling_card_v01.png`
  - `public/images/characters/avatar/fang-xuanling_avatar_v01.png`
- 为 `id: fangxuanling` 绑定：
  - `cleanPath: "/images/characters/clean/fang-xuanling_clean_v01.png"`
  - `cardPath: "/images/characters/card/fang-xuanling_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/fang-xuanling_avatar_v01.png"`

### 数据字段核查与修正

- 确认真实 id 为 `fangxuanling`（房玄龄），未新建重复人物。
- 修正数据字段：

| 字段 | 修正后 |
|---|---|
| `name` / `canonicalName` / `displayName` / `personalName` | 房玄龄 |
| `letter` | 房 |
| `aliases` | `["房玄龄", "梁国公", "房谋杜断", "贞观宰相", "凌烟阁功臣"]` |
| `category` / `primaryCategory` | 宰相/大臣 |
| `subCategory` | 贞观宰相 / 凌烟阁功臣 |
| `role` | 房玄龄/梁国公/房谋杜断/贞观宰相/凌烟阁功臣，唐初名相 |
| `summary` | 房玄龄，唐初名相，封梁国公，凌烟阁功臣，与杜如晦并称“房谋杜断”。相关事件：玄武门之变、凌烟阁功臣。 |

## 核验

- 已查看 `tangju_v04_fang_xuanling_assets_for_kimi.zip` 中的 `contact_fang_xuanling.jpg`。
- 确认人物为房玄龄，card 图称号为「梁国公」，avatar 脸部完整显示。
- 未新建 `fang-xuanling` / `fangxuanling` 等新人物。

## 构建验证

`npm run build` 通过，生成 899 个静态页面无报错。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `fangxuanling-search-name-desktop.png` | 群英录搜索「房玄龄」 |
| `fangxuanling-search-chengyu-desktop.png` | 群英录搜索「房谋杜断」 |
| `fangxuanling-ranking-desktop.png` | 人物榜「宰相/大臣」分类中房玄龄 |
| `fangxuanling-detail-desktop.png` | 房玄龄详情页 |
| `fangxuanling-graph-desktop.png` | 权力图谱房玄龄侧栏 |

## 文件清单

```
data/characters.json
public/images/characters/clean/fang-xuanling_clean_v01.png
public/images/characters/card/fang-xuanling_card_v01.png
public/images/characters/avatar/fang-xuanling_avatar_v01.png
screenshots/fangxuanling-search-name-desktop.png
screenshots/fangxuanling-search-chengyu-desktop.png
screenshots/fangxuanling-ranking-desktop.png
screenshots/fangxuanling-detail-desktop.png
screenshots/fangxuanling-graph-desktop.png
FANGXUANLING_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
