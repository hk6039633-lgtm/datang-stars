# 唐局 v0.4 李林甫视觉资产导入交付说明

## 交付包

- `datang-stars-v0.4-lilinfu-import.zip`

## 变更摘要

### 视觉资产导入

- 导入李林甫专属视觉资产三件套：
  - `public/images/characters/clean/li-linfu_clean_v01.png`
  - `public/images/characters/card/li-linfu_card_v01.png`
  - `public/images/characters/avatar/li-linfu_avatar_v01.png`
- 为 `id: lilinfu` 绑定：
  - `cleanPath: "/images/characters/clean/li-linfu_clean_v01.png"`
  - `cardPath: "/images/characters/card/li-linfu_card_v01.png"`
  - `avatarPath: "/images/characters/avatar/li-linfu_avatar_v01.png"`

### 数据字段核查与修正

- 确认真实 id 为 `lilinfu`（李林甫），未新建重复人物。
- 修正数据字段：

| 字段 | 修正后 |
|---|---|
| `name` / `canonicalName` / `displayName` / `personalName` | 李林甫 |
| `letter` | 李 |
| `aliases` | `["李林甫", "晋国公", "玄宗权相", "口蜜腹剑"]` |
| `category` / `primaryCategory` | 宰相/大臣 |
| `subCategory` | 玄宗权相 / 天宝权臣 |
| `role` | 李林甫/晋国公/玄宗权相/口蜜腹剑，唐玄宗天宝年间权相 |
| `summary` | 李林甫，唐玄宗天宝年间权相，封晋国公，以“口蜜腹剑”著称。相关事件：安史之乱、十王宅百孙院、专权。 |

## 核验

- 已查看 `tangju_v04_li_linfu_assets_for_kimi.zip` 中的 `contact_li_linfu.jpg`。
- 确认人物为李林甫，card 图称号为「晋国公」，avatar 脸部完整显示。
- 未新建 `li-linfu` / `lilinfu` 等新人物。

## 构建验证

`npm run build` 通过，生成 899 个静态页面无报错。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `lilinfu-search-name-desktop.png` | 群英录搜索「李林甫」 |
| `lilinfu-search-chengyu-desktop.png` | 群英录搜索「口蜜腹剑」 |
| `lilinfu-ranking-desktop.png` | 人物榜「宰相/大臣」分类中李林甫 |
| `lilinfu-detail-desktop.png` | 李林甫详情页 |
| `lilinfu-graph-desktop.png` | 权力图谱李林甫侧栏 |

## 文件清单

```
data/characters.json
public/images/characters/clean/li-linfu_clean_v01.png
public/images/characters/card/li-linfu_card_v01.png
public/images/characters/avatar/li-linfu_avatar_v01.png
screenshots/lilinfu-search-name-desktop.png
screenshots/lilinfu-search-chengyu-desktop.png
screenshots/lilinfu-ranking-desktop.png
screenshots/lilinfu-detail-desktop.png
screenshots/lilinfu-graph-desktop.png
LILINFU_IMPORT_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 图片原样复制，未做压缩、未前端叠字、未修改文件名。
- 未改动其他人物图片或数据。
- 详情页主视觉优先使用 `cardPath`，群英录/人物榜/权力图谱头像使用 `avatarPath` / `getCharacterAvatar()` 回退逻辑。
