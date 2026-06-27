import re
import json
import os
from collections import defaultdict, Counter
from pypinyin import lazy_pinyin

INPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "唐朝演义人物全录.txt")
OUTPUT_CHARACTERS = os.path.join(os.path.dirname(__file__), "..", "data", "characters.json")
OUTPUT_EVENTS = os.path.join(os.path.dirname(__file__), "..", "data", "events.json")


def make_id(name):
    """根据姓名生成拼音 id，避免重名加数字。"""
    pinyin = "".join(lazy_pinyin(name))
    pinyin = re.sub(r"[^a-z0-9]", "", pinyin.lower())
    return pinyin or "unknown"


def infer_category(role, events_text):
    text = (role or "") + " " + (events_text or "")
    text = text.lower()

    # 后宫/皇室
    if any(k in text for k in ["皇帝", "皇后", "太后", "贵妃", "昭容", "婕妤", "嫔", "妃", "才人", "美人", "公主", "亲王", "郡王", "太子"]):
        if "皇帝" in text or "太后" in text or "太子" in text:
            return "皇室"
        return "后宫"

    # 宦官
    if any(k in text for k in ["宦官", "太监", "中尉", "神策军", "内侍", "枢密使"]):
        return "宦官"

    # 僧道
    if any(k in text for k in ["僧", "法师", "道士", "住持", "玄奘", "鉴真", "活佛", "喇嘛"]):
        return "僧道"

    # 文人（诗人、文学家、史学家、书法家）
    if any(k in text for k in ["诗人", "文学家", "史学家", "书法家", "画家", "进士", "状元", "翰林", "学士", "著作郎", "秘书监", "国子祭酒"]):
        return "文人"

    # 叛将/反贼
    if any(k in text for k in ["叛", "反", "起兵", "造反", "称帝", "自立", "贼"]):
        if any(k in text for k in ["节度使", "将军", "总管", "元帅", "大将军"]):
            return "叛将"

    # 外族首领
    if any(k in text for k in ["可汗", "可敦", "赞普", "国王", "酋长", "叶护", "俟斤", "吐蕃", "突厥", "回纥", "南诏", "渤海", "高丽"]):
        if "可汗" in text or "赞普" in text or "国王" in text or "酋长" in text:
            return "外族"

    # 将领/武官
    if any(k in text for k in ["将军", "大将军", "都督", "节度使", "总管", "元帅", "副元帅", "都护", "校尉", "中郎将", "兵马使", "讨击使", "防御使", "经略使", "团练使", "观察使", "刺史", "都知兵马使"]):
        return "将领"

    # 大臣/文官
    if any(k in text for k in ["宰相", "尚书", "侍郎", "中书", "门下", "侍中", "同平章事", "仆射", "卿", "御史", "大夫", "郎中", "员外郎", "舍人", "给事中", "谏议大夫", "拾遗", "补阙", "令", "丞", "尉", "判官", "推官", "掌书记", "司马", "长史", "参军", "主簿"]):
        return "大臣"

    return "其他"


def parse_mentions(line):
    m = re.search(r"约(\d+)次", line)
    if m:
        return int(m.group(1))
    return 1


def split_events(events_text):
    if not events_text:
        return []
    # 按中文分号、逗号、顿号分割
    parts = re.split(r"[；;。，,、]", events_text)
    parts = [p.strip() for p in parts if p.strip()]
    return parts


def normalize_event_name(name):
    name = name.strip()
    # 去除末尾的"等"、"之事"
    name = re.sub(r"(等|之事|一事|事件)$", "", name)
    return name.strip() or None


