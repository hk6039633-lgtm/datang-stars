# 唐局人物视觉系统 v0.3：11 类默认头像系统（代码准备）

## 本轮目标

为尚无专属 `avatarPath` 的人物建立分类默认头像机制：
- 先完成数据结构、路径映射、页面接入与安全回退；
- 不生成、不修改任何图片；
- 默认头像文件由 ChatGPT 后续统一放入 `public/images/characters/defaults/`。

## 修改文件清单

| 文件 | 说明 |
|---|---|
| `app/lib/defaultAvatar.ts` | 新增：11 类分类→默认头像映射 + `resolveCharacterAvatar` / `getCharacterAvatar`。 |
| `app/types.ts` | 新增 `effectiveAvatarPath?: string` 字段。 |
| `app/lib/data.ts` | `getCharacters()` 现在输出 `effectiveAvatarPath`（专属头像不存在时回退默认头像；默认头像也不存在时返回 `undefined`，避免破图）。 |
| `app/characters/page.tsx` | 群英录人物卡片统一使用 `getCharacterAvatar(c)`。 |
| `app/ranking/page.tsx` | 人物榜统一使用 `getCharacterAvatar(c)`，无头像时显示姓名首字占位。 |
| `app/components/GraphPageClient.tsx` | 权力图谱右侧面板使用 `effectiveAvatarPath`。 |
| `app/characters/[id]/page.tsx` | 详情页头部小头像使用 `getCharacterAvatar(character)`；详情页主视觉仍保持 `cardPath → cleanPath` 规则。 |
| `app/layout.tsx` | 移除 `next/font/google` 的 `Geist` 依赖，避免构建时因网络问题无法拉取 Google Fonts。 |
| `app/globals.css` | 移除对 `--font-geist-sans` 的引用，改用系统字体栈。 |
| `public/images/characters/defaults/` | 新建空目录，供后续放置默认头像。 |
| `VISUAL_COVERAGE_REPORT.md` | 新增：人物图片覆盖情况统计报告。 |
| `scripts/screenshot-v03-default-avatar.mjs` | 新增：v0.3 验收截图脚本。 |

## 默认头像路径规范

```text
public/images/characters/defaults/
├── imperial-default.png   # 皇帝/皇室
├── minister-default.png   # 宰相/大臣
├── general-default.png    # 武将/将领
├── jiedushi-default.png   # 节度使/藩镇
├── eunuch-default.png     # 宦官
├── female-default.png     # 后宫/女性
├── foreign-default.png    # 外族
├── literati-default.png   # 文人
├── rebel-default.png      # 叛乱势力
├── religion-default.png   # 宗教人物
└── other-default.png      # 其他
```

## 头像解析优先级

1. 人物专属 `avatarPath` 存在且文件存在 → 使用专属头像；
2. 否则按 `primaryCategory` 查找对应默认头像，文件存在 → 使用默认头像；
3. 否则返回 `undefined`，各页面回退到文字布局或姓名首字占位；
4. 详情页主视觉仍优先 `cardPath` → `cleanPath`，默认头像不作为大图。

## 构建结果

```text
npm run build
✓ Generating static pages using 11 workers (900/900)
```

> 说明：首次构建失败是因为 `next/font/google` 无法连接 Google Fonts 下载 `Geist`。为消除对构建环境的网络依赖，已将字体改为系统字体栈。此改动不影响页面视觉风格。

## 验收截图

| 截图 | 说明 |
|---|---|
| `screenshots/characters-default-avatar-desktop.png` | 群英录「文人」分类，当前无专属头像，显示文字卡片（默认头像交付后将自动显示）。 |
| `screenshots/ranking-default-avatar-desktop.png` | 人物榜「宰相/大臣」分类，多数人物显示姓名首字占位，已有专属头像者正常显示。 |
| `screenshots/graph-default-avatar-desktop.png` | 权力图谱选中「上官仪」右侧面板，当前无头像，显示文字信息。 |
| `screenshots/character-no-avatar-desktop.png` | 「上官仪」详情页，头部无小头像，主视觉无大图，保持文字头部。 |

## 打包

- 交付包：`datang-stars-v0.3-default-avatar-prep.zip`
- 已排除：`node_modules/`、`.next/`、`.next.zip`、所有旧 `.zip`、`scripts/venv/`、`__pycache__/`。
