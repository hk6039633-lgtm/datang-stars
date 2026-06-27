import type { Character, HistoricalEvent, BookTimelineEvent } from "../types";

export type RelationType = "royal" | "minister" | "military" | "conflict" | "culture" | "event";

export const RELATION_COLORS: Record<RelationType, string> = {
  royal: "#d4af37", // 金色：皇权/血缘
  minister: "#6b8fa3", // 蓝灰：文臣/辅佐
  military: "#b87348", // 铜金：武将/功臣
  conflict: "#9b3b3b", // 暗红：冲突/政敌
  culture: "#a8c4c0", // 青白：文人/文化
  event: "#c78d4a", // 橙金：事件共现
};

export interface GalaxyMeta {
  id: string;
  name: string;
  desc: string;
  categories: string[];
  representativeIds: string[];
  accent: string;
  // 星系在总览星图中的归一化位置（原点为视觉中心，范围约 -1 ~ 1）
  layout: { x: number; y: number; layer: number };
}

export const GALAXIES: GalaxyMeta[] = [
  {
    id: "imperial",
    name: "皇权中枢",
    desc: "大唐帝系与皇权核心，从高祖李渊到末代昭宗的皇权传承与帝位之争。",
    categories: ["皇帝/皇室"],
    representativeIds: ["lishimin", "wuzetian", "liyuan", "gaozong", "lilongji"],
    accent: "#d4af37",
    layout: { x: 0, y: 0, layer: 0 },
  },
  {
    id: "royal",
    name: "宗室皇亲",
    desc: "李唐宗室、公主、皇子与后宫核心人物，围绕皇权展开的宗室网络。",
    categories: ["皇帝/皇室", "后宫/女性"],
    representativeIds: ["taipinggongzhu", "shangguanwaner", "yangguifei"],
    accent: "#c9a86c",
    layout: { x: 0.28, y: -0.16, layer: 1 },
  },
  {
    id: "ministers",
    name: "宰辅文官",
    desc: "贞观名相、开元贤相与天宝权相，支撑大唐行政中枢的文官集团。",
    categories: ["宰相/大臣"],
    representativeIds: ["fangxuanling", "weizheng", "lilinfu", "limi-2"],
    accent: "#6b8fa3",
    layout: { x: 0.34, y: 0.1, layer: 1 },
  },
  {
    id: "court",
    name: "宫廷内廷",
    desc: "宦官、内侍与后宫女官，深居宫廷权力暗流中的关键角色。",
    categories: ["宦官", "后宫/女性"],
    representativeIds: ["gaolishi"],
    accent: "#8b7da0",
    layout: { x: 0.18, y: 0.3, layer: 2 },
  },
  {
    id: "military",
    name: "武将功臣",
    desc: "凌烟阁功臣、平定边疆的名将与再造唐室的中兴将帅。",
    categories: ["武将/将领"],
    representativeIds: ["lijing", "yuchigong", "qinshubao", "guoziyi"],
    accent: "#b87348",
    layout: { x: -0.2, y: 0.24, layer: 1 },
  },
  {
    id: "jiedushi",
    name: "藩镇节度",
    desc: "割据一方的节度使与藩镇势力，中后期影响唐廷安危的地方军阀。",
    categories: ["节度使/藩镇"],
    representativeIds: [],
    accent: "#a66e3e",
    layout: { x: -0.34, y: -0.06, layer: 2 },
  },
  {
    id: "rebel",
    name: "叛乱势力",
    desc: "动摇大唐根基的叛乱者，从安史之乱到黄巢起义的反抗力量。",
    categories: ["叛乱势力"],
    representativeIds: ["anlushan", "huangchao", "zhuwen"],
    accent: "#8a4b4b",
    layout: { x: -0.26, y: 0.34, layer: 2 },
  },
  {
    id: "literati",
    name: "文人诗坛",
    desc: "盛唐诗人群体与古文运动领袖，以诗笔书写大唐气象。",
    categories: ["文人"],
    representativeIds: ["libai", "dufu"],
    accent: "#8fb5a8",
    layout: { x: 0.24, y: -0.36, layer: 3 },
  },
  {
    id: "frontier",
    name: "边疆外部",
    desc: "突厥、吐蕃、回纥等外族势力与边疆交涉中的关键人物。",
    categories: ["外族"],
    representativeIds: [],
    accent: "#6b8fa3",
    layout: { x: -0.38, y: -0.24, layer: 3 },
  },
  {
    id: "others",
    name: "方外宗教 / 其他人物",
    desc: "宗教人物、隐士、僧道与难以归入主流分类的其他人物。",
    categories: ["宗教人物", "其他"],
    representativeIds: [],
    accent: "#9a9a6e",
    layout: { x: 0.32, y: 0.38, layer: 3 },
  },
];

