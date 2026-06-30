#!/usr/bin/env python3
"""Generate WeChat-optimized square share image (300x300)."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public" / "wechat-share.jpg"
WIDTH, HEIGHT = 300, 300

# 唐风配色
BG_TOP = (139, 35, 50)
BG_BOTTOM = (60, 20, 25)
GOLD_LIGHT = (245, 222, 160)
GOLD = (212, 175, 85)

def make_gradient_background(width: int, height: int) -> Image.Image:
    base = Image.new("RGB", (width, height), BG_TOP)
    draw = ImageDraw.Draw(base)
    for y in range(height):
        ratio = y / height
        r = int(BG_TOP[0] * (1 - ratio) + BG_BOTTOM[0] * ratio)
        g = int(BG_TOP[1] * (1 - ratio) + BG_BOTTOM[1] * ratio)
        b = int(BG_TOP[2] * (1 - ratio) + BG_BOTTOM[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return base

def main() -> None:
    img = make_gradient_background(WIDTH, HEIGHT)
    draw = ImageDraw.Draw(img)

    # 边框
    margin = 8
    draw.rectangle(
        [(margin, margin), (WIDTH - margin, HEIGHT - margin)],
        outline=GOLD,
        width=2,
    )

    # 主标题
    title_font = ImageFont.truetype("/c/Windows/Fonts/NotoSerifSC-VF.ttf", 72)
    title = "唐局"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_x = (WIDTH - (bbox[2] - bbox[0])) // 2
    title_y = 70
    draw.text((title_x + 2, title_y + 2), title, font=title_font, fill=(60, 20, 25))
    draw.text((title_x, title_y), title, font=title_font, fill=GOLD_LIGHT)

    # 副标题
    sub_font = ImageFont.truetype("/c/Windows/Fonts/NotoSerifSC-VF.ttf", 20)
    sub = "大唐三百年"
    bbox = draw.textbbox((0, 0), sub, font=sub_font)
    sub_x = (WIDTH - (bbox[2] - bbox[0])) // 2
    draw.text((sub_x, 165), sub, font=sub_font, fill=GOLD)

    desc_font = ImageFont.truetype("/c/Windows/Fonts/NotoSerifSC-VF.ttf", 16)
    desc = "人物 · 权力 · 风云"
    bbox = draw.textbbox((0, 0), desc, font=desc_font)
    desc_x = (WIDTH - (bbox[2] - bbox[0])) // 2
    draw.text((desc_x, 200), desc, font=desc_font, fill=(255, 248, 240))

    img.save(OUTPUT, "JPEG", quality=92, optimize=True)
    print(f"Generated: {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size / 1024:.1f} KB")

if __name__ == "__main__":
    main()
