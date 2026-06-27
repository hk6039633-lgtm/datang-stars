import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "characters.json")

# 本轮视觉扩展的 6 位核心人物
# 注意：id 使用数据库中的现有 id，路径使用规范 slug
TARGETS = {
    "liyuan": {
        "slug": "li-yuan",
        "visualPriority": True,
        "historicalImportanceScore": 92,
        "impactStatement": "唐朝开国皇帝，建立李唐基业并奠定统一王朝的政治框架。",
    },
    "gaozong": {
        "slug": "li-zhi",
        "visualPriority": True,
        "historicalImportanceScore": 90,
        "impactStatement": "承接贞观之治与武周革命，永徽年间巩固了唐朝的疆域与制度。",
    },
    "lilongji": {
        "slug": "li-longji",
        "visualPriority": True,
        "historicalImportanceScore": 95,
        "impactStatement": "开创开元盛世并将唐朝推向极盛，其统治后期又成为盛唐衰落的转折点。",
    },
    "yangguifei": {
        "slug": "yang-guifei",
        "visualPriority": True,
        "historicalImportanceScore": 85,
        "impactStatement": "盛唐宫廷最具传奇色彩的女性，其命运与安史之乱紧密相连。",
    },
    "limi-2": {
        "slug": "li-bi",
        "visualPriority": True,
        "historicalImportanceScore": 75,
        "impactStatement": "中唐战略谋臣，历仕肃、代、德三朝，以道家智谋在藩镇割据中维系唐室。",
    },
    "zhuwen": {
        "slug": "zhu-wen",
        "visualPriority": True,
        "historicalImportanceScore": 90,
        "impactStatement": "终结唐朝统治、建立后梁的关键人物，标志着五代十国的开端。",
    },
}


def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    characters = data["characters"]
    updated_ids = []

    for c in characters:
        cid = c.get("id")
        if cid not in TARGETS:
            continue

        cfg = TARGETS[cid]
        slug = cfg["slug"]

        c["cleanPath"] = f"/images/characters/clean/{slug}_clean_v01.png"
        c["avatarPath"] = f"/images/characters/avatar/{slug}_avatar_v01.png"
        c["visualPriority"] = cfg["visualPriority"]
        c["historicalImportanceScore"] = cfg["historicalImportanceScore"]
        c["impactStatement"] = cfg["impactStatement"]
        updated_ids.append(cid)

    # 校验：是否所有目标都已更新
    missing = set(TARGETS.keys()) - set(updated_ids)
    if missing:
        raise RuntimeError(f"以下目标人物未在 characters.json 中找到: {missing}")

    # 写回，保持 2 空格缩进、ensure_ascii=False
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"已更新 {len(updated_ids)} 位人物: {', '.join(updated_ids)}")


if __name__ == "__main__":
    main()
