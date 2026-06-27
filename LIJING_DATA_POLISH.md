# 唐局 v0.4 李靖数据增强补丁

## 交付包

- `datang-stars-v0.4-lijing-data-polish.zip`

## 变更范围

仅修改 `data/characters.json` 中 `id: lijing` 一条记录，未修改任何图片、视觉逻辑与其他人物数据。

## 字段修正

| 字段 | 修正后 |
|---|---|
| `canonicalName` | 李靖 |
| `displayName` | 李靖 |
| `personalName` | 李靖 |
| `aliases` | `["李靖", "李药师", "卫国公", "凌烟阁功臣", "唐初名将"]` |
| `primaryCategory` | 武将/将领 |
| `subCategory` | 唐初名将 / 凌烟阁功臣 |
| `role` | 李靖/李药师/卫国公/唐初名将/凌烟阁功臣，唐初军事统帅，平定边疆，灭东突厥。 |
| `summary` | 李靖，唐初名将，封卫国公，凌烟阁功臣，灭东突厥、平定边疆，是唐初最重要的军事统帅之一。 |

## 搜索验证

以下搜索均已验证可命中 `id: lijing`（李靖）：

- 李靖
- 李药师
- 卫国公
- 凌烟阁功臣

> 注：「凌烟阁功臣」为多个凌烟阁功臣共有别名，搜索时会同时命中李靖、房玄龄、秦琼、尉迟恭等，属正常匹配。

## 构建验证

`npm run build` 通过，生成 899 个静态页面无报错。

## 文件清单

```
data/characters.json
screenshots/lijing-polish-search-name-desktop.png
screenshots/lijing-polish-search-yaoshi-desktop.png
screenshots/lijing-polish-search-weiguo-desktop.png
screenshots/lijing-polish-search-lingyan-desktop.png
screenshots/lijing-polish-detail-desktop.png
LIJING_DATA_POLISH.md
```

## 备注

- 未修改图片，未压缩图片，未前端叠字。
- 未新增人物。
- 未改动其他人物数据。
