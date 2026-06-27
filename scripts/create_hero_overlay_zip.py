import os
import zipfile
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_ZIP = PROJECT_ROOT / "datang-stars-v0.2.2-character-hero-overlay.zip"

EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    "__pycache__",
    ".venv",
    "venv",
}

EXCLUDE_PATH_PREFIXES = {
    ".next/dev",
    ".next/cache",
}

EXCLUDE_FILES = {
    ".next.zip",
    "datang-stars-v0.1-visual-acceptance.zip",
    "datang-stars-v0.2-data-ranking-restructure.zip",
    "datang-stars-v0.2.1-data-fix.zip",
    "datang-stars-v0.2-visual-expansion-prep.zip",
    "tangju_visual_samples_v0_1.zip",
    OUTPUT_ZIP.name,
}

EXCLUDE_SUFFIXES = (
    ".tsbuildinfo",
)


def should_include(rel_path: Path) -> bool:
    parts = rel_path.parts
    if any(part in EXCLUDE_DIRS for part in parts):
        return False
    rel_str = rel_path.as_posix()
    if any(rel_str.startswith(prefix + "/") or rel_str == prefix for prefix in EXCLUDE_PATH_PREFIXES):
        return False
    if rel_path.name in EXCLUDE_FILES:
        return False
    if any(rel_path.name.endswith(suffix) for suffix in EXCLUDE_SUFFIXES):
        return False
    return True


def main():
    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()

    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            root_path = Path(root)
            for file in files:
                file_path = root_path / file
                rel_path = file_path.relative_to(PROJECT_ROOT)
                if should_include(rel_path):
                    zf.write(file_path, arcname=str(rel_path).replace(os.sep, "/"))

    size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print(f"已生成: {OUTPUT_ZIP}")
    print(f"大小: {size_mb:.2f} MB")


if __name__ == "__main__":
    main()
