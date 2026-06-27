#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片资源体积报告脚本

统计 public/images 下各类图片体积，输出 Markdown 报告到 reports/image_size_report.md。
"""

import os
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = PROJECT_ROOT / "public" / "images"
REPORTS_DIR = PROJECT_ROOT / "reports"
OUTPUT_MD = REPORTS_DIR / "image_size_report.md"


def human_readable(size_bytes: int) -> str:
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.2f} TB"


def collect_files(root: Path):
    files = []
    for dirpath, _, filenames in os.walk(root):
        for name in filenames:
            file_path = Path(dirpath) / name
            rel = file_path.relative_to(root)
            files.append({
                "path": file_path,
                "rel": rel,
                "size": file_path.stat().st_size,
            })
    return files


def dir_total(files, prefix: str) -> int:
    return sum(f["size"] for f in files if f["rel"].as_posix().startswith(prefix))


def main():
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    files = collect_files(IMAGES_DIR)
    total = sum(f["size"] for f in files)
    top30 = sorted(files, key=lambda x: -x["size"])[:30]

    avatar_total = dir_total(files, "characters/avatar/")
    card_total = dir_total(files, "characters/card/")
    clean_total = dir_total(files, "characters/clean/")
    default_total = dir_total(files, "characters/defaults/")

    webp_files = [f for f in files if f["path"].suffix.lower() == ".webp"]
    webp_total = sum(f["size"] for f in webp_files)
    png_files = [f for f in files if f["path"].suffix.lower() == ".png"]
    png_total = sum(f["size"] for f in png_files)

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "# 图片资源体积报告",
        "",
        f"生成时间：{now}",
        f"统计目录：`public/images`",
        "",
        "## 总体积",
        "",
        f"- **public/images 总体积**：{human_readable(total)}（{total:,} 字节）",
        f"- **文件总数**：{len(files)} 个",
        "",
        "## 分类体积",
        "",
        "| 分类 | 文件数 | 体积 |",
        "|------|--------|------|",
        f"| avatars | {sum(1 for f in files if f['rel'].as_posix().startswith('characters/avatar/'))} | {human_readable(avatar_total)} |",
        f"| cards | {sum(1 for f in files if f['rel'].as_posix().startswith('characters/card/'))} | {human_readable(card_total)} |",
        f"| clean | {sum(1 for f in files if f['rel'].as_posix().startswith('characters/clean/'))} | {human_readable(clean_total)} |",
        f"| default avatars | {sum(1 for f in files if f['rel'].as_posix().startswith('characters/defaults/'))} | {human_readable(default_total)} |",
        "",
        "## 最大的 30 个图片文件",
        "",
        "| 排名 | 相对路径 | 体积 |",
        "|------|----------|------|",
    ]
    for idx, f in enumerate(top30, 1):
        lines.append(f"| {idx} | `{f['rel'].as_posix()}` | {human_readable(f['size'])} |")
    lines.append("")

    lines.append("## WebP 优化效果")
    lines.append("")
    lines.append(f"- **PNG 原图总体积**：{human_readable(png_total)}（{len(png_files)} 个文件）")
    lines.append(f"- **新增 WebP 总体积**：{human_readable(webp_total)}（{len(webp_files)} 个文件）")
    if png_total > 0:
        lines.append(f"- **WebP 相对 PNG 压缩率**：{((1 - webp_total / png_total) * 100):.1f}%")
    lines.append("")

    lines.append("## 压缩策略建议")
    lines.append("")
    lines.append("1. **专属人物图**：将 PNG 转换为 WebP，avatar 缩放到 320px–512px（quality 82），card/clean 缩放到 900px–1200px（quality 85）。")
    lines.append("2. **默认头像**：将 PNG 默认头像转换为 WebP，保持分类映射不变。")
    lines.append("3. **加载策略**：页面优先使用 `.webp` 路径，不存在时回退到原 PNG/JPG。")
    lines.append("4. **懒加载**：列表页头像使用 `loading=\"lazy\"` 与 `decoding=\"async\"`，避免首屏一次性加载过多图片。")
    lines.append("5. **响应式**：移动端优先返回较小尺寸 avatar，详情页再加载较大 clean/card 图。")
    lines.append("")

    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"已生成报告: {OUTPUT_MD}")
    print(f"public/images 总体积: {human_readable(total)}")


if __name__ == "__main__":
    main()
