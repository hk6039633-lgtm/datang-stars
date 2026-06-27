#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
人物分类质检脚本

扫描 data/characters.json 中疑似分类错误的人物，输出 Markdown 报告到
reports/character_category_audit.md。

规则：
1. 宗教人物，但 role 含军政职务（节度使/将军/都将/押牙/国公/刺史/观察使等）
2. 叛乱势力，但 role 含皇室身份（皇帝/帝/太子/亲王/公主/皇后等）
3. 皇帝/皇室，但 role 含反叛/割据/可汗/首领等（需人工复核）
4. 后宫/女性，但 name/role 明显为男性
"""

import json
from pathlib import Path
from datetime import datetime
from collections import Counter

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
REPORTS_DIR = PROJECT_ROOT / "reports"
OUTPUT_MD = REPORTS_DIR / "character_category_audit.md"

CHARACTERS_JSON = DATA_DIR / "characters.json"
OVERRIDES_JSON = DATA_DIR / "character_overrides.json"

# 规则 1：宗教人物但 role 含军政职务
RULE1_KEYWORDS = ["节度使", "将军", "都将", "押牙", "国公", "刺史", "观察使", "都督", "行军司马", "元帅", "将领", "武将"]

# 规则 2：叛乱势力但 role 含皇室身份
RULE2_KEYWORDS = ["皇帝", "帝", "太子", "亲王", "公主", "皇后", "太后", "太妃"]

# 规则 3：皇帝/皇室但 role 含反叛/割据/可汗/首领等（需复核，不一定错）
RULE3_KEYWORDS = ["叛", "起义", "割据", "可汗", "首领", "造反", "反唐", "自立"]

# 规则 4：后宫/女性但明显为男性
RULE4_MALE_KEYWORDS = ["皇帝", "太子", "亲王", "将军", "节度使", "大臣", "宰相", "国公", "郡王", "都督", "刺史"]
RULE4_FEMALE_KEYWORDS = ["妃", "后", "公主", "夫人", "女", "太后", "太妃", "宫人", "侍女", "嫔", "嫱"]


def load_characters():
    with open(CHARACTERS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    chars = data.get("characters", data) if isinstance(data, dict) else data
    return chars


def load_overrides():
    if not OVERRIDES_JSON.exists():
        return {}
    with open(OVERRIDES_JSON, "r", encoding="utf-8") as f:
        return json.load(f)


def contains_any(text: str, keywords: list[str]) -> bool:
    if not text:
        return False
    return any(kw in text for kw in keywords)


def audit(characters: list[dict], overrides: dict) -> dict:
    rule1 = []
    rule2 = []
    rule3 = []
    rule4 = []
    category_counter = Counter()

    for c in characters:
        name = c.get("name", "")
        cid = c.get("id", "")
        role = c.get("role", "")
        cat = c.get("primaryCategory", "")
        category_counter[cat] += 1

        # 规则 1
        if cat == "宗教人物" and contains_any(role, RULE1_KEYWORDS):
            rule1.append({
                "name": name,
                "id": cid,
                "primaryCategory": cat,
                "role": role,
                "suggested": "节度使/藩镇 / 武将/将领 / 宰相/大臣（按 role 判断）",
                "overridden": name in overrides,
            })

        # 规则 2
        if cat == "叛乱势力" and contains_any(role, RULE2_KEYWORDS):
            rule2.append({
                "name": name,
                "id": cid,
                "primaryCategory": cat,
                "role": role,
                "suggested": "需人工复核：一般仍保留为叛乱/割据势力，不建议自动改为皇帝/皇室",
                "overridden": name in overrides,
            })

        # 规则 3
        if cat == "皇帝/皇室" and contains_any(role, RULE3_KEYWORDS):
            rule3.append({
                "name": name,
                "id": cid,
                "primaryCategory": cat,
                "role": role,
                "suggested": "需人工复核：是否为反叛/割据/外族政权首领",
                "overridden": name in overrides,
            })

        # 规则 4
        if cat == "后宫/女性":
            looks_male = (
                contains_any(role, RULE4_MALE_KEYWORDS)
                and not contains_any(role, RULE4_FEMALE_KEYWORDS)
            ) or (
                contains_any(name, ["公", "王", "帝"])
                and not contains_any(name, ["妃", "后", "公主", "夫人", "女"])
            )
            if looks_male:
                rule4.append({
                    "name": name,
                    "id": cid,
                    "primaryCategory": cat,
                    "role": role,
                    "suggested": "按实际性别/身份重新分类",
                    "overridden": name in overrides,
                })

    return {
        "rule1": rule1,
        "rule2": rule2,
        "rule3": rule3,
        "rule4": rule4,
        "category_counter": category_counter,
    }


def render_table(rows: list[dict]) -> str:
    if not rows:
        return "暂无。\n"
    lines = [
        "| 姓名 | ID | 当前分类 | 角色 | 建议 | 已覆盖 |",
        "|------|----|----------|------|------|--------|",
    ]
    for r in rows:
        overridden = "✅" if r["overridden"] else ""
        lines.append(
            f"| {r['name']} | {r['id']} | {r['primaryCategory']} | {r['role']} | {r['suggested']} | {overridden} |"
        )
    return "\n".join(lines) + "\n"


def render_overrides(overrides: dict) -> str:
    if not overrides:
        return "暂无。\n"
    lines = [
        "| 姓名 | 覆盖字段 | 备注 |",
        "|------|----------|------|",
    ]
    for name, fields in overrides.items():
        note = fields.get("note", "")
        changed = ", ".join(
            k for k in fields.keys() if k != "note"
        )
        lines.append(f"| {name} | {changed} | {note} |")
    return "\n".join(lines) + "\n"


def generate_report(results: dict, overrides: dict) -> str:
    total = sum(results["category_counter"].values())
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "# 人物分类质检报告",
        "",
        f"生成时间：{now}",
        f"数据来源：`data/characters.json`（共 {total} 位人物）",
        "",
        "## 规则说明",
        "",
        "| 规则 | 触发条件 | 处理建议 |",
        "|------|----------|----------|",
        "| 规则 1 | `primaryCategory` 为“宗教人物”，但 `role` 出现军政职务 | 疑似错误，需改为对应军政分类 |",
        "| 规则 2 | `primaryCategory` 为“叛乱势力”，但 `role` 出现称帝、皇帝、国号等字样 | 需人工复核，不代表一定错误 |",
        "| 规则 3 | `primaryCategory` 为“皇帝/皇室”，但 `role` 出现反叛/割据/可汗/首领等 | 需人工复核，不一定错误 |",
        "| 规则 4 | `primaryCategory` 为“后宫/女性”，但 `name/role` 明显为男性 | 疑似错误，需按实际性别/身份重分 |",
        "",
        "## 统计概览",
        "",
        "| 分类 | 人数 |",
        "|------|------|",
    ]
    for cat, count in sorted(results["category_counter"].items(), key=lambda x: -x[1]):
        lines.append(f"| {cat} | {count} |")
    lines.append("")
    lines.append(f"- 规则 1 疑似错误：{len(results['rule1'])} 条")
    lines.append(f"- 规则 2 疑似错误：{len(results['rule2'])} 条")
    lines.append(f"- 规则 3 需人工复核：{len(results['rule3'])} 条")
    lines.append(f"- 规则 4 疑似错误：{len(results['rule4'])} 条")
    lines.append("")

    lines.append("## 唐局分类定义")
    lines.append("")
    lines.append("| 分类 | 定义 |")
    lines.append("|------|------|")
    lines.append("| 皇帝/皇室 | 正统王朝皇帝、宗室、皇后、公主、太子等 |")
    lines.append("| 叛乱势力 | 起义军、反唐势力、叛军政权、割据称帝者 |")
    lines.append("| 节度使/藩镇 | 地方军政集团、藩镇首领 |")
    lines.append("| 武将/将领 | 军事将领，但不以割据势力为主要身份 |")
    lines.append("| 宦官/内廷 | 宦官集团、宫廷权力人物 |")
    lines.append("| 文人/文学 | 诗人、文学家、文化人物 |")
    lines.append("| 宗教人物 | 高僧、道士、宗教相关人物 |")
    lines.append("")

    lines.append("## 规则 1：宗教人物但 role 含军政职务")
    lines.append("")
    lines.extend(render_table(results["rule1"]).split("\n"))
    lines.append("")

    lines.append("## 规则 2：叛乱/割据势力中含称帝、皇帝、国号等字样，需人工复核，不代表一定错误")
    lines.append("")
    lines.extend(render_table(results["rule2"]).split("\n"))
    lines.append("")
    lines.append("> **说明**：下列人物虽有称帝或建号行为，但在唐局分类体系中一般仍应保留为“叛乱势力”或“割据势力”，不应自动改入“皇帝/皇室”。例如：史思明（大燕皇帝）、黄巢（大齐皇帝）、朱泚（汉帝）、宇文化及（许帝）、刘守光（燕帝）等，均属于反唐或割据政权首领，而非正统唐朝皇室。")
    lines.append("")

    lines.append("## 规则 3：皇帝/皇室但 role 含反叛/割据/可汗/首领")
    lines.append("")
    lines.extend(render_table(results["rule3"]).split("\n"))
    lines.append("")

    lines.append("## 规则 4：后宫/女性但 name/role 明显为男性")
    lines.append("")
    lines.extend(render_table(results["rule4"]).split("\n"))
    lines.append("")

    lines.append("## 已应用人工覆盖（data/character_overrides.json）")
    lines.append("")
    lines.extend(render_overrides(overrides).split("\n"))
    lines.append("")

    lines.append("## 说明")
    lines.append("")
    lines.append("- 本报告基于 `data/characters.json` 原始数据生成，不反映 `data/character_overrides.json` 覆盖后的结果。")
    lines.append("- “已覆盖”列表示该人物是否已在 `character_overrides.json` 中配置覆盖；如已覆盖，运行时会以覆盖值为准。")
    lines.append("- 规则 3 的“皇帝/皇室但含反叛/割据/可汗/首领”为复核项，部分外族政权首领或隋末自立者可能确实应保留皇帝/皇室分类，需人工判断。")
    lines.append("")

    return "\n".join(lines)


def main():
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    characters = load_characters()
    overrides = load_overrides()
    results = audit(characters, overrides)
    report = generate_report(results, overrides)

    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"已生成报告: {OUTPUT_MD}")
    print(f"规则 1 疑似错误: {len(results['rule1'])} 条")
    print(f"规则 2 疑似错误: {len(results['rule2'])} 条")
    print(f"规则 3 需人工复核: {len(results['rule3'])} 条")
    print(f"规则 4 疑似错误: {len(results['rule4'])} 条")


if __name__ == "__main__":
    main()
