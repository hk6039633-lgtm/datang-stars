# 尉迟恭去重后数据引用完整性审查报告

## 审查背景

在导入《唐局 v0.4 尉迟恭视觉资产包》时，发现 `data/characters.json` 中存在重复条目：

- `yuchigong`：尉迟恭，主分类为武将/将领，有独立事件。
- `yuchijingde`：尉迟敬德，主分类为其他，summary 仅“同尉迟恭”，无独立事件。

已删除重复条目 `yuchijingde`，并将视觉资产与规范数据绑定到 `yuchigong`。本次审查用于确认删除后无数据引用断裂、无 orphan id。

## 1. 全项目 `yuchijingde` 引用检查

| 文件 | 是否包含 `yuchijingde` | 处理说明 |
|---|---|---|
| `data/characters.json` | ❌ 否 | 已删除 |
| `data/events.json` | ❌ 否 | 未引用 |
| `data/book_timeline.json` | ❌ 否 | 未引用 |
| `app/lib/graphData.ts` | ❌ 否 | 动态从 characters.json 生成 |
| `app/components/GraphPageClient.tsx` | ❌ 否 | 未引用 |
| `app/lib/data.ts` | ❌ 否 | 未引用 |
| `app/lib/search.ts` | ❌ 否 | 未引用 |
| `app/ranking/page.tsx` | ❌ 否 | 未引用 |
| `app/characters/page.tsx` | ❌ 否 | 未引用 |
| `app/characters/[id]/page.tsx` | ❌ 否 | 未引用 |
| `VISUAL_COVERAGE_REPORT.md` | ❌ 否 | 未引用 |
| `VISUAL_SYSTEM_V0_4_GROUP1_SUMMARY.md` | ❌ 否 | 未引用 |
| `YUCHIGONG_IMPORT_DELIVERY.md` | ✅ 是 | 历史交付说明文字，仅用于记录本次去重操作，不影响页面链接 |
| `data/characters_backup_724.json` | ✅ 是 | 历史备份文件，不参与构建，可忽略 |

结论：除历史备份与历史交付说明外，**所有运行时代码与数据文件中已无 `yuchijingde` 引用**。

## 2. Orphan ID 检查

检查范围：

- `data/characters.json` 中所有 `relations[].id`
- `data/events.json` 中所有 `characters[].id`

结果：

| 检查项 | 数量 | 说明 |
|---|---|---|
| 总人物数 | 890 | 删除 `yuchijingde` 后 |
| Relations 中引用不存在的 id | 0 | 无 orphan relation |
| Events 中引用不存在的 character id | 0 | 无 orphan event character |

结论：**无 orphan id**。

## 3. 人物总数同步

| 项目 | 删除前 | 删除后 |
|---|---|---|
| `data/characters.json` 人物总数 | 891 | 890 |
| `npm run build` 生成静态页面数 | 900 | 899 |

已在以下文档中同步更新总人物数：

- `VISUAL_COVERAGE_REPORT.md`：总人物数 890，专属视觉人物 17。
- `VISUAL_SYSTEM_V0_4_GROUP1_SUMMARY.md`：增加当前总人物数 890、专属视觉人物总数 17 的说明。

## 4. 搜索验证

通过 `curl` 请求群英录搜索接口验证：

| 搜索词 | 命中 id | 结果 |
|---|---|---|
| 尉迟恭 | `yuchigong` | ✅ 仅命中目标人物 |
| 尉迟敬德 | `yuchigong` + `wangwan` | ✅ 命中目标人物（`wangwan` 因事件“被尉迟敬德擒获”同时命中） |
| 敬德 | `yuchigong` + `wangwan` | ✅ 命中目标人物 |

说明：已无独立的“尉迟敬德”人物卡片，`wangwan` 为王琬，属于正常的事件文本匹配。

## 5. 页面验证

| 页面 | 状态 |
|---|---|
| `/characters/yuchigong` | ✅ 正常，显示“尉迟恭”，分类“武将/将领” |
| 群英录搜索 | ✅ 正常 |
| 人物榜“武将/将领”分类 | ✅ 正常，可找到尉迟恭 |
| 权力图谱 `?character=yuchigong` | ✅ 正常 |

## 6. 构建验证

```bash
npm run build
```

结果：通过，生成 899 个静态页面，无报错。

## 7. 结论与建议

- 删除 `yuchijingde` 未造成任何数据引用断裂或 orphan id。
- 所有运行时代码、数据文件、报告文档均已同步。
- 建议后续遇到类似“同 XXX”且无独立事件的条目时，优先合并到主条目，避免重复人物影响搜索与分类。

## 审查交付物

- 本报告：`YUCHIGONG_DEDUP_AUDIT.md`
- 更新后的视觉覆盖报告：`VISUAL_COVERAGE_REPORT.md`
- 更新后的 v0.4 归档说明：`VISUAL_SYSTEM_V0_4_GROUP1_SUMMARY.md`
- 完整项目包：`datang-stars-v0.4-yuchigong-dedup-audit.zip`
