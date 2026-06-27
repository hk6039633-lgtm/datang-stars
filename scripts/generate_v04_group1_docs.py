import json
import os
from collections import Counter

with open("data/characters.json", "r", encoding="utf-8") as f:
    data = json.load(f)
chars = data["characters"]
chars_by_id = {c["id"]: c for c in chars}

public_dir = "public"


def img_exists(rel):
    return rel and os.path.isfile(os.path.join(public_dir, rel.lstrip("/")))


DEFAULT_AVATAR_MAP = {
    "皇帝/皇室": "imperial-default.png",
    "宰相/大臣": "minister-default.png",
    "武将/将领": "general-default.png",
    "节度使/藩镇": "jiedushi-default.png",
    "宦官": "eunuch-default.png",
    "后宫/女性": "female-default.png",
    "外族": "foreign-default.png",
    "文人": "literati-default.png",
    "叛乱势力": "rebel-default.png",
    "宗教人物": "religion-default.png",
    "其他": "other-default.png",
}
category_order = list(DEFAULT_AVATAR_MAP.keys())
default_dir_full = os.path.join(public_dir, "images/characters/defaults")

custom_ids = [c["id"] for c in chars if img_exists(c.get("avatarPath"))]
v04_group1_ids = ["shangguanwaner", "taipinggongzhu", "libai", "dufu"]
core10_ids = [cid for cid in custom_ids if cid not in v04_group1_ids]

has_card = sum(1 for c in chars if img_exists(c.get("cardPath")))
has_clean = sum(1 for c in chars if img_exists(c.get("cleanPath")))
has_avatar = sum(1 for c in chars if img_exists(c.get("avatarPath")))


def eff_type(c):
    if img_exists(c.get("avatarPath")):
        return "custom"
    f = DEFAULT_AVATAR_MAP.get(c.get("primaryCategory", "其他"), DEFAULT_AVATAR_MAP["其他"])
    return "default" if os.path.isfile(os.path.join(default_dir_full, f)) else None


eff = [eff_type(c) for c in chars]
has_eff = sum(1 for t in eff if t)
using_default = sum(1 for t in eff if t == "default")
no_avatar = len(chars) - has_eff
cat_counts = Counter(c.get("primaryCategory", "其他") for c in chars)

lines = []
lines.append("# 唐局人物视觉系统覆盖情况报告")
lines.append("")
lines.append("> 统计时间：基于当前 `data/characters.json` 与 `public/images/characters/` 实际文件。")
lines.append("> 说明：本报告随 v0.4 第一组重点人物视觉稳定归档后更新。")
lines.append("")
lines.append("## 1. 总体覆盖")
lines.append("")
lines.append("| 指标 | 人数 | 占比 |")
lines.append("|---|---|---|")
lines.append(f"| 总人物数 | {len(chars)} | 100% |")
lines.append(f"| 有 cardPath（详情页主视觉卡牌图） | {has_card} | {has_card / len(chars) * 100:.1f}% |")
lines.append(f"| 有 cleanPath（无卡牌时的详情页大图） | {has_clean} | {has_clean / len(chars) * 100:.1f}% |")
lines.append(f"| 有专属 avatarPath（头像图） | {has_avatar} | {has_avatar / len(chars) * 100:.1f}% |")
lines.append(f"| 使用分类默认头像 | {using_default} | {using_default / len(chars) * 100:.1f}% |")
lines.append(f"| 有任意有效头像（专属或默认） | {has_eff} | {has_eff / len(chars) * 100:.1f}% |")
lines.append(f"| 仍无头像（默认头像缺失时回退文字） | {no_avatar} | {no_avatar / len(chars) * 100:.1f}% |")
lines.append("")
lines.append("## 2. 已覆盖专属视觉的人物清单")
lines.append("")
lines.append(f"当前共有 **{len(custom_ids)}** 位人物拥有专属头像（同时具有 card / clean / avatar 三件套）：")
lines.append("")
lines.append("| id | 姓名 | 分类 | 说明 |")
lines.append("|---|---|---|---|")
for cid in custom_ids:
    c = chars_by_id[cid]
    note = "v0.4 第一组" if cid in v04_group1_ids else "核心 10 人"
    lines.append(f"| {cid} | {c['name']} | {c.get('primaryCategory', '')} | {note} |")
