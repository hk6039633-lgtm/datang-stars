import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "characters.json")

CARD_PATHS = {
    "lishimin": "/images/characters/card/li-shimin_card_v01.png",
    "wuzetian": "/images/characters/card/wu-zetian_card_v01.png",
    "anlushan": "/images/characters/card/an-lushan_card_v01.png",
    "guoziyi": "/images/characters/card/guo-ziyi_card_v01.png",
}


def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    characters = data["characters"]
    updated_ids = []

    for c in characters:
        cid = c.get("id")
        if cid in CARD_PATHS:
            c["cardPath"] = CARD_PATHS[cid]
            updated_ids.append(cid)

    missing = set(CARD_PATHS.keys()) - set(updated_ids)
    if missing:
        raise RuntimeError(f"以下目标人物未在 characters.json 中找到: {missing}")

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"已更新 {len(updated_ids)} 位人物: {', '.join(updated_ids)}")


if __name__ == "__main__":
    main()
