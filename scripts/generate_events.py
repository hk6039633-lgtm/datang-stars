import json
import os
import re
from collections import defaultdict

BASE_DIR = os.path.dirname(__file__)
CHARACTERS_PATH = os.path.join(BASE_DIR, "..", "data", "characters.json")
EVENTS_PATH = os.path.join(BASE_DIR, "..", "data", "events.json")


def load_characters():
    with open(CHARACTERS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)["characters"]


def build_name_index(characters):
    """建立姓名到 id 的索引，处理重名取出现次数最高者。"""
    index = defaultdict(list)
    for c in characters:
        index[c["name"]].append(c)
    result = {}
    for name, chars in index.items():
        chars.sort(key=lambda x: -x["mentions"])
        result[name] = chars[0]["id"]
    return result


# 核心历史事件种子
EVENT_SEEDS = [
    {
        "id": "taiyuan-qibing",
        "title": "太原起兵",
        "period": "隋末唐初",
        "year": "617年",
        "summary": "李渊在太原起兵反隋，率众西入长安，次年称帝建立唐朝，揭开李唐三百年基业。",
        "consequences": "唐朝建立，李渊成为唐高祖，开启统一战争。",
        "character_names": ["李渊", "李世民", "李建成", "李元吉", "裴寂", "刘文静"],
    },
    {
        "id": "xuanwu-gate",
        "title": "玄武门之变",
        "period": "初唐",
        "year": "626年",
        "summary": "秦王李世民在长安玄武门伏杀太子李建成、齐王李元吉，随后被立为太子，旋即即位。",
        "consequences": "李世民登基为唐太宗，贞观之治拉开序幕。",
        "character_names": ["李世民", "李建成", "李元吉", "李渊", "尉迟恭", "长孙无忌"],
    },
    {
        "id": "zhenguan-zhizhi",
        "title": "贞观之治",
        "period": "初唐",
        "year": "627—649年",
        "summary": "唐太宗在位期间励精图治，纳谏任贤，轻徭薄赋，社会安定，被誉为治世典范。",
        "consequences": "奠定唐朝强盛根基，形成政治清明、经济恢复的局面。",
        "character_names": ["李世民", "魏征", "房玄龄", "杜如晦", "长孙无忌", "李靖"],
    },
    {
        "id": "mie-dongtujue",
        "title": "灭东突厥",
        "period": "初唐",
        "year": "630年",
        "summary": "唐太宗派李靖、李勣等分道出击，大破东突厥，俘颉利可汗，漠南归附。",
        "consequences": "唐朝声威远播，太宗被尊为“天可汗”，边疆获得长期安定。",
        "character_names": ["李世民", "李靖", "李勣", "颉利可汗"],
    },
    {
        "id": "wuhou-chengzhi",
        "title": "武后临朝与武周称制",
        "period": "初唐",
        "year": "660—705年",
        "summary": "武则天由皇后临朝称制，逐步翦除政敌，改唐为周，成为中国历史上唯一的正统女皇帝。",
        "consequences": "女主当国近半个世纪，打击门阀、发展科举，为开元盛世积蓄人才。",
        "character_names": ["武则天", "唐高宗", "狄仁杰", "来俊臣", "上官婉儿", "李显"],
    },
    {
        "id": "shenlong-zhengbian",
        "title": "神龙政变",
        "period": "初唐",
        "year": "705年",
        "summary": "张柬之等五王发动政变，逼武则天退位，中宗李显复位，唐朝复辟。",
        "consequences": "武周政权结束，李唐复国，但韦后、安乐公主等很快干政。",
        "character_names": ["张柬之", "李显", "武则天", "上官婉儿", "韦后"],
    },
    {
        "id": "xiantian-zhengbian",
        "title": "先天政变",
        "period": "盛唐",
        "year": "713年",
        "summary": "李隆基先发制人，诛灭太平公主势力，巩固皇权，随后改元开元。",
        "consequences": "玄宗李隆基完全掌握政权，开元盛世由此开启。",
        "character_names": ["李隆基", "太平公主", "高力士", "姚崇"],
    },
    {
        "id": "kaiyuan-shengshi",
        "title": "开元盛世",
        "period": "盛唐",
        "year": "713—741年",
        "summary": "唐玄宗励精图治，任用姚崇、宋璟、张九龄等贤相，国力强盛，文化繁荣。",
        "consequences": "唐朝达到鼎盛，长安成为国际性大都会，为后世留下丰厚文化遗产。",
        "character_names": ["李隆基", "姚崇", "宋璟", "张九龄", "李白", "杨贵妃"],
    },
    {
        "id": "tianbao-weiji",
        "title": "天宝危机",
        "period": "盛唐",
        "year": "742—755年",
        "summary": "玄宗晚年怠政，李林甫、杨国忠相继专权，边将安禄山势力坐大，朝政腐败。",
        "consequences": "中央与边镇矛盾激化，为安史之乱埋下祸根。",
        "character_names": ["李隆基", "杨贵妃", "杨国忠", "李林甫", "安禄山"],
    },
    {
        "id": "anshi-zhiluan",
        "title": "安史之乱",
        "period": "盛唐",
        "year": "755—763年",
        "summary": "安禄山、史思明发动叛乱，攻陷两京，玄宗出逃，唐朝由盛转衰。",
        "consequences": "人口锐减，藩镇割据形成，均田制与府兵制瓦解，唐朝国力大损。",
        "character_names": ["安禄山", "史思明", "李隆基", "杨贵妃", "郭子仪", "李光弼", "杜甫"],
    },
    {
        "id": "suiyang-zhishou",
        "title": "睢阳之守",
        "period": "中唐",
        "year": "757年",
        "summary": "张巡、许远以少量兵力死守睢阳，阻滞叛军南下，保障江淮财源。",
        "consequences": "为唐朝平定叛乱赢得战略时间，但城中粮尽，军民伤亡惨重。",
        "character_names": ["张巡", "许远", "尹子奇", "南霁云"],
    },
    {
        "id": "fengtian-zhinan",
        "title": "奉天之难",
        "period": "中唐",
        "year": "783年",
        "summary": "泾原兵变，朱泚称帝，唐德宗逃往奉天，李晟等率军勤王收复长安。",
        "consequences": "德宗对藩镇由武力削藩转向姑息，宦官势力进一步膨胀。",
        "character_names": ["唐德宗", "朱泚", "李晟", "李怀光"],
    },
    {
        "id": "ping-huaixi",
        "title": "平淮西",
        "period": "中唐",
        "year": "817年",
        "summary": "唐宪宗命裴度督师，李愬雪夜袭蔡州，擒吴元济，淮西之乱平定。",
        "consequences": "元和中兴达到顶点，藩镇一度重新归顺中央。",
        "character_names": ["唐宪宗", "裴度", "李愬", "吴元济", "韩愈"],
    },
    {
        "id": "niuli-dangzheng",
        "title": "牛李党争",
        "period": "中晚唐",
        "year": "808—846年",
        "summary": "以牛僧孺为首的牛党与李德裕为首的李党长期倾轧，延绵近四十年。",
        "consequences": "内耗严重，人才任用受党争影响，加速政治衰败。",
        "character_names": ["牛僧孺", "李德裕", "李宗闵", "白居易", "李商隐"],
    },
    {
        "id": "ganlu-zhibian",
        "title": "甘露之变",
        "period": "晚唐",
        "year": "835年",
        "summary": "唐文宗与宰相李训等谋诛宦官，事泄失败，宦官仇士良大肆屠杀朝臣。",
        "consequences": "南衙北司之争中宦官彻底占上风，皇帝形同傀儡。",
        "character_names": ["唐文宗", "李训", "仇士良", "王守澄", "郑注"],
    },
    {
        "id": "huangchao-qiyi",
        "title": "黄巢起义",
        "period": "晚唐",
        "year": "875—884年",
        "summary": "黄巢率义军转战大半个唐朝，一度攻占长安称帝，国号大齐。",
        "consequences": "唐朝统治根基被摧毁，藩镇借平叛扩张，中央名存实亡。",
        "character_names": ["黄巢", "唐僖宗", "李克用", "朱温", "高骈"],
    },
    {
        "id": "zhuwen-jueqi",
        "title": "朱温崛起",
        "period": "晚唐",
        "year": "884—901年",
        "summary": "朱温降唐后借平黄巢、击秦宗权等战功成为最大藩镇，控制中原。",
        "consequences": "朱温势力坐大，开始挟天子以令诸侯。",
        "character_names": ["朱温", "黄巢", "唐僖宗", "唐昭宗", "李克用"],
    },
    {
        "id": "zhuwen-cuantang",
        "title": "朱温篡唐",
        "period": "晚唐",
        "year": "907年",
        "summary": "朱温废唐哀帝，自立为帝，国号梁，唐朝灭亡。",
        "consequences": "唐朝终结，五代十国乱世开始。",
        "character_names": ["朱温", "唐哀帝", "李振", "柳璨"],
    },
]


def normalize_name(name):
    return re.sub(r"[\\（）()]", "", name).strip()


def main():
    characters = load_characters()
    name_index = build_name_index(characters)

    events = []
    for seed in EVENT_SEEDS:
        matched = []
        unmatched = []
        for name in seed["character_names"]:
            cid = name_index.get(normalize_name(name))
            if cid:
                matched.append({ "id": cid, "name": name })
            else:
                unmatched.append(name)

        # 未匹配的人物也作为 name-only 标签展示
        for name in unmatched:
            matched.append({ "id": None, "name": name })

        events.append({
            "id": seed["id"],
            "title": seed["title"],
            "period": seed["period"],
            "year": seed["year"],
            "summary": seed["summary"],
            "consequences": seed["consequences"],
            "characters": matched,
        })

    with open(EVENTS_PATH, "w", encoding="utf-8") as f:
        json.dump({"events": events}, f, ensure_ascii=False, indent=2)

    print(f"生成 {len(events)} 个核心历史事件")


if __name__ == "__main__":
    main()
