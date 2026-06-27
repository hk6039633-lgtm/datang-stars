# 生产部署资源瘦身报告

生成时间：2026-06-27

## 操作说明

为减少生产部署包体积，已将 `public/images` 下已有 WebP 替代版本的原始 PNG/JPG 图片移动到 `_archive/original-images/` 备份，生产环境仅保留 WebP 文件。

## 体积对比

| 目录 | 文件数 | 体积 |
|------|--------|------|
| 移动前 `public/images` | 154 | ~166 MB |
| 移动后 `public/images` | 77 | ~12 MB |
| `_archive/original-images` | 77 | ~155 MB |

- **public/images 体积下降**：约 **154 MB**（降幅约 **92.8%**）
- **WebP 文件数量**：77 个
- **原始文件数量**：77 个（已归档）

## 文件分布

移动后 `public/images` 仅保留：

- `public/images/characters/avatar/*.webp` — 22 个人物头像
- `public/images/characters/card/*.webp` — 22 个人物卡片
- `public/images/characters/clean/*.webp` — 22 个人物 clean 图
- `public/images/characters/defaults/*.webp` — 11 个分类默认头像

## 页面加载验证

- ✅ 群英录人物头像正常加载 WebP
- ✅ 李世民详情页（`/characters/lishimin`）card/avatar 正常加载 WebP
- ✅ 无专属图人物默认头像正常加载 WebP
- ✅ `/graph` 抽屉人物卡片正常加载 WebP
- ✅ `/galaxy` 正常
- ✅ 首页正常

## 重新生成 WebP

如需重新生成或调整 WebP，请运行：

```bash
node scripts/optimize_images.mjs
```

该脚本会基于当前 `public/images` 下的 PNG/JPG 生成对应 WebP，并按分类自动缩放：

- avatar / defaults：512px 宽，quality 82
- card / clean：1200px 宽，quality 85

> 注意：重新生成前请确保原始 PNG/JPG 已放回 `public/images`，或从 `_archive/original-images/` 复制回来。

## 回退说明

如果生产环境需要恢复原始 PNG/JPG，可将 `_archive/original-images/` 中的文件按原目录结构复制回 `public/images/`。页面加载逻辑仍会自动优先使用 WebP，只有 WebP 缺失时才会回退到 PNG/JPG。
