# 唐局

用人物与事件读懂唐朝历史 —— 一个基于 Next.js + React + Tailwind CSS + ECharts + Canvas Galaxy 的唐朝人物互动网站。

## 数据规模

- **人物**：约 **890** 位唐朝人物（`data/characters.json`）
- **核心事件**：**18** 场（`data/events.json`）
- **全书年表**：**100** 条（`data/book_timeline.json`）

人物与事件数据来自《中国历代通俗演义（唐朝）》，经 `scripts/parse_characters.py`、`scripts/generate_events.py` 等脚本解析生成。

## 页面功能

- **首页**：项目入口与核心数据概览。
- **群英录** `/characters`：搜索、筛选、排序全部人物卡片。
- **人物详情** `/characters/[id]`：身份、简介、别名、相关事件、所属时期、影响力评分。
- **风云轴** `/timeline`：18 场核心历史事件复盘。
- **全书年表** `/chronicle`：100 条书中事件年表。
- **权力图谱** `/graph`：ECharts 关系图谱，支持三种模式：
  - **核心人物星图**：高频人物按类型聚类。
  - **事件局势图**：单场事件中的入局人物。
  - **人物邻域图**：以某个人物为中心展开相关事件与同局人物。
- **星河** `/galaxy`：Canvas 驱动的星系总览，将人物群像可视化为银河星团。
- **人物榜** `/ranking`：按历史影响力与出场次数排序的榜单。

### `/graph` 与 `/galaxy` 的区别

- `/graph` 是**关系图谱**，用 ECharts 渲染节点-连线，强调人物之间的历史关联与事件卷入关系；支持点击节点查看详情。
- `/galaxy` 是**星系总览**，用原生 Canvas 绘制可交互的星河视觉，强调人物群体的宏观分布与沉浸式探索。

## 技术栈

- **框架**：Next.js 16.2.9（App Router）
- **UI**：React 19 + Tailwind CSS v4
- **可视化**：ECharts 6、原生 Canvas Galaxy
- **语言**：TypeScript 5
- **脚本**：Python 3（用于数据解析与清洗）

## 本地开发

### 方式一：双击运行

```text
datang-stars/start_dev.bat
```

### 方式二：命令行

```bash
cd datang-stars
npm install
npm run dev
```

> 如果当前环境没有 Node.js，可使用已下载到 `../node-v22.16.0-win-x64/` 的本地 Node.js（`start_dev.bat` 已配置好 PATH）。

启动后访问 **http://localhost:3000**。

### 本地手机调试

若需要在同一局域网下的真机访问开发服务器，请使用 LAN IP 启动：

```bash
npm run dev -- -H 0.0.0.0
```

然后真机浏览器访问 `http://<你的电脑局域网IP>:3000`，例如 `http://192.168.6.203:3000`。

如需允许该局域网 IP 的 HMR 连接，可临时在 `next.config.ts` 中配置：

```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.6.203"],
};
```

> 建议使用环境变量 `LAN_DEV_ORIGIN` 传入，避免切换 Wi-Fi 后 IP 变化导致配置混乱。

## 重新生成数据

如果更新了源文件，可重新生成人物与事件数据：

```bash
cd datang-stars/scripts
venv/Scripts/python parse_characters.py
venv/Scripts/python generate_events.py
```

> 生成后的 `characters.json`、`events.json`、`book_timeline.json` 会被 Next.js 构建时直接读取。

## 项目结构

```
datang-stars/
├── app/                    # Next.js App Router 页面与组件
│   ├── characters/         # 群英录 / 人物详情
│   ├── chronicle/          # 全书年表
│   ├── components/         # 共享组件（EChartsGraph、GalaxyExplorer、GraphPageClient 等）
│   ├── graph/              # 权力图谱
│   ├── ranking/            # 人物榜
│   ├── timeline/           # 风云轴
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── data/                   # 运行时数据 JSON
│   ├── book_timeline.json
│   ├── characters.json
│   └── events.json
├── public/                 # 静态资源（人物头像、卡片图等）
├── scripts/                # Python 数据解析与辅助脚本
│   ├── parse_characters.py
│   ├── generate_events.py
│   └── create_source_review_zip.py  # 源码审查包打包脚本
├── next.config.ts
├── package.json
├── start_dev.bat
└── README.md
```

## 打包源码审查包

运行以下命令生成排除构建产物、依赖、日志后的源码审查压缩包：

```bash
python scripts/create_source_review_zip.py
```

输出文件：`datang-stars-source-review.zip`