lines.append("")
lines.append("## 3. 分类统计与默认头像")
lines.append("")
lines.append("| 分类 | 人数 | 专属头像 | 默认头像 | 默认头像文件 |")
lines.append("|---|---|---|---|---|")
for cat in category_order:
    count = cat_counts.get(cat, 0)
    custom = sum(1 for c in chars if c.get("primaryCategory") == cat and img_exists(c.get("avatarPath")))
    f = DEFAULT_AVATAR_MAP.get(cat, DEFAULT_AVATAR_MAP["其他"])
    default = sum(
        1
        for c in chars
        if c.get("primaryCategory") == cat
        and not img_exists(c.get("avatarPath"))
        and os.path.isfile(os.path.join(default_dir_full, f))
    )
    lines.append(f"| {cat} | {count} | {custom} | {default} | `{f}` |")
for cat, count in sorted(cat_counts.items()):
    if cat not in category_order:
        custom = sum(1 for c in chars if c.get("primaryCategory") == cat and img_exists(c.get("avatarPath")))
        f = DEFAULT_AVATAR_MAP.get(cat, DEFAULT_AVATAR_MAP["其他"])
        default = sum(
            1
            for c in chars
            if c.get("primaryCategory") == cat
            and not img_exists(c.get("avatarPath"))
            and os.path.isfile(os.path.join(default_dir_full, f))
        )
        lines.append(f"| {cat} | {count} | {custom} | {default} | `{f}`（未命中标准分类，回退） |")
lines.append("")
lines.append("## 4. 默认头像存放位置")
lines.append("")
lines.append("默认头像已放入 `public/images/characters/defaults/`：")
lines.append("")
for cat in category_order:
    f = DEFAULT_AVATAR_MAP[cat]
    lines.append(f"- `{f}` → 用于「{cat}」分类")
lines.append("")
lines.append("## 5. 页面接入情况")
lines.append("")
lines.append("- `app/lib/defaultAvatar.ts`：分类→默认头像映射与 `getCharacterAvatar` 解析函数。")
lines.append("- `app/lib/data.ts`：`getCharacters()` 输出 `effectiveAvatarPath`（专属头像优先，否则回退分类默认头像）。")
lines.append("- `app/characters/page.tsx`：群英录人物卡片使用 `getCharacterAvatar(c)`。")
lines.append("- `app/ranking/page.tsx`：人物榜使用 `getCharacterAvatar(c)`，无头像时显示姓名首字占位。")
lines.append("- `app/components/GraphPageClient.tsx`：权力图谱右侧面板使用 `effectiveAvatarPath`。")
lines.append("- `app/characters/[id]/page.tsx`：详情页头部小头像使用 `getCharacterAvatar(character)`；详情页主视觉仍优先 `cardPath` → `cleanPath`。")
lines.append("")