def parse_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 按 ▶ 分割人物条目
    entries = re.split(r"(?=▶\s)", content)
    characters = []
    event_to_characters = defaultdict(set)
    name_to_id = {}

    for entry in entries:
        entry = entry.strip()
        if not entry.startswith("▶"):
            continue

        lines = entry.splitlines()
        name_match = re.search(r"▶\s*(.+)", lines[0])
        if not name_match:
            continue
        name = name_match.group(1).strip()

        role = ""
        events_text = ""
        mentions = 1

        for line in lines[1:]:
            line = line.strip()
            if line.startswith("身份/职务："):
                role = line.replace("身份/职务：", "").strip()
            elif line.startswith("相关事件："):
                events_text = line.replace("相关事件：", "").strip()
            elif line.startswith("书中出现次数："):
                mentions = parse_mentions(line)

        if not name:
            continue

        category = infer_category(role, events_text)
        events = [e for e in split_events(events_text) if e]

        char_id = make_id(name)
        # 处理重名
        base_id = char_id
        counter = 2
        while char_id in name_to_id:
            char_id = f"{base_id}-{counter}"
            counter += 1
        name_to_id[char_id] = name

        characters.append({
            "id": char_id,
            "name": name,
            "role": role,
            "category": category,
            "events": events,
            "mentions": mentions,
            "period": "唐代",
            "summary": f"{name}，{role}。" + (f"相关事件：{'、'.join(events)}。" if events else ""),
            "relations": [],
            "_events_text": events_text,
        })

        for evt in events:
            event_to_characters[evt].add(char_id)

    return characters, event_to_characters, name_to_id


def extract_relations(characters, event_to_characters):
    """基于共同事件建立关系，每人最多保留 5 个关系。"""
    char_map = {c["id"]: c for c in characters}

    for c in characters:
        related = Counter()
        for evt in c["events"]:
            for other_id in event_to_characters.get(evt, set()):
                if other_id != c["id"]:
                    related[other_id] += 1

        relations = []
        for other_id, count in related.most_common(5):
            other = char_map.get(other_id)
            if other:
                relations.append({
                    "id": other_id,
                    "name": other["name"],
                    "type": f"同事件（{count}个）"
                })
        c["relations"] = relations


def build_events(event_to_characters, char_map, top_n=80):
    """选取涉及人物最多的前 N 个事件生成 events.json。"""
    sorted_events = sorted(event_to_characters.items(), key=lambda x: -len(x[1]))

    events = []
    period_map = {
        "初唐": ["李渊", "李世民", "贞观", "武德", "高宗", "武则天", "玄奘", "上官仪"],
        "盛唐": ["玄宗", "开元", "天宝", "安禄山", "杨贵妃", "李白", "杜甫"],
        "中唐": ["肃宗", "代宗", "德宗", "宪宗", "郭子仪", "李愬", "淮西", "节度使"],
        "晚唐": ["文宗", "武宗", "宣宗", "懿宗", "僖宗", "昭宗", "黄巢", "朱温", "甘露之变"],
    }

    for idx, (title, char_ids) in enumerate(sorted_events[:top_n], start=1):
        # 推断时期
        period = "唐代"
        for p, keywords in period_map.items():
            if any(k in title for k in keywords):
                period = p
                break

        events.append({
            "id": f"evt-{idx:03d}",
            "title": title,
            "period": period,
            "year": "唐代",
            "summary": f"《唐朝演义》中涉及“{title}”的相关情节。",
            "characters": sorted(char_ids),
        })

    return events


def main():
    characters, event_to_characters, name_to_id = parse_file(INPUT_PATH)
    char_map = {c["id"]: c for c in characters}

    extract_relations(characters, event_to_characters)
    events = build_events(event_to_characters, char_map)

    # 清理临时字段
    for c in characters:
        c.pop("_events_text", None)

    # 写文件
    with open(OUTPUT_CHARACTERS, "w", encoding="utf-8") as f:
        json.dump({"characters": characters}, f, ensure_ascii=False, indent=2)

    with open(OUTPUT_EVENTS, "w", encoding="utf-8") as f:
        json.dump({"events": events}, f, ensure_ascii=False, indent=2)

    print(f"生成 {len(characters)} 个人物，{len(events)} 个事件")
    print(f"分类统计：{Counter(c['category'] for c in characters)}")


if __name__ == "__main__":
    main()
