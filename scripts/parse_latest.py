import json
import os
import re
from collections import defaultdict, Counter
from pypinyin import lazy_pinyin

BASE_DIR = os.path.dirname(__file__)
NEW_INPUT = os.path.join(BASE_DIR, "..", "..", "唐朝演义人物全录_补齐版.txt")
OLD_CHARACTERS = os.path.join(BASE_DIR, "..", "data", "characters_backup_724.json")
OUTPUT_CHARACTERS = os.path.join(BASE_DIR, "..", "data", "characters.json")

# 11 类目标分类
TARGET_CATEGORIES = [
    "皇帝/皇室",
    "宰相/大臣",
    "武将/将领",
    "节度使/藩镇",
    "宦官",
    "后宫/女性",
    "外族",
    "文人",
    "叛乱势力",
    "宗教人物",
    "其他",
]

# 分类优先级（数值越小优先级越高）
CATEGORY_PRIORITY = {
    "后宫/女性": 1,
    "皇帝/皇室": 2,
    "宦官": 3,
    "叛乱势力": 4,
    "节度使/藩镇": 5,
    "武将/将领": 6,
    "宰相/大臣": 7,
    "外族": 8,
    "文人": 9,
    "宗教人物": 10,
    "其他": 11,
}

# 强制分类名单（最高优先级）
FORCE_CATEGORY = {
    # 重点武将
    "李晟": "武将/将领",
    "郭子仪": "武将/将领",
    "浑瑊": "武将/将领",
    "马燧": "武将/将领",
    # 叛乱势力
    "安禄山": "叛乱势力",
    "史思明": "叛乱势力",
    "朱温": "叛乱势力",
    "朱全忠": "叛乱势力",
    "朱泚": "叛乱势力",
    "李希烈": "叛乱势力",
    "王世充": "叛乱势力",
    "窦建德": "叛乱势力",
    "刘武周": "叛乱势力",
    "黄巢": "叛乱势力",
    # 藩镇
    "高骈": "节度使/藩镇",
    "李克用": "节度使/藩镇",
    # 宦官
    "高力士": "宦官",
    # 文人
    "李白": "文人",
    "杜甫": "文人",
    # 后宫/女性
    "太平公主": "后宫/女性",
    "上官婉儿": "后宫/女性",
    "杨贵妃": "后宫/女性",
    "文成公主": "后宫/女性",
    "平阳公主": "后宫/女性",
    "安乐公主": "后宫/女性",
    "萧后": "后宫/女性",
    "韦后": "后宫/女性",
    "安定公主": "后宫/女性",
    "尹德妃": "后宫/女性",
    "张婕妤": "后宫/女性",
    "徐贤妃": "后宫/女性",
    # 排除误分类为后宫/女性的男性
    "武崇训": "皇帝/皇室",
    "贺兰敏之": "皇帝/皇室",
}

# 女性关键词（用于后宫/女性判断）
FEMALE_KEYWORDS = [
    "公主", "皇后", "太后", "贵妃", "昭容", "婕妤", "才人", "美人", "嫔", "妃",
    "德妃", "贤妃", "淑妃", "惠妃", "丽妃", "华妃", "杨妃", "宸妃",
    "夫人", "贵嫔", "御女", "采女", "宫人", "宫女", "女官", "女学士",
    "娘子", "郡主", "县主", "帝姬", "王妃", "孺人",
]

# 这些词组出现时，不应判定为女性
FEMALE_EXCLUDE_PATTERNS = [
    "公主夫", "公主婿", "驸马", "夫人兄", "夫人弟", "夫人父", "夫人祖",
    "皇后父", "皇后兄", "皇后弟", "皇后祖", "妃父", "妃兄", "妃弟",
    "外祖母兄", "外祖母弟", "女婿", "夫婿", "前夫", "后夫",
]

# 宦官关键词
EUNUCH_KEYWORDS = [
    "宦官", "太监", "中尉", "内侍", "枢密使", "神策军", "观军容使",
    "押衙", "护军中尉", "左军中尉", "右军中尉",
]

# 叛乱势力关键词
REBEL_KEYWORDS = [
    "反", "叛", "造反", "起兵", "自立", "贼", "乱", "逆", "起义", "篡唐",
    "伪帝", "楚帝", "汉帝", "燕帝", "齐帝", "周帝", "梁帝", "秦帝", "赵帝",
    "黄巢", "朱温", "朱全忠", "秦宗权", "李希烈", "王仙芝", "裘甫", "庞勋",
    "安禄山", "史思明",
]

