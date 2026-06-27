# 唐局人物视觉系统 v0.3：11 类默认头像接入交付

## 本轮目标

将 ChatGPT 生成的 11 类默认头像原图导入项目，并验证已实现的默认头像映射与页面回退逻辑。

## 导入内容

来源包：`tangju_v03_default_avatars_for_kimi.zip`

导入路径：

```text
tangju_v03_default_avatars_for_kimi.zip/defaults/*.png
    → public/images/characters/defaults/
```

共 11 张默认头像，按 `manifest.json` 对应 11 个人物分类：

| 分类 | 文件名 |
|---|---|
| 皇帝/皇室 | `imperial-default.png` |
| 宰相/大臣 | `minister-default.png` |
| 武将/将领 | `general-default.png` |
| 节度使/藩镇 | `jiedushi-default.png` |
| 宦官 | `eunuch-default.png` |
| 后宫/女性 | `female-default.png` |
| 外族 | `foreign-default.png` |
| 文人 | `literati-default.png` |
| 叛乱势力 | `rebel-default.png` |
| 宗教人物 | `religion-default.png` |
| 其他 | `other-default.png` |

## 处理原则

- 未修改、未压缩、未重新设计任何图片。
- 未在前端对图片进行任何叠字处理。
- 核心 10 人专属 `avatarPath` 保持优先，未被默认头像覆盖。
- 无专属头像的人物按 `primaryCategory` 自动匹配默认头像。
- 详情页主视觉仍只使用 `cardPath` / `cleanPath`，默认头像不会当作大图。

## 修改文件清单

| 文件 | 说明 |
|---|---|
| `public/images/characters/defaults/*.png` | 新增 11 张默认头像原图。 |
| `VISUAL_COVERAGE_REPORT.md` | 更新覆盖统计：当前 891 人全部具有有效头像（10 人专属 + 881 人默认）。 |
| `scripts/screenshot-v03-default-avatar-import.mjs` | 新增 v0.3 默认头像导入验收截图脚本。 |

其余代码在 v0.3 准备阶段已完成并直接使用：

- `app/lib/defaultAvatar.ts`
- `app/lib/data.ts`
- `app/characters/page.tsx`
- `app/ranking/page.tsx`
- `app/components/GraphPageClient.tsx`
- `app/characters/[id]/page.tsx`

## 构建结果

```text
npm run build
✓ Generating static pages using 11 workers (900/900)
```

## 验收截图

| 截图 | 说明 |
|---|---|
| `screenshots/characters-mixed-avatars-desktop.png` | 群英录「宰相/大臣」分类：李泌显示专属头像，其余人物显示 `minister-default.png`。 |
| `screenshots/ranking-default-avatars-desktop.png` | 人物榜「文人」分类：全部使用 `literati-default.png`。 |
| `screenshots/graph-default-avatar-desktop.png` | 权力图谱选中「上官仪」：右侧面板显示 `minister-default.png`。 |
| `screenshots/character-default-avatar-desktop.png` | 「上官仪」详情页：头部小头像显示 `minister-default.png`，主视觉无大图。 |
| `screenshots/core10-avatars-desktop.png` | 群英录首页 TOP8：核心 10 人专属头像正常显示，未被默认头像覆盖。 |

## 打包

- 交付包：`datang-stars-v0.3-default-avatar-import.zip`
- 已排除：`node_modules/`、`.next/`、所有旧 `.zip`（含 `tangju_v03_default_avatars_for_kimi.zip`）、`scripts/venv/`、`__pycache__/`。
