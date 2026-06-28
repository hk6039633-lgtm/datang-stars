#!/usr/bin/env python3
"""Generate Open Graph share image for 唐局."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public" / "og-image.jpg"
WIDTH, HEIGHT = 1200, 630

# 唐风配色
BG_TOP = (139, 35, 50)       # 深宫红
BG_BOTTOM = (60, 20, 25)     # 暗红褐
GOLD = (212, 175, 85)        # 金色
GOLD_LIGHT = (245, 222, 160) # 浅金
TEXT_LIGHT = (255, 248, 240) # 米白

AVATARS = [
    "li-shimin_avatar_v01.webp",
    "wu-zetian_avatar_v01.webp",
    "li-bai_avatar_v01.webp",
    "du-fu_avatar_v01.webp",
    "yang-guifei_avatar_v01.webp",
    "an-lushan_avatar_v01.webp",
]


def make_gradient_background(width: int, height: int) -> Image.Image:
    """Create a top-to-bottom gradient background."""
    base = Image.new("RGB", (width, height), BG_TOP)
    draw = ImageDraw.Draw(base)
    for y in range(height):
        ratio = y / height
        r = int(BG_TOP[0] * (1 - ratio) + BG_BOTTOM[0] * ratio)
        g = int(BG_TOP[1] * (1 - ratio) + BG_BOTTOM[1] * ratio)
        b = int(BG_TOP[2] * (1 - ratio) + BG_BOTTOM[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return base


def add_decorative_elements(draw: ImageDraw.ImageDraw, width: int, height: int) -> None:
    """Draw subtle decorative borders and corner marks."""
    margin = 24
    line_color = GOLD_LIGHT

    # 外边框
    draw.rectangle(
        [(margin, margin), (width - margin, height - margin)],
        outline=line_color,
        width=2,
    )

    # 四角装饰线
    corner_len = 60
    for x0, y0, dx, dy in [
        (margin, margin, 1, 1),
        (width - margin, margin, -1, 1),
        (margin, height - margin, 1, -1),
        (width - margin, height - margin, -1, -1),
    ]:
        draw.line(
            [(x0, y0), (x0 + corner_len * dx, y0)],
            fill=line_color,
            width=3,
        )
        draw.line(
            [(x0, y0), (x0, y0 + corner_len * dy)],
            fill=line_color,
            width=3,
        )


def load_avatar(filename: str, size: int) -> Image.Image:
    """Load and circular-crop an avatar."""
    path = ROOT / "public" / "images" / "characters" / "avatar" / filename
    img = Image.open(path).convert("RGBA")
    img = img.resize((size, size), Image.Resampling.LANCZOS)

    # Create circular mask
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, size, size), fill=255)

    circular = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    circular.paste(img, (0, 0), mask)

    # Add golden border
    border = 4
    bordered = Image.new("RGBA", (size + border * 2, size + border * 2), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(bordered)
    border_draw.ellipse((0, 0, size + border * 2, size + border * 2), fill=GOLD)
    bordered.paste(circular, (border, border), circular)
    return bordered


def main() -> None:
    img = make_gradient_background(WIDTH, HEIGHT)
    draw = ImageDraw.Draw(img)

    add_decorative_elements(draw, WIDTH, HEIGHT)

    # 主标题：唐局
    title_font = ImageFont.truetype("/c/Windows/Fonts/NotoSerifSC-VF.ttf", 160)
    title = "唐局"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = bbox[2] - bbox[0]
    title_x = (WIDTH - title_w) // 2
    title_y = 130
    # 文字阴影
    draw.text((title_x + 4, title_y + 4), title, font=title_font, fill=(60, 20, 25))
    draw.text((title_x, title_y), title, font=title_font, fill=GOLD_LIGHT)

    # 英文/拼音副标
    sub_en_font = ImageFont.truetype("/c/Windows/Fonts/NotoSerifSC-VF.ttf", 28)
    sub_en = "TANG JU · 大唐人物风云可视化"
    bbox_en = draw.textbbox((0, 0), sub_en, font=sub_en_font)
    sub_en_x = (WIDTH - (bbox_en[2] - bbox_en[0])) // 2
    draw.text((sub_en_x, 320), sub_en, font=sub_en_font, fill=GOLD)

    # 副标题
    desc_font = ImageFont.truetype("/c/Windows/Fonts/NotoSerifSC-VF.ttf", 34)
    desc = "一张图看懂大唐三百年人物、权力与风云"
    bbox_desc = draw.textbbox((0, 0), desc, font=desc_font)
    desc_x = (WIDTH - (bbox_desc[2] - bbox_desc[0])) // 2
    draw.text((desc_x, 380), desc, font=desc_font, fill=TEXT_LIGHT)

    # 底部人物头像
    avatar_size = 110
    gap = 30
    avatars = [load_avatar(name, avatar_size) for name in AVATARS]
    total_w = len(avatars) * (avatar_size + 8) + (len(avatars) - 1) * gap
    start_x = (WIDTH - total_w) // 2
    avatar_y = 470
    for i, ava in enumerate(avatars):
        x = start_x + i * (avatar_size + 8 + gap)
        img.paste(ava, (x, avatar_y), ava)

    # 保存为 JPEG，质量 90
    img.convert("RGB").save(OUTPUT, "JPEG", quality=90, optimize=True)
    print(f"Generated: {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