# 节度使/藩镇关键词
JIEDUSHI_KEYWORDS = [
    "节度使", "观察使", "防御使", "经略使", "团练使", "都团练使", "兵马使",
    "都知兵马使", "行营节度使", "藩镇", "留后", "牙将",
]

# 武将关键词
GENERAL_KEYWORDS = [
    "将军", "大将军", "都督", "总管", "元帅", "副元帅", "都护", "校尉",
    "中郎将", "讨击使", "行军", "大总管", "先锋", "都头", "虞候",
    "厢主", "都将", "指挥使", "节度使",  # 节度使也常有武将身份
]

# 大臣关键词
MINISTER_KEYWORDS = [
    "宰相", "尚书", "侍郎", "中书", "门下", "侍中", "同平章事", "仆射",
    "卿", "御史", "大夫", "郎中", "员外郎", "舍人", "给事中", "谏议大夫",
    "拾遗", "补阙", "令", "丞", "判官", "推官", "掌书记", "司马", "长史",
    "参军", "主簿", "驸马", "国公", "郡公", "县公", "侯", "伯",
]

# 文人关键词
SCHOLAR_KEYWORDS = [
    "诗人", "文学家", "史学家", "书法家", "画家", "进士", "状元", "翰林",
    "学士", "著作郎", "秘书监", "国子祭酒", "才子", "文士",
]

# 外族关键词
FOREIGN_KEYWORDS = [
    "可汗", "可敦", "赞普", "国王", "酋长", "叶护", "俟斤", "突厥", "吐蕃",
    "回纥", "南诏", "渤海", "高丽", "新罗", "百济", "吐谷浑", "薛延陀",
    "高句丽", "契丹", "奚", "靺鞨", "室韦", "党项", "沙陀", "回鹘", "大食",
    "波斯", "天竺", "倭", "日本",
]

# 宗教关键词
RELIGION_KEYWORDS = [
    "僧", "法师", "道士", "住持", "玄奘", "鉴真", "活佛", "喇嘛", "禅师",
    "高僧", "道长", "真人",
]

# 皇室关键词
ROYAL_KEYWORDS = [
    "皇帝", "太上皇", "太子", "亲王", "郡王", "嗣王", "皇子", "皇孙",
    "宗室", "王室", "公主", "帝", "后", "太后",
]


