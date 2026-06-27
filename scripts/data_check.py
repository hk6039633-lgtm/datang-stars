"""数据检查脚本：输出人物总数、出场次数、分类统计及重点人物分类。"""

import json
import os
from collections import Counter

BASE_DIR = os.path.dirname(__file__)
CHARACTERS_PATH = os.path.join(BASE_DIR, "..", "data", "characters.json")


def main():
    with open(CHARACTERS_PATH, "r", encoding="utf-8") as f:
        characters = json.load(f)["characters"]

    total_mentions = sum(c["mentions"] for c in characters)
    category_counts = Counter(c["primaryCategory"] for c in characters)

    print("=== 唐局数据检查报告 ===")
    print(f"人物总数: {len(characters)}")
    print(f"总出场次数: {total_mentions}")
    print()
    print("各 primaryCategory 人数:")
    for cat, cnt in category_counts.most_common():
        print(f"  {cat}: {cnt}")
    print()

    check_names = [
        "李晟", "郭子仪", "浑瑊", "马燧",
        "安禄山", "史思明", "高骈", "高力士",
        "李白", "杜甫", "太平公主", "上官婉儿",
        "武崇训", "贺兰敏之", "朱全忠", "朱泚",
    ]
    name_map = {c["name"]: c for c in characters}
    print("重点人物分类检查:")
    for name in check_names:
        c = name_map.get(name)
        if c:
            print(f"  {name} ({c['id']}): {c['primaryCategory']}")
        else:
            print(f"  {name}: 未找到")

    print()
    print("后宫/女性分类人数:", category_counts.get("后宫/女性", 0))


if __name__ == "__main__":
    main()
