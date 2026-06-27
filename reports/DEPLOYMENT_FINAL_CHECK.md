# 唐局 v0.8-rc 部署前最终检查报告

检查时间：2026-06-27
当前版本：v0.8-rc（package.json: 0.7.1）

## 1. npm run build

✅ **构建成功**

```text
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages using 14 workers (902/902) in 6.8s
```

生成页面包括：

- `/` 首页
- `/about` 关于/免责声明
- `/characters` 群英录
- `/characters/[id]` 890 个人物详情页
- `/timeline` 风云轴
- `/chronicle` 全书年表
- `/graph` 权力图谱
- `/galaxy` 星河
- `/ranking` 人物榜
- `/sitemap.xml` 站点地图
- `/_not-found` 404 页面

## 2. public/images 体积

✅ **约 12 MB**

```text
12M	public/images
```

仅保留 WebP 格式图片：

- 22 个 avatar
- 22 个 card
- 22 个 clean
- 11 个默认分类头像

原始 PNG 已归档至 `_archive/original-images/`（约 155 MB），不在生产部署中。

## 3. _archive 排除检查

✅ **GitHub 排除**：`.gitignore` 已包含 `_archive/`、`screenshots/`、`*.zip`、`*.log`

✅ **Vercel 排除**：`.vercelignore` 已包含 `_archive/`、`screenshots/`、`*.zip`、`*.log`，并显式排除 `_archive/original-images/`

## 4. git status --ignored -s

⚠️ **当前项目目录未初始化 Git 仓库**（无 `.git` 目录），因此无法运行 `git status`。

**建议操作**：

```bash
cd datang-stars
git init
git add .
git commit -m "v0.8-rc ready"
```

初始化后再次运行：

```bash
git status --ignored -s
```

确认以下目录显示为 `!!`（已忽略）：

- `node_modules/`
- `.next/`
- `out/`
- `scripts/venv/`
- `.node/`
- `screenshots/`
- `_archive/`
- `*.zip`
- `*.log`
- `.env*`

## 5. 超大文件检查

✅ **无超过 20MB 的单个文件会被提交**

> 注：因未初始化 Git，无法检查已跟踪文件。工作树中超过 20MB 的文件均为历史交付 zip，已在 `.gitignore` 中排除，不会进入 GitHub。

工作树中超过 20MB 的文件示例（均已忽略）：

| 文件 | 大小 |
|------|------|
| `datang-stars-source-review-v0.7.zip` | ~197 MB |
| `.next.zip` | ~185 MB |
| `datang-stars-v0.4-final-stable-baseline.zip` | ~170 MB |
| `datang-stars-v0.7.2-data-audit-stable.zip` | ~162 MB |

## 6. 关键文件状态

| 文件 | 状态 |
|------|------|
| `package.json` | 版本 0.7.1，scripts 包含 dev/build/start/lint，依赖完整 |
| `package-lock.json` | 版本 0.7.1，与 package.json 一致 |
| `README.md` | 已更新为当前项目状态 |
| `DEPLOYMENT_PREVIEW.md` | 已生成 |
| `.gitignore` | 已更新，覆盖必要忽略项 |
| `.vercelignore` | 已新增，覆盖 Vercel 部署忽略项 |
| `next.config.ts` | 无本地 IP，无开发残留 |

## 7. /about、/robots.txt、/sitemap.xml 检查

✅ **全部正常**

- `/about`：返回「关于唐局」「免责声明」页面
- `/robots.txt`：允许所有爬虫，指向 sitemap
- `/sitemap.xml`：返回 XML 站点地图，包含首页、各频道页与 890 个人物详情页

## 8. /graph、/galaxy 开发残留检查

✅ **无本地 IP 或开发残留**

- `next.config.ts` 中 `allowedDevOrigins` 已注释，仅保留说明文字
- `/app` 源码中未检索到 `192.168`、`localhost:3000`、`0.0.0.0` 等开发地址
- `/graph` 页面正常返回「权力图谱/人物星图」
- `/galaxy` 页面正常返回「星河」

## 9. .env / .env.local 检查

✅ **当前工作树中不存在 `.env` 或 `.env.local` 文件**

✅ `.gitignore` 已排除 `.env*`，即使后续创建也不会提交

## 10. GitHub + Vercel 部署建议

### 推送到 GitHub

```bash
cd datang-stars
git init
git add .
git commit -m "v0.8-rc ready for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/datang-stars.git
git push -u origin main
```

### Vercel 部署

1. 登录 Vercel，选择 GitHub 仓库导入。
2. Framework Preset 选择 **Next.js**。
3. Build Command：`npm run build`
4. Output Directory：默认（无需修改）
5. Install Command：`npm install`
6. 点击 Deploy。

### 部署后验证

- [ ] 公网首页可访问
- [ ] 群英录 `/characters` 头像加载正常
- [ ] 人物详情页图片为 WebP
- [ ] `/graph` 权力图谱三种模式正常
- [ ] `/galaxy` 无黑屏
- [ ] 手机端 `/graph` 节点点击底部抽屉正常
- [ ] `/about` 免责声明可访问

## 结论

项目已通过部署前最终检查，具备推送到 GitHub 并部署到 Vercel 公网预览的条件。唯一前置动作是初始化 Git 仓库并提交。