// 人工核心关系映射（带关系类型与语义标签）
const CORE_RELATIONS: Record<string, Array<{ id: string; type: RelationType; label?: string }>> = {
  lishimin: [
    { id: "liyuan", type: "royal", label: "父子" },
    { id: "gaozong", type: "royal", label: "父子" },
    { id: "wuzetian", type: "event", label: "后续影响" },
    { id: "zhangsunwuji", type: "minister", label: "辅佐" },
    { id: "fangxuanling", type: "minister", label: "辅佐" },
    { id: "duruhui", type: "minister", label: "辅佐" },
    { id: "weizheng", type: "minister", label: "辅佐" },
    { id: "yuchigong", type: "military", label: "功臣" },
    { id: "qinshubao", type: "military", label: "功臣" },
    { id: "lijing", type: "military", label: "功臣" },
    { id: "lijiancheng", type: "conflict", label: "兄弟/政敌" },
  ],
  gaozong: [
    { id: "lishimin", type: "royal", label: "父子" },
    { id: "wuzetian", type: "royal", label: "夫妻" },
    { id: "shangguanwaner", type: "minister", label: "重用" },
  ],
  wuzetian: [
    { id: "lishimin", type: "event", label: "后续影响" },
    { id: "gaozong", type: "royal", label: "夫妻" },
    { id: "shangguanwaner", type: "minister", label: "重用" },
    { id: "taipinggongzhu", type: "royal", label: "母女" },
  ],
  taipinggongzhu: [
    { id: "wuzetian", type: "royal", label: "母女" },
    { id: "gaozong", type: "royal", label: "兄妹" },
    { id: "lishimin", type: "royal", label: "父女" },
  ],
  shangguanwaner: [
    { id: "wuzetian", type: "minister", label: "重用" },
    { id: "taipinggongzhu", type: "royal", label: "政交" },
  ],
  lilinfu: [
    { id: "lilongji", type: "minister", label: "辅佐" },
    { id: "yangguifei", type: "royal", label: "举荐" },
  ],
  yangguifei: [
    { id: "lilongji", type: "royal", label: "夫妻" },
    { id: "anlushan", type: "conflict", label: "政争" },
  ],
  anlushan: [
    { id: "lilongji", type: "conflict", label: "叛乱" },
    { id: "yangguifei", type: "conflict", label: "政争" },
  ],
  gaolishi: [{ id: "lilongji", type: "minister", label: "辅佐" }],
  zhuwen: [{ id: "huangchao", type: "conflict", label: "政敌" }],
};

function normalizeName(s: string) {
  return s.trim().replace(/\s+/g, "");
}

function nameToIdMap(characters: Character[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of characters) {
    map.set(normalizeName(c.name), c.id);
    for (const alias of c.aliases || []) {
      const key = normalizeName(alias);
      if (!map.has(key)) map.set(key, c.id);
    }
  }
  return map;
}

function inferRelationType(a: Character, b: Character): RelationType {
  const cats = [a.primaryCategory, b.primaryCategory];
  if (cats.includes("叛乱势力")) return "conflict";
  if (cats.every((c) => c === "皇帝/皇室" || c === "后宫/女性")) return "royal";
  if (cats.includes("文人")) return "culture";
  if (cats.includes("宰相/大臣") || cats.includes("宦官")) return "minister";
  if (cats.includes("武将/将领")) return "military";
  return "event";
}

export interface CharacterEdge {
  target: string;
  type: RelationType;
  weight: number;
  label?: string;
}

