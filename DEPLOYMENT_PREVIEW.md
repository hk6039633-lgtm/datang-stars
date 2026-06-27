# 唐局 v0.8-rc 上线预演说明

当前版本：**v0.8-rc**

## 本地构建与启动

### 1. 本地构建

```bash
cd datang-stars
npm install
npm run build
```

预期结果：`900/900` 静态页面生成，TypeScript 检查通过。

### 2. 本地启动

```bash
npm run start
```

访问 **http://localhost:3000**。

### 3. 手机局域网测试

```bash
npm run dev -- -H 0.0.0.0
```

真机浏览器访问 `http://<你的电脑局域网IP>:3000`。如需 HMR 跨域，可临时在 `next.config.ts` 中配置 `allowedDevOrigins`，完成后务必移除或注释。

## GitHub 推送建议

1. 确保 `.gitignore` 已排除：`node_modules`、`.next`、`_archive/`、`screenshots/`、`*.zip`、`*.log`、`.env*` 等。
2. 不要提交 `_archive/original-images/` 到 GitHub。
3. 推送前运行 `npm run build` 确认无错误。
4. 建议分支：`main` 或 `production`。

## Vercel 部署步骤

1. 登录 Vercel，点击 "Add New Project"。
2. 导入 GitHub 仓库 `datang-stars`。
3. Framework Preset 选择 **Next.js**。
4. Build Command 保持默认：`npm run build`。
5. Output Directory 保持默认：无需修改。
6. Install Command 保持默认：`npm install`。
7. 无需额外 Environment Variables（除非需要自定义域名）。
8. 点击 Deploy。

> `sharp` 已作为 `devDependency` 安装。Vercel 构建时会安装 devDependencies，因此 WebP 生成脚本可在本地运行；生产部署本身不依赖 sharp 运行。

## 部署前检查清单

- [ ] `npm run build` 成功
- [ ] 静态页面生成 `900/900`
- [ ] `next.config.ts` 无硬编码本地 IP
- [ ] `public/images` 体积约 12MB（仅 WebP）
- [ ] `_archive/original-images/` 不进入 Git/Vercel
- [ ] `.gitignore` 与 `.vercelignore` 已更新
- [ ] metadata、robots.txt、sitemap 已配置
- [ ] 未修改 `characters.json` / `events.json` / `book_timeline.json`

## 部署后验收清单

### 桌面端

- [ ] 首页正常加载
- [ ] 群英录 `/characters` 人物头像正常
- [ ] 李世民详情页 `/characters/lishimin` 图片正常
- [ ] 风云轴 `/timeline` 正常
- [ ] 全书年表 `/chronicle` 正常
- [ ] 人物榜 `/ranking` 正常
- [ ] 权力图谱 `/graph` 三种模式正常
- [ ] 星河 `/galaxy` 正常可见
- [ ] `/about` 关于/免责声明页面正常
- [ ] 404 页面样式正常

### 手机端 / 微信浏览器

- [ ] 首页可正常访问
- [ ] 群英录头像加载正常
- [ ] 人物详情页图片正常
- [ ] `/graph` 节点点击底部抽屉正常
- [ ] `/galaxy` 无黑屏，星系可见
- [ ] 导航与返回正常

## 已知问题与后续计划

### 当前已知问题

1. `/galaxy` 在部分真机上曾出现黑屏，已通过 `vh` 高度与 Canvas 样式调整优化，但仍需真机持续验证。
2. `/graph` 移动端节点点击依赖 ECharts zrender 兜底，部分浏览器可能需要进一步适配。
3. 人物分类质检报告中的部分疑似错误（如割据称帝者分类）仍需人工复核。

### 后续计划

1. v0.8 正式版：修复真机验证中发现的问题。
2. v0.9：继续补充人物视觉资产与默认头像优化。
3. v1.0：完善搜索、分类筛选与性能监控。
