#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
《唐局人物数据结构与榜单逻辑重梳理 v0.2》数据处理脚本

目标：
1. 扩展 Character 字段（别名系统、历史影响力评分、视觉优先级等）
2. 修正皇帝/皇室人物分类与别名
3. 清理皇帝/皇室分类中错分的非皇帝人物
4. 为所有人设置 historicalImportanceScore 与 visualPriority
"""

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "characters.json"
OUT_FILE = ROOT / "data" / "characters.json"
AUDIT_FILE = ROOT / "CHARACTER_DATA_AUDIT.md"
FIX_FILE = ROOT / "imperial_characters_fix.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

characters = data["characters"]

# ============================================================
# 0. v0.2.1 预处理：删除重复人物
# ============================================================
# lizhan（唐敬宗重复条目）与 jingzong 重复，删除 lizhan，保留 jingzong
before_count = len(characters)
characters = [c for c in characters if c["id"] != "lizhan"]
deleted_lizhan = before_count - len(characters)
data["characters"] = characters

# ============================================================
# 1. 唐朝皇帝元数据
# ============================================================
# 每位皇帝：canonicalName（本名）、templeName（庙号）、dynastyTitle（历史称号）、
#          formerTitle（早期封号）、aliases（别名数组）
EMPEROR_META = {
    "liyuan": {
        "canonicalName": "李渊",
        "displayName": "李渊",
        "personalName": "李渊",
        "templeName": "高祖",
        "dynastyTitle": "唐高祖",
        "formerTitle": "唐国公",
        "aliases": ["李渊", "唐高祖", "高祖", "唐国公"],
        "score": 92,
    },
    "lishimin": {
        "canonicalName": "李世民",
        "displayName": "李世民",
        "personalName": "李世民",
        "templeName": "太宗",
        "dynastyTitle": "唐太宗",
        "formerTitle": "秦王",
        "aliases": ["李世民", "太宗", "唐太宗", "秦王", "世民"],
        "score": 100,
    },
    "gaozong": {
        "canonicalName": "李治",
        "displayName": "李治",
        "personalName": "李治",
        "templeName": "高宗",
        "dynastyTitle": "唐高宗",
        "formerTitle": "晋王",
        "aliases": ["李治", "高宗", "唐高宗", "晋王"],
        "score": 90,
    },
    "wuzetian": {
        "canonicalName": "武则天",
        "displayName": "武则天",
        "personalName": "武曌",
        "templeName": "",
        "dynastyTitle": "武周皇帝",
        "formerTitle": "武后",
        "aliases": ["武则天", "武曌", "武后", "则天皇后", "则天皇帝", "武周皇帝"],
        "score": 98,
    },
    "zhongzong": {
        "canonicalName": "李显",
        "displayName": "李显",
        "personalName": "李显",
        "templeName": "中宗",
        "dynastyTitle": "唐中宗",
        "formerTitle": "英王",
        "aliases": ["李显", "中宗", "唐中宗", "英王"],
        "score": 82,
    },
    "ruizong": {
        "canonicalName": "李旦",
        "displayName": "李旦",
        "personalName": "李旦",
        "templeName": "睿宗",
        "dynastyTitle": "唐睿宗",
        "formerTitle": "相王",
        "aliases": ["李旦", "睿宗", "唐睿宗", "相王"],
        "score": 80,
    },
    "lilongji": {
        "canonicalName": "李隆基",
        "displayName": "李隆基",
        "personalName": "李隆基",
        "templeName": "玄宗",
        "dynastyTitle": "唐玄宗",
        "formerTitle": "临淄王",
        "aliases": ["李隆基", "玄宗", "唐玄宗", "明皇", "临淄王"],
        "score": 95,
    },
    "suzong": {
        "canonicalName": "李亨",
        "displayName": "李亨",
        "personalName": "李亨",
        "templeName": "肃宗",
        "dynastyTitle": "唐肃宗",
        "formerTitle": "忠王",
        "aliases": ["李亨", "肃宗", "唐肃宗", "忠王"],
        "score": 86,
    },
    "daizong": {
        "canonicalName": "李豫",
        "displayName": "李豫",
        "personalName": "李豫",
        "templeName": "代宗",
        "dynastyTitle": "唐代宗",
        "formerTitle": "广平王",
        "aliases": ["李豫", "代宗", "唐代宗", "广平王"],
        "score": 84,
    },
    "dezong": {
        "canonicalName": "李适",
        "displayName": "李适",
        "personalName": "李适",
        "templeName": "德宗",
        "dynastyTitle": "唐德宗",
        "formerTitle": "雍王",
        "aliases": ["李适", "德宗", "唐德宗", "雍王"],
        "score": 83,
    },
    "shunzong": {
        "canonicalName": "李诵",
        "displayName": "李诵",
        "personalName": "李诵",
        "templeName": "顺宗",
        "dynastyTitle": "唐顺宗",
        "formerTitle": "宣城郡王",
        "aliases": ["李诵", "顺宗", "唐顺宗"],
        "score": 72,
    },
    "xianzong": {
        "canonicalName": "李纯",
        "displayName": "李纯",
        "personalName": "李纯",
        "templeName": "宪宗",
        "dynastyTitle": "唐宪宗",
        "formerTitle": "广陵王",
        "aliases": ["李纯", "宪宗", "唐宪宗", "广陵王"],
        "score": 88,
    },
    "muzong": {
        "canonicalName": "李恒",
        "displayName": "李恒",
        "personalName": "李恒",
        "templeName": "穆宗",
        "dynastyTitle": "唐穆宗",
        "formerTitle": "遂王",
        "aliases": ["李恒", "穆宗", "唐穆宗", "遂王"],
        "score": 75,
    },
    "jingzong": {
        "canonicalName": "李湛",
        "displayName": "李湛",
        "personalName": "李湛",
        "templeName": "敬宗",
        "dynastyTitle": "唐敬宗",
        "formerTitle": "景王",
        "aliases": ["李湛", "敬宗", "唐敬宗", "景王"],
        "score": 70,
    },
    "wenzong": {
        "canonicalName": "李昂",
        "displayName": "李昂",
        "personalName": "李昂",
        "templeName": "文宗",
        "dynastyTitle": "唐文宗",
        "formerTitle": "江王",
        "aliases": ["李昂", "文宗", "唐文宗", "江王"],
        "score": 76,
    },
    "wuzong": {
        "canonicalName": "李炎",
        "displayName": "李炎",
        "personalName": "李炎",
        "templeName": "武宗",
        "dynastyTitle": "唐武宗",
        "formerTitle": "颍王",
        "aliases": ["李炎", "武宗", "唐武宗", "颍王"],
        "score": 78,
    },
    "xuanzong": {
        "canonicalName": "李忱",
        "displayName": "李忱",
        "personalName": "李忱",
        "templeName": "宣宗",
        "dynastyTitle": "唐宣宗",
        "formerTitle": "光王",
        "aliases": ["李忱", "宣宗", "唐宣宗", "光王"],
        "score": 86,
    },
    "yizong": {
        "canonicalName": "李漼",
        "displayName": "李漼",
        "personalName": "李漼",
        "templeName": "懿宗",
        "dynastyTitle": "唐懿宗",
        "formerTitle": "郓王",
        "aliases": ["李漼", "懿宗", "唐懿宗", "郓王"],
        "score": 68,
    },
    "xizong": {
        "canonicalName": "李儇",
        "displayName": "李儇",
        "personalName": "李儇",
        "templeName": "僖宗",
        "dynastyTitle": "唐僖宗",
        "formerTitle": "普王",
        "aliases": ["李儇", "僖宗", "唐僖宗", "普王"],
        "score": 72,
    },
    "zhaozong": {
        "canonicalName": "李晔",
        "displayName": "李晔",
        "personalName": "李晔",
        "templeName": "昭宗",
        "dynastyTitle": "唐昭宗",
        "formerTitle": "寿王",
        "aliases": ["李晔", "昭宗", "唐昭宗", "寿王"],
        "score": 78,
    },
    "zhaoxuandi": {
        "canonicalName": "李柷",
        "displayName": "李柷",
        "personalName": "李柷",
        "templeName": "",
        "dynastyTitle": "唐哀帝",
        "formerTitle": "辉王",
        "aliases": ["李柷", "哀帝", "唐哀帝", "昭宣帝", "辉王"],
        "score": 65,
    },
}

# 强制分类覆盖（特定人物）
CATEGORY_OVERRIDES = {
    "zhutao": "叛乱势力",
    "liuwuzhou": "叛乱势力",
    "dufuwei": "叛乱势力",
    "yichenggongzhu": "外族",
    "wanggui": "宰相/大臣",
    "weiting-2": "宰相/大臣",
    "fuyulong": "外族",
}

# 后宫/女性中的公主、驸马应归入皇帝/皇室
ROYAL_FEMALE_AND_CONSORT_IDS = {
    "tongangongzhu", "taipinggongzhu", "anlegongzhu", "changlegongzhu",
    "pingyanggongzhu", "wenchenggongzhu", "guiyanggongzhu", "yongtaigongzhu",
    "wuchongxun",  # 安乐公主夫
}

# v0.2.1 分类修正：前 100 人物的明显错误
CLASSIFICATION_FIXES = {
    "zhangsunwuji": "宰相/大臣",
    "lijing": "武将/将领",
    "yuchigong": "武将/将领",
    "baijuyi": "文人",
    "liuyuxi": "文人",
    "hanyu": "文人",
    "wangwei-2": "文人",
    "laijunchen": "其他",
}

# v0.2.1 分数调整
SCORE_ADJUSTMENTS = {
    "xuanzang": 72,      # 玄奘：佛教传播与中印交流代表
    "shangguanwaner": 78, # 上官婉儿：宫廷女官、文学政治人物
}

# v0.2.1 子分类覆盖
SUBCATEGORY_OVERRIDES_V021 = {
    "shangguanwaner": "宫廷女官",
    "laijunchen": "酷吏",
    "wuchengsi": "武周宗亲",
    "wuchongxun": "驸马/皇室姻亲",
}

# v0.2.1 核心人物一句话影响说明（前 100 名中重要人物）
CORE_IMPACT_STATEMENTS = {
    "lishimin": "奠定唐朝制度与政治气象的核心帝王，贞观之治成为后世治世标杆。",
    "wuzetian": "中国历史上唯一正式称帝的女皇，以武周政权重塑唐代权力结构。",
    "anlushan": "安史之乱的发动者，直接改变盛唐走向并开启中晚唐藩镇格局。",
    "lilongji": "开创开元盛世并将唐朝推向极盛，其统治后期又成为盛唐衰落的转折点。",
    "liyuan": "唐朝开国皇帝，建立李唐基业并奠定统一王朝的政治框架。",
    "zhuwen": "终结唐朝统治、建立后梁的关键人物，标志着五代十国的开端。",
    "guoziyi": "平定安史余波、维系唐室国祚的中兴名将。",
    "gaozong": "承接贞观之治与武周革命，永徽年间巩固了唐朝的疆域与制度。",
    "huangchao": "唐末农民起义领袖，其起兵沉重打击了唐朝中央统治。",
    "xianzong": "推动元和中兴，短暂恢复中央权威的中唐关键帝王。",
    "suzong": "在安史之乱中灵武即位，组织收复两京以延续唐室国祚。",
    "xuanzong": "开创大中之治，被誉为晚唐最后一次中兴的宣宗皇帝。",
    "shisiming": "与安禄山共同发动叛乱，是大燕政权与安史之乱的重要推手。",
    "yangguifei": "盛唐宫廷最具传奇色彩的女性，其命运与安史之乱紧密相连。",
    "zhangsunwuji": "唐太宗凌烟阁首席功臣，贞观政治格局的重要塑造者。",
    "weizheng": "以直言进谏著称的贞观名相，其政论成为后世谏臣典范。",
    "yaochong": "开元初年名相，以务实改革奠定开元盛世政治基础。",
    "daizong": "平定安史之乱后期战事，并着手调整中唐藩镇格局的皇帝。",
    "dezong": "经历建中削藩与奉天之难，其政策深刻影响中唐政治走向。",
    "zhangjiuling": "开元盛世时期的重要文治宰相，以诗才与政治眼光著称。",
    "fangxuanling": "贞观名相，主持修订唐律并参与奠定唐代典章制度。",
    "libai": "盛唐浪漫主义诗歌的巅峰代表，塑造后世对盛唐精神的想象。",
    "dufu": "中国现实主义诗歌的集大成者，被尊为诗圣并深刻影响后世文学。",
    "zhongzong": "武则天与李隆基之间的过渡帝王，其命运折射武周后期政治动荡。",
    "taipinggongzhu": "武则天之女、先天政变核心人物，是唐代宫廷权力女性代表。",
    "yangguozhong": "天宝末年权相，其专权与边镇矛盾成为安史之乱的重要诱因。",
    "wangxianzhi": "唐末农民起义先驱，其起兵揭开了唐朝覆亡的序幕。",
    "ruizong": "武则天与李隆基之间的过渡帝王，两度即位体现武周至开元政局变迁。",
    "shangguanwaner": "唐代著名宫廷女官与诗人，在武周至中宗朝文坛与政坛均有影响。",
    "anlegongzhu": "唐中宗之女，以骄纵干政闻名，是唐隆政变中的重要人物。",
    "baijuyi": "中唐新乐府运动核心诗人，以通俗深沉的诗风影响深远。",
    "gaolishi": "唐玄宗朝权宦，深度参与天宝政治并伴随玄宗走完盛世与乱世。",
    "wuzong": "推行会昌灭佛、加强集权的晚唐皇帝，短暂扭转了中央颓势。",
    "zhaozong": "晚唐受制于藩镇的皇帝，其被弑标志着唐朝名存实亡。",
    "wenchenggongzhu": "唐太宗宗女，入藏和亲成为唐蕃文化交流的重要象征。",
    "lijing": "唐朝开国与拓边名将，以高超军事才能奠定初唐边疆格局。",
    "xuanzang": "唐代高僧，西行取经并翻译佛典，成为中印文化交流的桥梁。",
}

# subCategory 强制覆盖
SUBCATEGORY_OVERRIDES = {
    "wuchengsi": "宗室",
}

# 额外高分/高优先级人物（非皇帝）
HIGH_PROFILE = {
    "anlushan": {"score": 95, "visualPriority": True, "aliases": ["安禄山", "禄山"]},
    "guoziyi": {"score": 90, "visualPriority": True, "aliases": ["郭子仪", "子仪"]},
    "zhuwen": {"score": 90, "visualPriority": True, "aliases": ["朱温", "朱全忠", "全忠"]},
    "huangchao": {"score": 88, "visualPriority": True, "aliases": ["黄巢"]},
    "lishiming": {"score": 88, "visualPriority": False, "aliases": ["李靖", "李药师"]},
    "ligong": {"score": 85, "visualPriority": False, "aliases": ["李勣", "徐茂公", "李世勣"]},
    "weizheng": {"score": 85, "visualPriority": False, "aliases": ["魏征", "魏徵"]},
    "fangxuanling": {"score": 82, "visualPriority": False, "aliases": ["房玄龄"]},
    "duroming": {"score": 80, "visualPriority": False, "aliases": ["杜如晦"]},
    "zhangsunwuji": {"score": 85, "visualPriority": False, "aliases": ["长孙无忌"]},
    "yaochong": {"score": 84, "visualPriority": False, "aliases": ["姚崇"]},
    "songjing": {"score": 82, "visualPriority": False, "aliases": ["宋璟"]},
    "zhangjiuling": {"score": 82, "visualPriority": False, "aliases": ["张九龄"]},
    "yangguifei": {"score": 85, "visualPriority": True, "aliases": ["杨贵妃", "杨玉环", "太真"]},
    "yangguozhong": {"score": 80, "visualPriority": False, "aliases": ["杨国忠"]},
    "gaolishi": {"score": 78, "visualPriority": False, "aliases": ["高力士"]},
    "shisiming": {"score": 85, "visualPriority": False, "aliases": ["史思明"]},
    "wangxianzhi": {"score": 80, "visualPriority": False, "aliases": ["王仙芝"]},
    "qinzhongquan": {"score": 78, "visualPriority": False, "aliases": ["秦宗权"]},
    "libai": {"score": 82, "visualPriority": True, "aliases": ["李白", "李太白", "太白"]},
    "dufu": {"score": 82, "visualPriority": True, "aliases": ["杜甫", "杜子美"]},
    "hanhu": {"score": 75, "visualPriority": False, "aliases": ["韩愈", "韩退之"]},
    "liuyuxi": {"score": 75, "visualPriority": False, "aliases": ["刘禹锡", "刘梦得"]},
    "baijuyi": {"score": 78, "visualPriority": False, "aliases": ["白居易", "白乐天"]},
    "lisan": {"score": 75, "visualPriority": False, "aliases": ["李绅"]},
    "duqiumu": {"score": 75, "visualPriority": False, "aliases": ["杜牧", "杜樊川"]},
}

# ============================================================
# 2. 自动分类函数
# ============================================================
def infer_category(role: str, current: str) -> str:
    r = role.lower()
    # 皇帝
    if "皇帝" in r:
        return "皇帝/皇室"
    # 后宫/女性
    if re.search(r"皇后|妃|昭仪|才人|嫔|美人|公主|女官|宫女|夫人|娘子", r):
        return "后宫/女性"
    # 宗教
    if re.search(r"僧|和尚|道士|法师|高僧|喇嘛|道|尼姑|教主|主教", r):
        return "宗教人物"
    # 宦官
    if re.search(r"宦官|太监|内侍|枢密使|神策军.*监|观军容使", r):
        return "宦官"
    # 可汗、番王等外族首领（非唐朝）
    if re.search(r"可汗|赞普|单于|酋长|首领|番王|土司", r) and not re.search(r"唐朝|唐", r):
        return "外族"
    # 外国太子/国王（百济太子等）
    if re.search(r"百济|新罗|高句丽|倭国|吐蕃|突厥|回鹘|契丹|奚|南诏|渤海", r) and re.search(r"太子|国王|可汗|赞普", r):
        return "外族"
    # 节度使/藩镇
    if re.search(r"节度使|留后|观察使|经略使|防御使|团练使|采访使", r):
        return "节度使/藩镇"
    # 叛乱称帝（非唐朝皇帝）
    if re.search(r"大[齐燕冀赵汉楚吴越秦]皇帝?|[楚秦梁许吴赵汉越]帝|皇帝", r) and "唐朝" not in r and "唐末代" not in r:
        return "叛乱势力"
    # 武将/将领
    if re.search(r"将军|将领|都尉|校尉|元帅|副元帅|大将军|都督|都护|行军|总管|行军司马|先锋|统帅", r):
        return "武将/将领"
    # 宰相/大臣
    if re.search(r"宰相|尚书|中书|侍中|侍郎|仆射|同中书|同平章|三品|大夫|御史|翰林|学士|谏议|给事中|员外郎", r):
        return "宰相/大臣"
    # 宗室/皇室成员（太子、亲王、郡王）且未被上面匹配
    if re.search(r"太子|亲王|郡王|国王|皇子|皇孙|宗室|驸马", r):
        return "皇帝/皇室"
    return current


def infer_subcategory(role: str, category: str) -> str:
    r = role.lower()
    # 太子相关官职不是皇室成员
    if re.search(r"太子中允|太子洗马|太子少保|太子少傅|太子太保|太子太傅|太子宾客", r):
        if re.search(r"尚书|中书|侍中|侍郎|仆射|同中书|同平章", r):
            return "大臣"
        return "大臣"
    if category == "皇帝/皇室":
        if "皇帝" in r:
            return "皇帝"
        if re.search(r"皇后|妃|昭仪|才人|嫔|美人|公主|女官", r):
            return "后宫"
        if re.search(r"太子", r):
            return "太子"
        if re.search(r"亲王|郡王|国王", r):
            return "亲王"
        if re.search(r"驸马", r):
            return "驸马"
        if re.search(r"宗室", r):
            return "宗室"
        return "皇室"
    if category == "后宫/女性":
        if "皇后" in r:
            return "皇后"
        if "妃" in r or "昭仪" in r or "才人" in r or "嫔" in r or "美人" in r:
            return "妃嫔"
        if "公主" in r:
            return "公主"
        return "女性"
    if category == "宰相/大臣":
        if re.search(r"宰相|同中书|同平章|侍中|中书令", r):
            return "宰相"
        if re.search(r"尚书|侍郎|仆射", r):
            return "尚书省"
        if re.search(r"御史|谏议|给事中", r):
            return "台谏"
        if re.search(r"翰林|学士", r):
            return "翰林"
        return "大臣"
    if category == "武将/将领":
        if re.search(r"元帅|大将军|都督|节度使", r):
            return "高级将领"
        return "将领"
    if category == "节度使/藩镇":
        return "节度使"
    if category == "文人":
        if re.search(r"诗人", r):
            return "诗人"
        return "文人"
    if category == "外族":
        if re.search(r"可汗", r):
            return "可汗"
        if re.search(r"赞普", r):
            return "赞普"
        return "外族首领"
    return ""


# ============================================================
# 3. 自动评分函数
# ============================================================
def base_score(category: str, mentions: int) -> int:
    """基于分类与出场次数给一个基础分（非皇帝人物）。"""
    ranges = {
        "皇帝/皇室": (70, 85),
        "宰相/大臣": (55, 80),
        "武将/将领": (55, 80),
        "节度使/藩镇": (50, 75),
        "后宫/女性": (50, 78),
        "文人": (50, 80),
        "叛乱势力": (55, 82),
        "外族": (45, 70),
        "宦官": (45, 72),
        "宗教人物": (35, 60),
        "其他": (30, 60),
    }
    lo, hi = ranges.get(category, (30, 60))
    # 在分类区间内按 mentions 对数映射
    import math
    factor = min(math.log10(max(mentions, 1) + 1) / math.log10(400), 1.0)
    return int(lo + (hi - lo) * factor)


# ============================================================
# 4. 处理每一个人物
# ============================================================
fixes = []

for c in characters:
    cid = c["id"]
    role = c.get("role", "")
    mentions = c.get("mentions", 0)
    current_cat = c.get("primaryCategory", c.get("category", "其他"))
    current_sub = c.get("subCategory", "")

    # 4.1 扩展字段默认值
    c.setdefault("canonicalName", c.get("name", ""))
    c.setdefault("displayName", c.get("name", ""))
    c.setdefault("personalName", c.get("name", ""))
    c.setdefault("templeName", "")
    c.setdefault("dynastyTitle", "")
    c.setdefault("reignTitle", "")
    c.setdefault("formerTitle", "")
    c.setdefault("aliases", [])
    c.setdefault("appearanceCount", mentions)
    c.setdefault("historicalImportanceScore", 0)
    c.setdefault("visualPriority", False)
    c.setdefault("subCategory", current_sub)

    # 确保 name 与 displayName 一致（兼容性）
    if c.get("displayName"):
        c["name"] = c["displayName"]

    # 4.2 皇帝元数据覆盖
    if cid in EMPEROR_META:
        meta = EMPEROR_META[cid]
        old_cat = c.get("primaryCategory", "")
        old_name = c.get("name", "")
        for k, v in meta.items():
            if k in ("score",):
                c["historicalImportanceScore"] = v
            elif k == "aliases":
                # 合并并去重，保留顺序
                existing = {a for a in c.get("aliases", [])}
                for a in v:
                    if a not in existing:
                        c["aliases"].append(a)
                        existing.add(a)
            else:
                c[k] = v
        c["visualPriority"] = True
        c["primaryCategory"] = "皇帝/皇室"
        c["category"] = "皇帝/皇室"
        # 武则天子类别为女皇/武周皇帝
        if cid == "wuzetian":
            c["subCategory"] = "女皇"
        else:
            c["subCategory"] = "皇帝"
        c["name"] = meta["displayName"]
        c["canonicalName"] = meta["canonicalName"]
        c["personalName"] = meta["personalName"]
        c["templeName"] = meta["templeName"]
        c["dynastyTitle"] = meta["dynastyTitle"]
        c["formerTitle"] = meta["formerTitle"]
        fixes.append({
            "id": cid,
            "oldName": old_name,
            "newName": meta["displayName"],
            "oldCategory": old_cat,
            "newCategory": "皇帝/皇室",
            "aliases": meta["aliases"],
            "score": meta["score"],
        })
        continue

    # 4.3 高分人物覆盖
    if cid in HIGH_PROFILE:
        hp = HIGH_PROFILE[cid]
        c["historicalImportanceScore"] = hp.get("score", base_score(current_cat, mentions))
        c["visualPriority"] = hp.get("visualPriority", False)
        existing = {a for a in c.get("aliases", [])}
        for a in hp.get("aliases", []):
            if a not in existing:
                c["aliases"].append(a)
                existing.add(a)
        continue

    # 4.4 其他人：自动分类与评分
    inferred = infer_category(role, current_cat)
    # 强制分类覆盖
    if cid in CATEGORY_OVERRIDES:
        inferred = CATEGORY_OVERRIDES[cid]
    # 公主、驸马归入皇室
    if cid in ROYAL_FEMALE_AND_CONSORT_IDS:
        inferred = "皇帝/皇室"
    if inferred != current_cat:
        c["primaryCategory"] = inferred
        c["category"] = inferred
    sub = infer_subcategory(role, inferred)
    if cid in ROYAL_FEMALE_AND_CONSORT_IDS:
        if "驸马" in role or "夫" in role:
            sub = "驸马"
        else:
            sub = "公主"
    c["subCategory"] = SUBCATEGORY_OVERRIDES.get(cid, sub)
    c["historicalImportanceScore"] = base_score(inferred, mentions)

# ============================================================
# 4.5 v0.2.1 分类、分数与子类别修正
# ============================================================
for c in characters:
    cid = c["id"]
    role = c.get("role", "")
    # 分类修正
    if cid in CLASSIFICATION_FIXES:
        new_cat = CLASSIFICATION_FIXES[cid]
        c["primaryCategory"] = new_cat
        c["category"] = new_cat
        c["subCategory"] = SUBCATEGORY_OVERRIDES_V021.get(cid, infer_subcategory(role, new_cat))
    # 分数修正
    if cid in SCORE_ADJUSTMENTS:
        c["historicalImportanceScore"] = SCORE_ADJUSTMENTS[cid]
    # 子类别统一覆盖（适用于已在正确分类中的人物）
    if cid in SUBCATEGORY_OVERRIDES_V021:
        c["subCategory"] = SUBCATEGORY_OVERRIDES_V021[cid]

# ============================================================
# 5. 清理皇帝/皇室中错分的非皇帝人物
#    皇帝/皇室中只允许：唐朝皇帝、宗室成员（太子/亲王/郡王/公主/驸马等）
# ============================================================
# 允许留在皇帝/皇室的角色关键词：唐朝皇帝、皇太子、亲王/郡王（唐朝宗室）、公主、皇后/妃嫔、驸马、宗室
allowed_keywords = re.compile(
    r"唐朝皇帝|皇太子|亲王|郡王|唐高祖|唐太宗|唐高宗|武则天|公主|皇后|妃|昭仪|才人|嫔|美人|女官|皇室|驸马|宗室|王爷"
)
# 明确不允许留在皇帝/皇室的角色关键词（官职或外族）
exclude_keywords = re.compile(
    r"太子中允|太子洗马|太子少保|太子少傅|太子太保|太子太傅|太子宾客|可汗|赞普|百济|新罗|高句丽|大[齐燕冀赵汉楚吴越秦]皇帝?|[楚秦梁许吴赵汉越]帝"
)
for c in characters:
    if c.get("primaryCategory") == "皇帝/皇室":
        role = c.get("role", "")
        cid = c["id"]
        # 如果是已标记的皇帝，或已明确归入皇室的公主/驸马，跳过
        if cid in EMPEROR_META or cid in ROYAL_FEMALE_AND_CONSORT_IDS:
            continue
        # 强制覆盖
        if cid in CATEGORY_OVERRIDES:
            new_cat = CATEGORY_OVERRIDES[cid]
            old_cat = c["primaryCategory"]
            c["primaryCategory"] = new_cat
            c["category"] = new_cat
            c["subCategory"] = SUBCATEGORY_OVERRIDES.get(cid, infer_subcategory(role, new_cat))
            c["historicalImportanceScore"] = base_score(new_cat, c.get("mentions", 0))
            fixes.append({
                "id": cid,
                "oldName": c.get("name", ""),
                "newName": c.get("displayName", c.get("name", "")),
                "oldCategory": old_cat,
                "newCategory": new_cat,
                "reason": "强制分类覆盖",
            })
            continue
        if exclude_keywords.search(role) or not allowed_keywords.search(role):
            new_cat = infer_category(role, "其他")
            old_cat = c["primaryCategory"]
            c["primaryCategory"] = new_cat
            c["category"] = new_cat
            c["subCategory"] = SUBCATEGORY_OVERRIDES.get(cid, infer_subcategory(role, new_cat))
            c["historicalImportanceScore"] = base_score(new_cat, c.get("mentions", 0))
            fixes.append({
                "id": cid,
                "oldName": c.get("name", ""),
                "newName": c.get("displayName", c.get("name", "")),
                "oldCategory": old_cat,
                "newCategory": new_cat,
                "reason": "role 不含皇帝/宗室/后宫关键词或为外族/官职，从皇帝/皇室移出",
            })

# ============================================================
# 5.5 v0.2.1 为前 100 名人物生成 impactStatement
# ============================================================
def get_period_label(c):
    period = c.get("period", "")
    if "初唐" in period or "唐初" in period:
        return "初唐"
    if "盛唐" in period:
        return "盛唐"
    if "中唐" in period:
        return "中唐"
    if "晚唐" in period:
        return "晚唐"
    return "唐代"


def pick_event_tags(c, max_n=2):
    events = c.get("events", [])
    tags = []
    for e in events:
        # 过滤过长的标签，取关键短词
        if len(e) <= 12:
            tags.append(e)
        if len(tags) >= max_n:
            break
    return tags


def generate_impact_statement(c):
    if c.get("impactStatement"):
        return c["impactStatement"]
    cid = c["id"]
    if cid in CORE_IMPACT_STATEMENTS:
        return CORE_IMPACT_STATEMENTS[cid]

    name = c.get("displayName") or c.get("name", "")
    cat = c.get("primaryCategory", "其他")
    sub = c.get("subCategory", "")
    role = c.get("role", "")
    dynasty = c.get("dynastyTitle", "")
    tags = pick_event_tags(c, 2)
    tag_text = "、".join(tags) if tags else "相关史事"
    period = get_period_label(c)

    if cat == "皇帝/皇室":
        if sub == "女皇":
            return f"{name}以武周政权深刻改变了唐代政治与权力结构，是中国历史上极具影响力的女性统治者。"
        if dynasty:
            return f"{dynasty}是{period}的重要帝王，{tag_text}对其时代政治格局产生深远影响。"
        return f"{name}是{period}皇室核心人物，{tag_text}深刻影响了宫廷政治走向。"

    if cat == "宰相/大臣":
        return f"{name}是{period}重要政治家，{tag_text}中发挥了关键作用，深刻影响了朝政走向。"

    if cat == "武将/将领":
        return f"{name}是{period}著名军事将领，{tag_text}中展现军事才能，对边疆与战事产生重要影响。"

    if cat == "文人":
        if "诗人" in sub or "诗" in role:
            return f"{name}是{period}著名诗人，其诗歌创作在文学史上留下深刻印记，影响了后世文学风貌。"
        return f"{name}是{period}著名文学家，{tag_text}体现了其文化影响力。"

    if cat == "后宫/女性":
        if sub == "宫廷女官":
            return f"{name}是{period}宫廷女官代表，{tag_text}中在政治与文学层面均有重要影响。"
        return f"{name}是{period}宫廷重要女性人物，{tag_text}深刻影响了宫廷权力格局。"

    if cat == "节度使/藩镇":
        return f"{name}是{period}重要藩镇势力代表，{tag_text}对中晚唐藩镇格局产生重要影响。"

    if cat == "叛乱势力":
        return f"{name}是{period}重要反叛势力领袖，{tag_text}直接冲击了唐朝统治秩序。"

    if cat == "宦官":
        return f"{name}是{period}权宦代表，{tag_text}中深刻影响了宫廷政治与皇权运作。"

    if cat == "宗教人物":
        return f"{name}是{period}重要宗教人物，{tag_text}对佛教传播与文化交流产生深远影响。"

    if cat == "外族":
        return f"{name}是{period}边疆重要人物，{tag_text}对唐王朝边疆局势产生重要影响。"

    if cat == "其他" and sub == "酷吏":
        return f"{name}是{period}著名酷吏，{tag_text}在当时的政治生态中留下深刻印记。"

    return f"{name}是{period}历史上具有代表性的人物，{tag_text}在当时产生了重要影响。"


# 只对历史影响榜前 100 名生成
top100_ids = {
    c["id"]
    for c in sorted(
        [c for c in characters if (c.get("historicalImportanceScore") or 0) > 0],
        key=lambda x: x.get("historicalImportanceScore", 0),
        reverse=True,
    )[:100]
}
for c in characters:
    if c["id"] in top100_ids:
        c["impactStatement"] = generate_impact_statement(c)

# ============================================================
# 6. 保存修改后的数据
# ============================================================
with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# ============================================================
# 7. 生成审计报告
# ============================================================
from collections import Counter

categories = Counter(c["primaryCategory"] for c in characters)
score_distribution = Counter()
for c in characters:
    s = c.get("historicalImportanceScore", 0)
    bucket = f"{s // 10 * 10}-{s // 10 * 10 + 9}"
    score_distribution[bucket] += 1

imperial_chars = [c for c in characters if c["primaryCategory"] == "皇帝/皇室"]

audit_lines = [
    "# 唐局人物数据审查报告",
    "",
    "## 一、数据总体情况",
    "",
    f"- 总人物数：**{len(characters)}**",
    f"- 已扩展字段：canonicalName、displayName、personalName、templeName、dynastyTitle、reignTitle、formerTitle、aliases、appearanceCount、historicalImportanceScore、visualPriority、subCategory",
    "",
    "## 二、分类分布（修正后）",
    "",
]
for cat, count in categories.most_common():
    audit_lines.append(f"- {cat}：{count} 人")

audit_lines.extend([
    "",
    "## 三、历史影响力评分分布",
    "",
])
for bucket in sorted(score_distribution.keys(), key=lambda x: int(x.split("-")[0])):
    audit_lines.append(f"- {bucket} 分：{score_distribution[bucket]} 人")

audit_lines.extend([
    "",
    "## 四、皇帝/皇室人物清单",
    "",
])
for c in sorted(imperial_chars, key=lambda x: x.get("historicalImportanceScore", 0), reverse=True):
    audit_lines.append(
        f"- **{c.get('displayName', c.get('name', ''))}**（{c.get('role')}）："
        f"score={c.get('historicalImportanceScore')}，subCategory={c.get('subCategory')}，"
        f"aliases={c.get('aliases', [])}"
    )

audit_lines.extend([
    "",
    "## 五、重要修正说明",
    "",
    "1. 李世民：由『外族』修正为『皇帝/皇室』。",
    "2. 李隆基：由『其他』修正为『皇帝/皇室』。",
    "3. 武则天：由『后宫/女性』修正为『皇帝/皇室』（女皇/武周皇帝）。",
    "4. 李治：未新增独立条目，将原『高宗』条目的 canonicalName 设为『李治』，displayName 设为『李治』，aliases 包含『高宗』『唐高宗』『晋王』。",
    "5. 李显、李旦、李亨、李豫、李适、李诵、李纯、李恒、李湛、李昂、李炎、李忱、李漼、李儇、李晔、李柷 等皇帝均补充 canonicalName 与 aliases。",
    "6. 唐哀帝即原『昭宣帝』条目，补充 aliases 『李柷』『哀帝』『唐哀帝』『辉王』。",
    "7. 将皇帝/皇室分类中 role 不含皇帝/宗室/后宫关键词的人物按 role 重新分类。",
    "",
    "## 六、别名搜索覆盖",
    "",
    "搜索人物时，将同时检索：name、displayName、canonicalName、templeName、dynastyTitle、formerTitle、aliases。",
    "",
    "验证示例：",
    "- 李世民 ← 可搜『李世民』『太宗』『唐太宗』『秦王』",
    "- 李隆基 ← 可搜『李隆基』『玄宗』『唐玄宗』『明皇』",
    "- 李治 ← 可搜『李治』『高宗』『唐高宗』",
    "",
])

with open(AUDIT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(audit_lines))

# ============================================================
# 8. 生成皇帝/皇室修正清单 JSON
# ============================================================
imperial_fix = {
    "emperorMeta": EMPEROR_META,
    "categoryFixes": [f for f in fixes if f.get("reason") or f.get("id") in EMPEROR_META],
    "highPriorityNonEmperors": HIGH_PROFILE,
}
with open(FIX_FILE, "w", encoding="utf-8") as f:
    json.dump(imperial_fix, f, ensure_ascii=False, indent=2)

print("处理完成：")
print(f"- 输出文件：{OUT_FILE}")
print(f"- 审计报告：{AUDIT_FILE}")
print(f"- 修正清单：{FIX_FILE}")
print(f"- 皇帝/皇室人物数：{len(imperial_chars)}")
print(f"- 总人物数：{len(characters)}")
