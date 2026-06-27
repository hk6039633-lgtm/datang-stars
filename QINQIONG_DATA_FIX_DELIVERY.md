# 唐局 v0.4 秦琼数据修正交付说明

## 交付包

- `datang-stars-v0.4-qinqiong-data-fix.zip`

## 问题与修正

### 修正前问题

1. `data/characters.json` 中秦琼条目 id 为 `qinshubao`，但姓名显示为「秦叔宝」，搜索「秦琼」无法命中。
2. 人物榜中秦叔宝被归入「其他」分类，与秦琼的武将身份不符。

### 修正内容

仅修改 `id: qinshubao` 这一条人物数据：

| 字段 | 修正后 |
|---|---|
| `name` | 秦琼 |
| `letter` | 秦 |
| `canonicalName` | 秦琼 |
| `displayName` | 秦琼 |
| `personalName` | 秦琼 |
| `aliases` | `["秦琼", "秦叔宝", "叔宝", "胡国公", "凌烟阁功臣"]` |
| `category` | 武将/将领 |
| `primaryCategory` | 武将/将领 |
| `subCategory` | 唐初名将 / 凌烟阁功臣 |
| `role` | 秦琼/秦叔宝/胡国公/唐初名将/凌烟阁功臣，名琼，瓦岗/王世充/唐将 |
| `summary` | 秦琼（字叔宝），隋末唐初名将，封胡国公，凌烟阁功臣。相关事件：归唐、凌烟阁功臣。 |

未修改图片路径：

- `cleanPath: "/images/characters/clean/qin-qiong_clean_v01.png"`
- `cardPath: "/images/characters/card/qin-qiong_card_v01.png"`
- `avatarPath: "/images/characters/avatar/qin-qiong_avatar_v01.png"`

## 验证结果

- `npm run build` 通过，生成 900 页面无报错。
- 群英录搜索「秦琼」可命中。
- 群英录搜索「秦叔宝」可命中。
- 人物榜「武将/将领」分类中出现秦琼。
- 详情页、群英录、人物榜、权力图谱均继续使用秦琼专属图片。
- 未新建 `qinqiong` 或 `qin-qiong` 等新人物。

## 验收截图

截图位于 `screenshots/` 目录：

| 截图 | 说明 |
|---|---|
| `qinqiong-fix-search-qinqiong-desktop.png` | 群英录搜索「秦琼」 |
| `qinqiong-fix-search-shubao-desktop.png` | 群英录搜索「秦叔宝」 |
| `qinqiong-fix-ranking-desktop.png` | 人物榜「武将/将领」分类中秦琼 |
| `qinqiong-fix-detail-desktop.png` | 秦琼详情页 |
| `qinqiong-fix-graph-desktop.png` | 权力图谱秦琼侧栏 |

## 文件清单

```
data/characters.json
screenshots/qinqiong-fix-search-qinqiong-desktop.png
screenshots/qinqiong-fix-search-shubao-desktop.png
screenshots/qinqiong-fix-ranking-desktop.png
screenshots/qinqiong-fix-detail-desktop.png
screenshots/qinqiong-fix-graph-desktop.png
QINQIONG_DATA_FIX_DELIVERY.md
VISUAL_COVERAGE_REPORT.md
```

## 备注

- 仅修改 `qinshubao` 一条人物数据。
- 未修改任何图片，未压缩图片，未前端叠字。
- 未改动其他人物。
