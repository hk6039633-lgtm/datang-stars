# 唐局 v0.5 网站视觉体验精修总结

## 1. 本轮优化目标

在 v0.4 最终稳定基线（22 位专属视觉人物 + 11 类默认头像 + 890 位人物 100% 头像覆盖）之上，对网站整体视觉展示体验进行精修。

目标风格：**唐风、古典、高级、干净、沉浸式人物志**。

避免：后台卡片感、管理系统感、廉价网页游戏感、过度金色与阴影、荧光色、网游 UI。

本轮**不新增人物、不生成图片、不重新设计图片、不改动人物数据结构**，只做前端展示层优化。

## 2. 修改页面清单

| 页面 | 优化内容 |
|---|---|
| 首页 `/` | Hero 区增加人物头像视觉阵列；核心入口卡片使用 glyph 圆标与暗金细线；新增“人物图鉴”推荐区 |
| 群英录 `/characters` | 卡片使用统一唐风面板；专属头像人物边框更突出；分类筛选改为唐风标签；搜索/排序区域整合 |
| 人物详情页 `/characters/[id]` | 桌面端左侧 card 大图、右侧信息；移动端 card 在上、信息在下；card 图完整比例显示；信息层级更清晰 |
| 人物榜 `/ranking` | 桌面端表格视觉层级优化，前三名奖牌色；移动端改为卡片式榜单；分类筛选后标题明确 |
| 权力图谱 `/graph` | 右侧面板 avatar 更突出，显示分类、影响说明与 card 缩略图；选中人物时反馈更清晰 |
| 导航 `NavHeader` | active 状态改为深色 pill，风格更统一 |

## 3. 新增 / 修改组件清单

### 新增组件

- `app/components/CharacterAvatar.tsx`：统一人物头像组件，支持 sm/md/lg/xl，自动识别专属头像并加视觉强调。
- `app/components/TangPanel.tsx`：唐风面板容器，带可选标题。
- `app/components/TangTag.tsx`：唐风标签，支持 default / category / alias / event / score / active 等变体。
- `app/components/SectionTitle.tsx`：带暗金细线装饰的章节标题。
- `app/components/CharacterCardPreview.tsx`：小型人物卡片预览，用于关系/推荐列表。

### 修改组件

- `app/components/NavHeader.tsx`：active 导航样式改为深色 pill。
- `app/components/GraphPageClient.tsx`：右侧面板重构，使用 CharacterAvatar / TangTag / TangPanel。

### 样式

- `app/globals.css`：新增 CSS 变量与 `.tang-paper` / `.tang-panel` / `.tang-title-deco` 等工具类，统一米金古纸、深墨棕、暗金细线、暗红点缀风格。

## 4. 样式规范说明

| 元素 | 规范 |
|---|---|
| 页面背景 | `#f8f3e9`（米金古纸） |
| 面板背景 | `#fdfbf7`（暖白纸张） |
| 主文字 | `#451a03`（深墨棕） |
| 次要文字 | `#78350f` / amber-800 系列 |
| 强调色 | `#b45309`（暗金）、`#991b1b`（暗红点缀） |
| 边框 | `rgba(180, 83, 9, 0.18)`（暗金细线） |
| 阴影 | 柔和阴影，避免厚重 |
| 头像 | 圆形，专属头像带微光环，默认头像使用暖色底 + 首字 |
| 标签 | 圆角 pill，低饱和暖色 |
| 按钮 | 深棕/暗金为主，hover 加深 |

## 5. 未修改内容说明

- **未修改任何图片**：所有 `public/images/characters/` 下的 clean / card / avatar / defaults 图片保持原样。
- **未压缩图片**：图片文件未经过压缩或重命名。
- **未前端叠字覆盖 card 图**：详情页 card 图完整显示，未叠加任何文字。
- **未新增人物**：`data/characters.json` 中人物总数仍为 890，未新增或删除人物。
- **未改动人物数据结构**：仅页面组件消费已有字段，未改字段定义。
- **未新增复杂功能**：无新路由、无复杂动画、无新增榜单/算法。

## 6. 构建结果

```
npm run build
```

- 通过，无报错。
- 生成 899 个静态页面。

## 7. 截图清单

### 桌面端（1280×900）

| 文件名 | 说明 |
|---|---|
| `v05-home-desktop.png` | 首页 |
| `v05-characters-desktop.png` | 群英录 |
| `v05-detail-lishimin-desktop.png` | 人物详情页：李世民 |
| `v05-detail-libai-desktop.png` | 人物详情页：李白 |
| `v05-detail-dufu-desktop.png` | 人物详情页：杜甫 |
| `v05-detail-shangguanyi-desktop.png` | 人物详情页：上官仪（无专属 card） |
| `v05-ranking-desktop.png` | 人物榜 |
| `v05-ranking-wujiang-desktop.png` | 人物榜分类筛选：武将/将领 |
| `v05-graph-desktop.png` | 权力图谱 |
| `v05-graph-panel-qinshubao-desktop.png` | 权力图谱右侧面板：秦琼 |
| `v05-fix1-home-desktop.png` | fix1 重截：首页（生产构建，无 dev indicator） |
| `v05-fix1-detail-libai-desktop.png` | fix1 重截：人物详情页：李白 |

### 移动端（390×844）

| 文件名 | 说明 |
|---|---|
| `v05-home-mobile.png` | 首页 |
| `v05-characters-mobile.png` | 群英录 |
| `v05-detail-libai-mobile.png` | 人物详情页：李白 |
| `v05-ranking-mobile.png` | 人物榜 |
| `v05-graph-panel-weizheng-mobile.png` | 权力图谱右侧面板：魏征 |
| `v05-fix1-home-mobile.png` | fix1 重截：首页（生产构建，无 dev indicator，含移动导航） |
| `v05-fix1-characters-mobile.png` | fix1 重截：群英录 |
| `v05-fix1-detail-libai-mobile.png` | fix1 重截：人物详情页：李白 |
| `v05-fix1-ranking-mobile.png` | fix1 重截：人物榜 |
| `v05-fix1-graph-mobile.png` | fix1 重截：权力图谱 |

> fix1 说明：v0.5 初版截图使用 dev server，左下角带有 Next.js dev indicator（黑色“N”）。fix1 使用生产构建（`npm run build && npm run start`）重新截图，移除了该标识，并验证移动端导航显示正常。

## 8. 后续可优化建议

- 增加页面级过渡动画（保持克制）。
- 为默认头像人物生成更丰富的分类纹样，进一步降低“默认感”。
- 在人物详情页增加“同类型人物”推荐模块。
- 首页 Hero 区可加入缓慢的视差或卷轴感背景（可选）。
- 为权力图谱节点 hover 状态增加更明显的选中光环。

## 9. 交付包

- `datang-stars-v0.5-visual-experience-polish.zip`
