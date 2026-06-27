import os
import zipfile
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_ZIP = PROJECT_ROOT / "datang-stars-source-review.zip"

# 排除的大目录 / 环境目录 / 构建产物
EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    "__pycache__",
    ".venv",
    "venv",
    ".next",
    "out",
    "dist",
    ".node",
    "scripts/venv",
    "screenshots",
    "_archive",
}

# 排除的文件名（根目录历史交付包、日志、缓存等）
EXCLUDE_FILES = {
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    OUTPUT_ZIP.name,
}

# 排除的后缀
EXCLUDE_SUFFIXES = (
    ".tsbuildinfo",
    ".zip",
    ".log",
)

# 排除的目录前缀（支持嵌套路径）
EXCLUDE_PATH_PREFIXES = {
    "scripts/venv",
}


def should_include(rel_path: Path) -> bool:
    parts = rel_path.parts

    # 按目录名排除
    if any(part in EXCLUDE_DIRS for part in parts):
        return False

    rel_str = rel_path.as_posix()

    # 按路径前缀排除
    if any(
        rel_str.startswith(prefix + "/") or rel_str == prefix
        for prefix in EXCLUDE_PATH_PREFIXES
    ):
        return False

    name = rel_path.name

    # 按文件名排除
    if name in EXCLUDE_FILES:
        return False

    # 按后缀排除
    if any(name.endswith(suffix) for suffix in EXCLUDE_SUFFIXES):
        return False

    return True


def main():
    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()

    included = 0
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            root_path = Path(root)
            for file in files:
                file_path = root_path / file
                rel_path = file_path.relative_to(PROJECT_ROOT)
                if should_include(rel_path):
                    zf.write(file_path, arcname=rel_path.as_posix())
                    included += 1

    size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print(f"已生成源码审查包: {OUTPUT_ZIP}")
    print(f"包含文件数: {included}")
    print(f"大小: {size_mb:.2f} MB")


if __name__ == "__main__":
    main()
