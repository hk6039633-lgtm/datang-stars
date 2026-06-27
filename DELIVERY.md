# 唐局 v0.2.1 数据修正补丁交付

## 本轮目标

在 v0.2 基础上做数据修正补丁，不新增视觉图片，不做新功能。

## 交付物

| 文件 | 说明 |
|------|------|
| `data/characters.json` | 修改后的人物数据（891 人） |
| `DATA_FIX_V0_2_1.md` | v0.2.1 数据修正说明 |
| `TOP100_IMPACT_STATEMENTS.md` | 历史影响榜 TOP100 影响说明 |
| `app/lib/search.ts` | 统一搜索函数 |
| `app/characters/page.tsx` | 接入统一搜索、默认历史影响力排序 |
| `app/components/GraphPageClient.tsx` | 接入统一搜索 |
| `app/lib/graphData.ts` | 接入统一搜索 |
| `scripts/restructure_characters.py` | 数据处理脚本（含 v0.2.1 修正） |
| `scripts/screenshot-v021.mjs` | v0.2.1 截图脚本 |
| `datang-stars-v0.2.1-data-fix.zip` | 项目打包 |
| `screenshots/*` | 桌面端与移动端截图 |
| 本文件 `DELIVERY.md` | 交付说明 |

## 关键变更

### 1. 修复重复人物：李湛

- 删除重复条目 `lizhan`（错误分类为宦官）
- 保留 `jingzong` 作为唐敬宗唯一主条目
- 总人物数由 892 降至 891

### 2. 皇帝/皇室子分类修正

- 武则天：`subCategory` 由「皇帝」改为「女皇」
- 皇帝/皇室分类保留太子、亲王、公主、宗室、驸马，共 35 人

### 3. 前 100 人物分类修正

- 长孙无忌：其他 → 宰相/大臣
- 李靖：宰相/大臣 → 武将/将领
- 尉迟恭：其他 → 武将/将领
- 白居易、刘禹锡、韩愈、王维：宰相/大臣 → 文人
- 来俊臣：宰相/大臣 → 其他，subCategory「酷吏」
- 玄奘：score 46 → 72
- 上官婉儿：score 59 → 78，subCategory「宫廷女官」

### 4. TOP100 impactStatement

为历史影响榜前 100 名人物补充 `impactStatement`：

- 核心人物人工编写一句话说明
- 其余人物基于分类、身份与事件模板生成，不直接复用 summary

### 5. 统一搜索函数

新增 `app/lib/search.ts`：`matchCharacterSearch(character, query)`

统一搜索字段：name、displayName、canonicalName、personalName、templeName、dynastyTitle、formerTitle、aliases、role、summary、events。

已接入群英录、权力图谱、中心人物搜索。

### 6. 群英录默认排序

默认排序由「出场次数降序」改为「历史影响力降序」，出场次数排序仍保留为可选项。

## 截图清单

### 桌面端

- `home-desktop.png`
- `characters-desktop.png`
- `characters-search-taizong-desktop.png`
- `characters-search-minghuang-desktop.png`
- `ranking-historical-impact-desktop.png`
- `ranking-imperial-desktop.png`
- `gaozong-detail-desktop.png`
- `wuzetian-detail-desktop.png`
- `lijing-detail-desktop.png`
- `shangguanwaner-detail-desktop.png`

### 移动端

- `home-mobile.png`
- `characters-mobile.png`
- `ranking-mobile.png`

## 构建结果

```bash
../node-v22.16.0-win-x64/node-v22.16.0-win-x64/node.exe node_modules/next/dist/bin/next build
```

结果：

- ✓ Compiled successfully
- ✓ Generating static pages 900/900
- 无 TypeScript 错误

## 运行方式

```bash
npm install
npm run build
npm run start -- -p 3001
```

（本地环境需使用 Node.js v22.16.0）

## 打包说明

本次打包已排除：

- `node_modules`
- `.next`
- `scripts/venv`
- 旧 zip 文件：`datang-stars-v0.1-visual-acceptance.zip`、`tangju_visual_samples_v0_1.zip`
- `*.log`