export function buildCharacterEdges(
  characters: Character[],
  events: HistoricalEvent[],
  bookEvents: BookTimelineEvent[]
): Map<string, Map<string, CharacterEdge>> {
  const map = new Map<string, Map<string, CharacterEdge>>();
  const charMap = new Map(characters.map((c) => [c.id, c]));

  const ensure = (a: string, b: string, type: RelationType, weight: number, label?: string) => {
    if (!map.has(a)) map.set(a, new Map());
    const inner = map.get(a)!;
    const existing = inner.get(b);
    if (existing) {
      existing.weight += weight;
      // 人工映射的优先级更高
      if (weight >= 3) {
        existing.type = type;
        if (label) existing.label = label;
      }
    } else {
      inner.set(b, { target: b, type, weight, label });
    }
  };

  // 人工核心关系
  for (const [id, related] of Object.entries(CORE_RELATIONS)) {
    const src = charMap.get(id);
    if (!src) continue;
    for (const r of related) {
      const tgt = charMap.get(r.id);
      if (!tgt) continue;
      ensure(id, r.id, r.type, 5, r.label);
      ensure(r.id, id, r.type, 5, r.label);
    }
  }

  // 事件共现
  for (const evt of events) {
    const ids = evt.characters.map((c) => c.id).filter(Boolean) as string[];
    for (let i = 0; i < ids.length; i++) {
      const a = charMap.get(ids[i]);
      if (!a) continue;
      for (let j = i + 1; j < ids.length; j++) {
        const b = charMap.get(ids[j]);
        if (!b) continue;
        const type = inferRelationType(a, b);
        ensure(ids[i], ids[j], type, 1);
        ensure(ids[j], ids[i], type, 1);
      }
    }
  }

  // 年表共现
  const nameMap = nameToIdMap(characters);
  for (const evt of bookEvents) {
    const ids: string[] = [];
    for (const name of evt.people) {
      const id = nameMap.get(normalizeName(name));
      if (id && !ids.includes(id)) ids.push(id);
    }
    for (let i = 0; i < ids.length; i++) {
      const a = charMap.get(ids[i]);
      if (!a) continue;
      for (let j = i + 1; j < ids.length; j++) {
        const b = charMap.get(ids[j]);
        if (!b) continue;
        const type = inferRelationType(a, b);
        ensure(ids[i], ids[j], type, 1);
        ensure(ids[j], ids[i], type, 1);
      }
    }
  }

  return map;
}

export function getRepresentatives(galaxy: GalaxyMeta, characters: Character[]): Character[] {
  const idSet = new Set(galaxy.representativeIds);
  const explicit = galaxy.representativeIds
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean) as Character[];

  if (explicit.length >= 5) return explicit.slice(0, 10);

  const rest = characters
    .filter((c) => galaxy.categories.includes(c.primaryCategory) && !idSet.has(c.id))
    .sort((a, b) => (b.historicalImportanceScore ?? 0) - (a.historicalImportanceScore ?? 0))
    .slice(0, 10 - explicit.length);

  return [...explicit, ...rest];
}

export function getNeighbors(
  characterId: string,
  edges: Map<string, Map<string, CharacterEdge>>,
  characters: Character[],
  limit = 14
): CharacterEdge[] {
  const inner = edges.get(characterId);
  if (!inner) return [];
  const charMap = new Map(characters.map((c) => [c.id, c]));
  return Array.from(inner.values())
    .filter((e) => charMap.has(e.target))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

export function getEdge(
  sourceId: string,
  targetId: string,
  edges: Map<string, Map<string, CharacterEdge>>
): CharacterEdge | undefined {
  return edges.get(sourceId)?.get(targetId);
}

export function getRelationLabel(
  sourceId: string,
  targetId: string,
  edges: Map<string, Map<string, CharacterEdge>>
): string | undefined {
  const edge = getEdge(sourceId, targetId, edges);
  if (!edge) return undefined;
  if (edge.label) return edge.label;
  const labels: Record<RelationType, string> = {
    royal: "血缘/皇室",
    minister: "君臣/辅佐",
    military: "武将/功臣",
    conflict: "冲突/政敌",
    culture: "文脉/文化",
    event: "事件共现",
  };
  return labels[edge.type];
}

export function getGalaxyRelatedEvents(
  galaxy: GalaxyMeta,
  characters: Character[],
  events: HistoricalEvent[],
  limit = 6
): HistoricalEvent[] {
  const ids = new Set(
    characters.filter((c) => galaxy.categories.includes(c.primaryCategory)).map((c) => c.id)
  );
  return events
    .map((evt) => {
      const hit = evt.characters.filter((c) => c.id && ids.has(c.id)).length;
      return { evt, hit };
    })
    .filter((x) => x.hit > 0)
    .sort((a, b) => b.hit - a.hit || b.evt.title.length - a.evt.title.length)
    .slice(0, limit)
    .map((x) => x.evt);
}

export function getGalaxyByCharacter(char: Character): GalaxyMeta | undefined {
  return GALAXIES.find((g) => g.categories.includes(char.primaryCategory));
}
