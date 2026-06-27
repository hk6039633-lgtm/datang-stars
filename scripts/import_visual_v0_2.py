import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "characters.json")

# manifest id -> characters.json id 映射
ID_MAP = {
    "li-yuan": "liyuan",
    "gaozong": "gaozong",      # 李治必须绑定 gaozong
    "li-longji": "lilongji",
    "yang-guifei": "yangguifei",
    "li-bi": "limi-2",          # 李泌在数据库中的实际 id
    "zhu-wen": "zhuwen",
}

# 从 manifest 中提取的路径（已按规范命名）
PATHS = {
    "li-yuan": {
        "cleanPath": "/images/characters/clean/li-yuan_clean_v01.png",
        "cardPath": "/images/characters/card/li-yuan_card_v01.png",
        "avatarPath": "/images/characters/avatar/li-yuan_avatar_v01.png",
    },
    "gaozong": {
        "cleanPath": "/images/characters/clean/li-zhi_clean_v01.png",
        "cardPath": "/images/characters/card/li-zhi_card_v01.png",
        "avatarPath": "/images/characters/avatar/li-zhi_avatar_v01.png",
    },
    "li-longji": {
        "cleanPath": "/images/characters/clean/li-longji_clean_v01.png",
        "cardPath": "/images/characters/card/li-longji_card_v01.png",
        "avatarPath": "/images/characters/avatar/li-longji_avatar_v01.png",
    },
    "yang-guifei": {
        "cleanPath": "/images/characters/clean/yang-guifei_clean_v01.png",
        "cardPath": "/images/characters/card/yang-guifei_card_v01.png",
        "avatarPath": "/images/characters/avatar/yang-guifei_avatar_v01.png",
    },
    "li-bi": {
        "cleanPath": "/images/characters/clean/li-bi_clean_v01.png",
        "cardPath": "/images/characters/card/li-bi_card_v01.png",
        "avatarPath": "/images/characters/avatar/li-bi_avatar_v01.png",
    },
    "zhu-wen": {
        "cleanPath": "/images/characters/clean/zhu-wen_clean_v01.png",
        "cardPath": "/images/characters/card/zhu-wen_card_v01.png",
        "avatarPath": "/images/characters/avatar/zhu-wen_avatar_v01.png",
    },
}


def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    characters = data["characters"]
    updated_ids = []

    for c in characters:
        cid = c.get("id")
        # 找到 manifest id 到数据库 id 的映射
        manifest_id = next((k for k, v in ID_MAP.items() if v == cid), None)
        if not manifest_id:
            continue

        cfg = PATHS[manifest_id]
        c["cleanPath"] = cfg["cleanPath"]
        c["cardPath"] = cfg["cardPath"]
        c["avatarPath"] = cfg["avatarPath"]
        updated_ids.append(cid)

    missing = set(ID_MAP.values()) - set(updated_ids)
    if missing:
        raise RuntimeError(f"以下目标人物未在 characters.json 中找到: {missing}")

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"已更新 {len(updated_ids)} 位人物: {', '.join(updated_ids)}")


if __name__ == "__main__":
    main()
