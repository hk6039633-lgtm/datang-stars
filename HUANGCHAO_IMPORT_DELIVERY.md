# 唐局 v0.4 黄巢视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-huangchao-import.zip`

## 变更摘要

### 视觉资产导入

- 导入黄巢专属视觉资产三件套：
  - `public/images/characters/clean/huang-chao_clean_v01.png`
  - `public/images/characters/card/huang-chao_card_v01.png`
  - `public/images/characters/avatar/huang-chao_avatar_v01.png`
- 为 `id: huangchao` 绑定：
  - `cleanPath: "/images/characters/clean/huang-chao_clean_v01.png"`
  - `cardPath: "/images/characters/card/huang-chao_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/huang-chao_avatar_v01.png"`

### 数据字段核查与修正

- 确认真实 id 为 `huangchao`（黄巢），未新建重复人物。
- 修正数据字段：

| 字段 | 修正后 |
|---|---|
| `name` / `canonicalName` / `displayName` / `personalName` | 黄巢 |
| `letter` | 黄 |
| `aliases` | `["黄巢", "冲天大将军", "大齐皇帝", "唐末起义领袖"]` |
| `category` / `primaryCategory` | 叛乱势力 |
| `subCategory` | 唐末起义领袖 / 大齐政权建立者 |
| `role` | 黄巢/冲天大将军/大齐皇帝/唐末起义领袖，唐末农民起义领袖 |
| `summary` | 黄巢，唐末农民起义领袖，自称冲天大将军，后建立大齐政权。相关事件：黄巢起义、攻占长安。 |

## 核验

- 已查看 `tangju_v04_huang_chao_assets_for_kimi.zip` 中的 `contact_huang_chao.jpg`。
- 确认人物为黄巢，card 图称号为「唐末起义领袖」，avatar 脸部完整显示。
- 未新建 `huang-chao` / `huangchao` 等新人物。

## 构建验证

`npm run build` 通过，生成 899 个静态页面无报错。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `huangchao-search-name-desktop.png` | 群英录搜索「黄巢」 |
| `huangchao-search-title-desktop.png` | 群英录搜索「冲天大将军」 |
| `huangchao-ranking-desktop.png` | 人物榜「叛乱势力」分类中黄巢 |
| `huangchao-detail-desktop.png` | 黄巢详情页 |
| `huangchao-graph-desktop.png` | 权力图谱黄巢侧栏 |

## 文件清单

```
data/characters.json
public/images/characters/clean/huang-chao_clean_v01.png
public/images/characters/card/huang-chao_card_v01.png
public/images/characters/avatar/huang-chao_avatar_v01.png
screenshots/huangchao-search-name-desktop.png
screenshots/huangchao-search-title-desktop.png
screenshots/huangchao-ranking-desktop.png
screenshots/huangchao-detail-desktop.png
screenshots/huangchao-graph-desktop.png
HUANGCHAO_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