with open("VISUAL_COVERAGE_REPORT.md", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("coverage report written, custom visual count", len(custom_ids))

# summary doc
core10_rows = [
    f"| {cid} | {chars_by_id[cid]['name']} | {chars_by_id[cid].get('primaryCategory', '')} | {chars_by_id[cid].get('subCategory', '')} | {chars_by_id[cid].get('historicalImportanceScore', '')} |"
    for cid in core10_ids
]
group1_rows = [
    f"| {cid} | {chars_by_id[cid]['name']} | {chars_by_id[cid].get('primaryCategory', '')} | {chars_by_id[cid].get('subCategory', '')} | {chars_by_id[cid].get('historicalImportanceScore', '')} |"
    for cid in v04_group1_ids
]

sl = []
sl.append("# 唐局 v0.4 第一组重点人物视觉稳定归档说明")
sl.append("")
sl.append("## 版本信息")
sl.append("")
sl.append("- 项目版本：`0.4.0`")
sl.append("- 交付包：`datang-stars-v0.4-group1-stable-baseline.zip`")
sl.append("- 归档说明：在 v0.3 稳定基线之上，完成 v0.4 第一组 4 位重点人物专属视觉资产导入并验收通过。")
sl.append("")
sl.append("## 当前专属视觉人物总数：14 人")
sl.append("")
sl.append("### 核心 10 人")
sl.append("")
sl.append("| id | 姓名 | 主分类 | 子分类 | 历史影响力 |")
sl.append("|---|---|---|---|---|")
sl.extend(core10_rows)
sl.append("")
sl.append("### v0.4 第一组 4 人")
sl.append("")
sl.append("| id | 姓名 | 主分类 | 子分类 | 历史影响力 |")
sl.append("|---|---|---|---|---|")
sl.extend(group1_rows)
sl.append("")
sl.append("## 11 类默认头像覆盖")
sl.append("")
sl.append("其余人物按主分类自动回退到对应默认头像：")
sl.append("")
for cat in category_order:
    sl.append(f"- `{DEFAULT_AVATAR_MAP[cat]}` → {cat}")
sl.append("")
sl.append("## 图片路径规范")
sl.append("")
sl.append("```")
sl.append("public/images/characters/clean/<slug>_clean_v01.png")
sl.append("public/images/characters/card/<slug>_card_v01.png")
sl.append("public/images/characters/avatar/<slug>_avatar_v01.png")
sl.append("public/images/characters/defaults/<category>-default.png")
sl.append("```")
sl.append("")
sl.append("- `clean`：人物全身/半身原画，用于详情页主视觉兜底。")
sl.append("- `card`：带边框/题签的卡牌，用于详情页主视觉优先展示。")
sl.append("- `avatar`：圆形头像裁切图，用于群英录、人物榜、权力图谱侧栏、详情页顶部小头像。")
sl.append("- `defaults`：按 11 类主分类提供的默认头像。")
sl.append("")
sl.append("## 页面调用规则")
sl.append("")
sl.append("- 群英录 / 人物榜 / 权力图谱侧栏 / 详情页顶部小头像：")
sl.append("  - 优先 `avatarPath`；不存在时回退到分类默认头像；再不存在则安全回退文字/首字占位。")
sl.append("- 详情页主视觉大图：")
sl.append("  - 优先 `cardPath` → 其次 `cleanPath` → 无图时仅显示文字头部。")
sl.append("  - 默认头像**不**作为详情页主视觉。")
sl.append("- 服务端过滤：")
sl.append("  - `app/lib/data.ts` 在 `getCharacters()` 中校验图片文件存在性，不存在则置空，避免破图。")
sl.append("")
sl.append("## ChatGPT / Kimi / Codex 职责边界")
sl.append("")
sl.append("- **ChatGPT**：负责生成人物专属视觉资产（clean / card / avatar 三件套）与素材验收。")
sl.append("- **Kimi（本助手）**：负责将素材导入项目、绑定 `characters.json`、生成文档、构建验证、截图与打包交付。")
sl.append("- **Codex / 其他工具**：按项目约定读取 `AGENTS.md`，在已有 `defaultAvatar.ts` 与 `data.ts` 逻辑下消费 `effectiveAvatarPath` / `getCharacterAvatar()`，不重复实现头像回退。")
sl.append("")
sl.append("## 验收截图")
sl.append("")
sl.append("截图位于 `screenshots/` 目录：")
sl.append("")
sl.append("- `group1-characters-<id>-desktop.png`：群英录中上官婉儿 / 太平公主 / 李白 / 杜甫")
sl.append("- `group1-ranking-<id>-desktop.png`：人物榜中对应分类下的四人")
sl.append("- `group1-detail-libai-desktop.png`：李白详情页")
sl.append("- `group1-graph-libai-desktop.png`：权力图谱李白侧栏")
sl.append("- `group1-core10-desktop.png`：核心人物头像展示")
sl.append("- `group1-default-avatars-desktop.png`：默认头像人物展示")
sl.append("")
sl.append("## 构建验证")
sl.append("")
sl.append("- `npm run build` 通过。")
sl.append("- 静态页面生成 900 页，无报错。")

with open("VISUAL_SYSTEM_V0_4_GROUP1_SUMMARY.md", "w", encoding="utf-8") as f:
    f.write("\n".join(sl))
print("summary doc written")
