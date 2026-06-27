# 杜甫 v0.4 交付包体积审查说明

## 1. 原包体积分析

- 包名：`datang-stars-v0.4-dufu-import.zip`
- 大小：**687 MB**（压缩后） / **705 MB**（解压后）
- 文件数：236

## 2. 体积来源拆解

| 内容类别 | 解压后大小 | 占比 | 说明 |
|---|---|---|---|
| `.next.zip` | 176 MB | 25% | 旧的完整构建产物打包，非必需 |
| `public/images/characters/`（全部人物） | ~107 MB | 15% | 包含所有已导入人物图片，本轮只应含杜甫 |
| 旧交付 zip | ~222 MB | 31% | v0.2、v0.3 系列历史 zip |
| 临时素材 zip（`tangju_*`） | ~114 MB | 16% | ChatGPT 下发的原始素材包 |
| `screenshots/`（全部历史截图） | ~55 MB | 8% | 仅杜甫 4 张截图为必需 |
| 源码/配置/数据 | ~1.5 MB | <1% | 实际必需内容 |

## 3. 已删除/排除的多余内容

重新打包 `datang-stars-v0.4-dufu-import-CLEAN.zip` 时已排除：

- `.next/` 与 `.next.zip`
- `node_modules/`
- `.git/`（如存在）
- `scripts/venv/`
- `__pycache__/`
- 所有旧 `.zip` 交付包（`datang-stars-v0.2*`、`datang-stars-v0.3*` 等）
- 所有临时素材 zip（`tangju_*.zip`）
- 除杜甫三件套外的所有 `public/images/characters/` 图片
- 除杜甫 4 张验收截图外的所有历史截图
- 日志文件（`server.log`）
- 缓存文件（`tsconfig.tsbuildinfo`）
- 非必需数据文件（`imperial_characters_fix.json` 等）

## 4. 清理后体积

- 新包名：`datang-stars-v0.4-dufu-import-CLEAN.zip`
- 大小：**6.87 MB**（压缩后） / **7.95 MB**（解压后）
- 文件数：**68**

## 5. 打包策略

仅保留：

- 当前源码必要文件（`app/`、`scripts/` 不含 `venv`）
- 项目必要配置（`package.json`、`package-lock.json`、`next.config.ts`、`tsconfig.json` 等）
- `data/characters.json`
- 杜甫三件套图片
- 杜甫 4 张验收截图
- `DUFU_IMPORT_DELIVERY.md`
- `VISUAL_COVERAGE_REPORT.md`
- 本审查说明 `DUFU_PACKAGE_AUDIT.md`