def load_old_characters():
    if not os.path.exists(OLD_CHARACTERS):
        return {}
    with open(OLD_CHARACTERS, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {c["name"]: c for c in data.get("characters", [])}


def make_pinyin_id(name):
    pinyin = "".join(lazy_pinyin(name))
    pinyin = re.sub(r"[^a-z0-9]", "", pinyin.lower())
    return pinyin or "unknown"


def parse_mentions(line):
    m = re.search(r"约(\d+)次", line)
    if m:
        return int(m.group(1))
    return 1


def split_events(events_text):
    if not events_text:
        return []
    parts = re.split(r"[；;。，,、]", events_text)
    return [p.strip() for p in parts if p.strip()]


def is_female_role(role):
    """判断是否明显为女性角色，同时排除男性亲属称谓。"""
    for pat in FEMALE_EXCLUDE_PATTERNS:
        if pat in role:
            return False
    return any(kw in role for kw in FEMALE_KEYWORDS)


def infer_categories(name, role, events_text):
    """推断人物可能属于的所有分类，返回列表。"""
    text = f"{name} {role} {events_text}".lower()
    cats = set()

    # 强制分类
    if name in FORCE_CATEGORY:
        return [FORCE_CATEGORY[name]]

    # 叛乱势力优先判断（避免称帝者被归入皇室）
    rebel_markers = ["称帝", "自立", "叛", "反", "贼", "乱", "逆", "起义", "篡唐", "伪帝", "楚帝", "汉帝", "燕帝", "齐帝", "周帝", "梁帝", "秦帝", "赵帝"]
    if any(kw in text for kw in REBEL_KEYWORDS) or any(m in text for m in rebel_markers):
        # 朱温/朱全忠集团、黄巢集团等即使称王称帝也归叛乱势力
        if any(k in name for k in ["朱温", "朱全忠", "黄巢", "秦宗权", "李希烈", "王仙芝", "裘甫", "庞勋", "安禄山", "史思明"]):
            cats.add("叛乱势力")
        # 隋唐之际割据称帝者，不归唐朝皇室
        elif any(k in name for k in ["王世充", "窦建德", "刘武周", "薛举", "李轨", "萧铣", "宇文化及", "朱泚"]):
            cats.add("叛乱势力")
        # 如果 role 中出现“帝”“王”但含有反叛词，优先叛乱势力
        elif "帝" in role or "王" in role:
            cats.add("叛乱势力")

    # 后宫/女性：严格判断
    if is_female_role(role) or is_female_role(name):
        cats.add("后宫/女性")

    # 宦官
    if any(kw in text for kw in EUNUCH_KEYWORDS):
        cats.add("宦官")

    # 节度使/藩镇
    if any(kw in text for kw in JIEDUSHI_KEYWORDS):
        cats.add("节度使/藩镇")

    # 武将/将领
    if any(kw in text for kw in GENERAL_KEYWORDS):
        cats.add("武将/将领")

    # 宰相/大臣
    if any(kw in text for kw in MINISTER_KEYWORDS):
        cats.add("宰相/大臣")

    # 文人
    if any(kw in text for kw in SCHOLAR_KEYWORDS):
        cats.add("文人")

    # 外族
    if any(kw in text for kw in FOREIGN_KEYWORDS):
        cats.add("外族")

    # 宗教人物
    if any(kw in text for kw in RELIGION_KEYWORDS):
        cats.add("宗教人物")

    # 皇帝/皇室
    if any(kw in text for kw in ROYAL_KEYWORDS):
        cats.add("皇帝/皇室")

    if not cats:
        cats.add("其他")

    return list(cats)


def choose_primary_category(categories):
    """按优先级确定 primaryCategory。"""
    sorted_cats = sorted(categories, key=lambda c: CATEGORY_PRIORITY.get(c, 99))
    return sorted_cats[0]


def parse_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    entries = re.split(r"(?=▶\s)", content)
    characters = []
    used_ids = set()
    old_map = load_old_characters()

    for entry in entries:
        entry = entry.strip()
        if not entry.startswith("▶"):
            continue

        lines = entry.splitlines()
        name_match = re.search(r"▶\s*(.+)", lines[0])
        if not name_match:
            continue
        name = name_match.group(1).strip()
        if not name:
            continue

        role = ""
        events_text = ""
        mentions = 1
        letter = name[0] if name else ""

        for line in lines[1:]:
            line = line.strip()
            if line.startswith("身份/职务："):
                role = line.replace("身份/职务：", "").strip()
            elif line.startswith("相关事件："):
                events_text = line.replace("相关事件：", "").strip()
            elif line.startswith("书中出现次数："):
                mentions = parse_mentions(line)

        events = split_events(events_text)

        # id 稳定性
        if name in old_map:
            char_id = old_map[name]["id"]
        else:
            char_id = make_pinyin_id(name)
            base_id = char_id
            counter = 2
            while char_id in used_ids:
                char_id = f"{base_id}-{counter}"
                counter += 1
        used_ids.add(char_id)

        categories = infer_categories(name, role, events_text)
        primary = choose_primary_category(categories)

        summary = f"{name}，{role}。" + (f"相关事件：{'、'.join(events)}。" if events else "")

        characters.append({
            "id": char_id,
            "name": name,
            "letter": letter,
            "role": role,
            "category": primary,
            "primaryCategory": primary,
            "events": events,
            "eventRaw": events_text,
            "mentions": mentions,
            "period": "唐代",
            "summary": summary,
            "relations": [],
            "source": "唐朝演义人物全录_补齐版.txt",
        })

    return characters


def main():
    characters = parse_file(NEW_INPUT)
    # 注意：relations 不再根据碎片事件自动生成，保持为空，后续人工补充真实关系

    with open(OUTPUT_CHARACTERS, "w", encoding="utf-8") as f:
        json.dump({"characters": characters}, f, ensure_ascii=False, indent=2)

    print(f"生成 {len(characters)} 个人物")
    print(f"分类统计：{Counter(c['primaryCategory'] for c in characters)}")


if __name__ == "__main__":
    main()
