import type { Character, HistoricalEvent, BookTimelineEvent, HistoricalEventCharacter } from "../types";
import { matchCharacterSearch } from "./search";

export interface GraphNode {
  id: string;
  name: string;
  value: number;
  category: string;
  symbolSize: number;
  labelShow?: boolean;
  x?: number;
  y?: number;
  raw: Character | HistoricalEvent | BookTimelineEvent | null;
  nodeType: "character" | "event" | "clusterLabel" | "categoryHub";
  fixed?: boolean;
  silent?: boolean;
  label?: any;
  itemStyle?: any;
  emphasis?: any;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number;
  linkType?: "hub" | "relation";
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  categories: { name: string }[];
}

const CATEGORY_ORDER = [
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
];

// 分类星团中心坐标（画布 1000 x 760）
export const CATEGORY_CENTERS: Record<string, { x: number; y: number }> = {
  "皇帝/皇室": { x: 180, y: 140 },
  "宰相/大臣": { x: 500, y: 140 },
  "武将/将领": { x: 820, y: 140 },
  "节度使/藩镇": { x: 180, y: 360 },
  "宦官": { x: 500, y: 360 },
  "后宫/女性": { x: 820, y: 360 },
  "外族": { x: 180, y: 580 },
  "文人": { x: 500, y: 580 },
  "叛乱势力": { x: 820, y: 580 },
  "宗教人物": { x: 340, y: 720 },
  "其他": { x: 660, y: 720 },
};

// 唐风神经网络：分类中枢
const CATEGORY_HUBS: Record<
  string,
  { id: string; name: string; categories: string[]; x: number; y: number }
> = {
  "皇权中枢": { id: "hub-royal", name: "皇权中枢", categories: ["皇帝/皇室"], x: 500, y: 260 },
  "宰辅集团": { id: "hub-minister", name: "宰辅集团", categories: ["宰相/大臣"], x: 680, y: 200 },
  "宫廷内廷": { id: "hub-court", name: "宫廷内廷", categories: ["后宫/女性", "宦官"], x: 640, y: 340 },
  "军事将领": { id: "hub-military", name: "军事将领", categories: ["武将/将领"], x: 320, y: 380 },
  "藩镇势力": { id: "hub-fanzhen", name: "藩镇势力", categories: ["节度使/藩镇"], x: 740, y: 460 },
  "叛乱势力": { id: "hub-rebel", name: "叛乱势力", categories: ["叛乱势力"], x: 820, y: 620 },
  "文人诗坛": { id: "hub-literati", name: "文人诗坛", categories: ["文人"], x: 200, y: 560 },
  "边疆外部": { id: "hub-foreign", name: "边疆外部", categories: ["外族"], x: 820, y: 300 },
  "方外宗教": { id: "hub-religion", name: "方外宗教", categories: ["宗教人物"], x: 280, y: 680 },
  "其他人物": { id: "hub-other", name: "其他人物", categories: ["其他"], x: 520, y: 680 },
};

// 原始分类 -> 中枢名称映射
const CATEGORY_TO_HUB: Record<string, string> = {
  "皇帝/皇室": "皇权中枢",
  "宰相/大臣": "宰辅集团",
  "武将/将领": "军事将领",
  "节度使/藩镇": "藩镇势力",
  "宦官": "宫廷内廷",
  "后宫/女性": "宫廷内廷",
  "外族": "边疆外部",
  "文人": "文人诗坛",
  "叛乱势力": "叛乱势力",
  "宗教人物": "方外宗教",
  "其他": "其他人物",
};

const MAX_RELATION_EDGES: Record<number, number> = {
  30: 30,
  60: 60,
  80: 80,
  100: 100,
};

export function getCategories() {
  return CATEGORY_ORDER.map((name) => ({ name }));
}

function charNode(c: Character, options?: { labelShow?: boolean; x?: number; y?: number }): GraphNode {
  return {
    id: c.id,
    name: c.name,
    value: c.mentions,
    category: c.primaryCategory || "其他",
    symbolSize: calcPersonSymbolSize(c.mentions),
    labelShow: options?.labelShow ?? c.mentions >= 40,
    x: options?.x,
    y: options?.y,
    raw: c,
    nodeType: "character",
  };
}

function eventNode(evt: HistoricalEvent | BookTimelineEvent, options?: { x?: number; y?: number; shortTitle?: string }): GraphNode {
  return {
    id: `evt-${evt.id}`,
    name: options?.shortTitle || ("title" in evt ? evt.title : (evt as any).title),
    value: ("characters" in evt ? (evt as HistoricalEvent).characters.length : (evt as BookTimelineEvent).people.length) || 1,
    category: "事件",
    symbolSize: 38,
    labelShow: true,
    x: options?.x,
    y: options?.y,
    raw: evt,
    nodeType: "event",
  };
}

function clusterLabelNode(cat: string, center: { x: number; y: number }): GraphNode {
  return {
    id: `cluster-${cat.replace(/\//g, "")}`,
    name: cat,
    value: 0,
    category: cat,
    symbolSize: 1,
    x: center.x,
    y: center.y - 80,
    raw: null,
    nodeType: "clusterLabel",
    fixed: true,
    silent: true,
    label: {
      show: true,
      formatter: cat,
      fontSize: 20,
      color: "rgba(120, 62, 20, 0.34)",
      fontWeight: "bold",
    },
    itemStyle: { opacity: 0 },
    emphasis: { disabled: true },
  };
}

function categoryHubNode(hub: (typeof CATEGORY_HUBS)[string]): GraphNode {
  return {
    id: hub.id,
    name: hub.name,
    value: 0,
    category: hub.categories[0],
    symbolSize: 32,
    x: hub.x,
    y: hub.y,
    raw: null,
    nodeType: "categoryHub",
    fixed: true,
    silent: true,
    label: {
      show: true,
      formatter: hub.name,
      fontSize: 13,
      color: "rgba(120, 62, 20, 0.52)",
      fontWeight: 700,
      position: "inside",
    },
    itemStyle: {
      color: "rgba(180, 130, 60, 0.06)",
      borderColor: "rgba(150, 110, 40, 0.42)",
      borderWidth: 1.2,
      opacity: 1,
      shadowBlur: 0,
      shadowColor: "rgba(201, 162, 39, 0.3)",
    },
    emphasis: {
      disabled: false,
      itemStyle: {
        color: "rgba(201, 162, 39, 0.14)",
        borderColor: "rgba(201, 162, 39, 0.65)",
        borderWidth: 1.6,
        shadowBlur: 14,
        shadowColor: "rgba(201, 162, 39, 0.35)",
      },
      label: { color: "rgba(120, 62, 20, 0.7)" },
    },
  };
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function scatterAround(center: { x: number; y: number }, seed: number, radius: number = 90) {
  const r = seededRandom(seed) * radius + 20;
  const theta = seededRandom(seed + 1) * Math.PI * 2;
  return {
    x: center.x + r * Math.cos(theta),
    y: center.y + r * Math.sin(theta),
  };
}

function calcSymbolSize(mentions: number) {
  return Math.max(16, Math.min(64, 14 + mentions / 5));
}

function calcPersonSymbolSize(mentions: number) {
  return Math.max(7, Math.min(22, 8 + mentions / 32));
}

/** 生成人物强关联边 */
function buildRelationEdges(
  characters: Character[],
  events: HistoricalEvent[],
  bookEvents: BookTimelineEvent[],
  maxEdges: number
): GraphLink[] {
  const charIds = new Set(characters.map((c) => c.id));
  const weights = new Map<string, number>();

  function addEdge(id1: string | undefined, id2: string | undefined, weight: number) {
    if (!id1 || !id2 || id1 === id2) return;
    if (!charIds.has(id1) || !charIds.has(id2)) return;
    const key = [id1, id2].sort().join("|");
    weights.set(key, (weights.get(key) || 0) + weight);
  }

  events.forEach((evt) => {
    const ids = evt.characters.map((ch) => ch.id).filter(Boolean) as string[];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        addEdge(ids[i], ids[j], 3);
      }
    }
  });

  bookEvents.forEach((evt) => {
    const ids = evt.people
      .map((name) => characters.find((c) => c.name === name)?.id)
      .filter(Boolean) as string[];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        addEdge(ids[i], ids[j], 1);
      }
    }
  });

  return Array.from(weights.entries())
    .map(([key, value]) => {
      const [source, target] = key.split("|");
      return { source, target, value, linkType: "relation" as const };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, maxEdges);
}

/** 模式一：唐风神经网络式核心人物星图 */
export function buildStarGraph(
  characters: Character[],
  events: HistoricalEvent[],
  bookEvents: BookTimelineEvent[],
  options: { limit?: number; category?: string; search?: string } = {}
): GraphData {
  let list = [...characters];

  if (options.search?.trim()) {
    const q = options.search.trim();
    list = list.filter((c) => matchCharacterSearch(c, q));
  }

  if (options.category && options.category !== "全部") {
    list = list.filter((c) => c.primaryCategory === options.category);
  }

  list = list.sort((a, b) => b.mentions - a.mentions).slice(0, options.limit || 80);
  const limit = options.limit || 80;
  const maxRelationEdges = MAX_RELATION_EDGES[limit] || 140;

  // 人物节点围绕 categoryHub 分布
  const nodes: GraphNode[] = [];
  let seed = 1;

  // 按 hub 分组
  const hubGroups = new Map<string, Character[]>();
  list.forEach((c) => {
    const hubName = CATEGORY_TO_HUB[c.primaryCategory || "其他"];
    if (!hubGroups.has(hubName)) hubGroups.set(hubName, []);
    hubGroups.get(hubName)!.push(c);
  });

  hubGroups.forEach((chars, hubName) => {
    const hub = CATEGORY_HUBS[hubName];
    if (!hub) return;

    const count = chars.length;
    const maxMentions = Math.max(...chars.map((c) => c.mentions));

    chars.forEach((c, i) => {
      // 高频人物更靠近 hub，低频人物散开
      const t = maxMentions === 0 ? 0.5 : c.mentions / maxMentions;
      const radius = 50 + (1 - t) * 130 + Math.min(count * 2, 40);
      const angle = seededRandom(seed) * Math.PI * 2;
      const jitterR = (seededRandom(seed + 1) - 0.5) * 30;
      const jitterA = (seededRandom(seed + 2) - 0.5) * 0.4;
      const r = Math.max(28, radius + jitterR);

      nodes.push(
        charNode(c, {
          x: hub.x + r * Math.cos(angle + jitterA),
          y: hub.y + r * Math.sin(angle + jitterA),
          labelShow: c.mentions >= 40,
        })
      );
      seed += 3;
    });
  });

  // 添加 categoryHub 节点
  Object.values(CATEGORY_HUBS).forEach((hub) => {
    // 如果该 hub 下没有人物，则不显示（避免空中枢）
    if (hubGroups.has(hub.name)) {
      nodes.push(categoryHubNode(hub));
    }
  });

  // 人物到 categoryHub 的基础线
  const links: GraphLink[] = [];
  list.forEach((c) => {
    const hubName = CATEGORY_TO_HUB[c.primaryCategory || "其他"];
    const hub = CATEGORY_HUBS[hubName];
    if (hub) {
      links.push({ source: c.id, target: hub.id, value: 1, linkType: "hub" });
    }
  });

  // 人物强关联线
  const relationEdges = buildRelationEdges(list, events, bookEvents, maxRelationEdges);
  links.push(...relationEdges);

  const categories = getCategories();
  categories.push({ name: "事件" });

  return { nodes, links, categories };
}

/** 模式二：事件局势图（使用 book_timeline 增强） */
export function buildEventGraph(
  characters: Character[],
  event: HistoricalEvent,
  bookEvents: BookTimelineEvent[]
): GraphData {
  const charMap = new Map(characters.map((c) => [c.id, c]));

  // 收集 book_timeline 中相关事件的 people
  const relatedBookPeople = new Set<string>();

  bookEvents
    .filter((b) => b.importance >= 3)
    .forEach((b) => {
      let matched = false;
      // 标题相近
      if (event.title && b.title && (b.title.includes(event.title) || event.title.includes(b.title))) {
        matched = true;
      }
      // summary 明确提及事件完整标题或核心关键词（≥3 字），避免按历史阶段泛化匹配
      const coreKeywords = event.title.split(/[\s，、；]/).filter((k) => k.length >= 3);
      if (coreKeywords.some((k) => b.summary.includes(k))) {
        matched = true;
      }

      if (matched) {
        b.people.forEach((p) => relatedBookPeople.add(p));
      }
    });

  // 通过姓名匹配 book 人物到 characters
  const nameToChar = new Map<string, Character>();
  characters.forEach((c) => {
    if (!nameToChar.has(c.name)) nameToChar.set(c.name, c);
  });

  // events.json 中的原始人物（id 缺失时通过姓名兜底匹配）
  const basePeopleIds = new Set<string>();
  event.characters.forEach((ch: HistoricalEventCharacter) => {
    if (ch.id) {
      basePeopleIds.add(ch.id);
    } else {
      const c = nameToChar.get(ch.name);
      if (c) basePeopleIds.add(c.id);
    }
  });

  const mergedCharIds = new Set<string>(basePeopleIds);
  relatedBookPeople.forEach((name) => {
    const c = nameToChar.get(name);
    if (c) mergedCharIds.add(c.id);
  });

  // 只保留该事件真实关联的人物，不自动补人
  const finalChars = Array.from(mergedCharIds)
    .map((id) => charMap.get(id))
    .filter((c): c is Character => Boolean(c))
    .sort((a, b) => b.mentions - a.mentions);

  // 事件节点居中，尺寸克制
  const nodes: GraphNode[] = [
    eventNode(event, { x: 500, y: 380 }),
  ];
  // 调整事件节点尺寸
  nodes[0].symbolSize = 34;

  const links: GraphLink[] = [];
  const centerX = 500;
  const centerY = 380;
  const count = finalChars.length;

  // 按类型/阵营分区：方向向量 + 散布
  const categoryDirections: Record<string, { dx: number; dy: number; spread: number }> = {
    "皇帝/皇室": { dx: -0.55, dy: -0.83, spread: 0.55 },
    "宰相/大臣": { dx: -0.35, dy: -0.94, spread: 0.6 },
    "武将/将领": { dx: -0.75, dy: 0.66, spread: 0.55 },
    "节度使/藩镇": { dx: 0.8, dy: 0.55, spread: 0.55 },
    "叛乱势力": { dx: 0.92, dy: 0.39, spread: 0.5 },
    "后宫/女性": { dx: 0.6, dy: -0.8, spread: 0.5 },
    "宦官": { dx: 0.45, dy: -0.89, spread: 0.5 },
    "文人": { dx: -0.1, dy: 0.99, spread: 0.6 },
    "外族": { dx: 0.75, dy: -0.66, spread: 0.55 },
    "其他": { dx: -0.25, dy: 0.97, spread: 0.7 },
    "宗教人物": { dx: 0.25, dy: 0.97, spread: 0.7 },
  };

  const grouped = new Map<string, Character[]>();
  finalChars.forEach((c) => {
    const cat = c.primaryCategory || "其他";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(c);
  });

  let seed = 1;

  // 人物较少时使用紧凑环形/半圆布局
  if (count <= 6) {
    const radius = count <= 3 ? 100 : count <= 5 ? 125 : 140;
    finalChars.forEach((c, i) => {
      // 从顶部开始均匀分布，加少量随机抖动
      const angle = (i / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2 + (seededRandom(seed + i) - 0.5) * 0.25;
      const r = radius + (seededRandom(seed + i + 100) - 0.5) * 18;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      nodes.push(charNode(c, { x, y, labelShow: c.mentions >= 30 }));
      links.push({ source: `evt-${event.id}`, target: c.id, value: 1 });
    });
  } else {
    // 人物较多时按阵营分区
    const baseRadius = count <= 10 ? 145 : count <= 15 ? 180 : 210;
    const outerRadius = count <= 10 ? 190 : count <= 15 ? 230 : 260;

    grouped.forEach((chars, cat) => {
      const dir = categoryDirections[cat] || { dx: 0, dy: 1, spread: 0.7 };
      const baseAngle = Math.atan2(dir.dy, dir.dx);

      chars.forEach((c, i) => {
        const t = chars.length === 1 ? 0.5 : i / (chars.length - 1);
        const r = baseRadius + (outerRadius - baseRadius) * (0.2 + 0.8 * (1 - t)) + (seededRandom(seed + i) - 0.5) * 24;
        const angle = baseAngle + (seededRandom(seed + i + 100) - 0.5) * dir.spread;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        nodes.push(charNode(c, { x, y, labelShow: c.mentions >= 30 }));
        links.push({ source: `evt-${event.id}`, target: c.id, value: 1 });
      });
      seed += 100;
    });
  }

  const categories = getCategories();
  categories.push({ name: "事件" });

  return { nodes, links, categories };
}

function shortenTitle(title: string, maxLen = 9): string {
  if (title.length <= maxLen) return title;
  return title.slice(0, maxLen) + "…";
}

/** 模式三：人物邻域图 */
export function buildNeighborhoodGraph(
  characters: Character[],
  events: HistoricalEvent[],
  bookEvents: BookTimelineEvent[],
  centerId: string,
  options: { eventFilter?: "all" | "important" | "top10" } = {}
): { data: GraphData; matchedEvents: (HistoricalEvent | BookTimelineEvent)[]; hasData: boolean } {
  const charMap = new Map(characters.map((c) => [c.id, c]));
  const center = charMap.get(centerId);

  if (!center) {
    return { data: { nodes: [], links: [], categories: getCategories() }, matchedEvents: [], hasData: false };
  }

  const matchedCoreEvents = events.filter((evt) =>
    evt.characters.some((ch: HistoricalEventCharacter) => ch.id === centerId)
  );

  const matchedBookEvents = bookEvents.filter((evt) =>
    evt.people.some((p) => p === center.name)
  );

  let matchedEvents: (HistoricalEvent | BookTimelineEvent)[] = [
    ...matchedCoreEvents,
    ...matchedBookEvents,
  ];

  // 事件过滤
  if (options.eventFilter === "important") {
    matchedEvents = matchedEvents.filter((evt) => ("importance" in evt ? evt.importance : 5) >= 3);
  } else if (options.eventFilter === "top10") {
    matchedEvents = matchedEvents
      .sort((a, b) => ("importance" in b ? b.importance : 5) - ("importance" in a ? a.importance : 5))
      .slice(0, 10);
  }

  if (matchedEvents.length === 0) {
    return {
      data: { nodes: [charNode(center, { labelShow: true, x: 500, y: 380 })], links: [], categories: getCategories() },
      matchedEvents: [],
      hasData: false,
    };
  }

  const nodeIds = new Set<string>([centerId]);
  const links: GraphLink[] = [];
  const eventNodes: { evt: HistoricalEvent | BookTimelineEvent; x: number; y: number; nodeId: string }[] = [];

  // 事件节点第一圈
  const eventCount = matchedEvents.length;
  const eventRadius = Math.min(320, 130 + eventCount * 18);
  const eventAngleStep = (2 * Math.PI) / Math.max(eventCount, 1);

  matchedEvents.forEach((evt, i) => {
    const angle = i * eventAngleStep - Math.PI / 2;
    const x = 500 + eventRadius * Math.cos(angle);
    const y = 380 + eventRadius * Math.sin(angle);
    const nodeId = `evt-${evt.id}`;
    nodeIds.add(nodeId);
    eventNodes.push({ evt, x, y, nodeId });
    links.push({ source: centerId, target: nodeId, value: 2 });
  });

  // 人物节点第二圈
  const charNodes: GraphNode[] = [];
  eventNodes.forEach(({ evt, x: ex, y: ey }, idx) => {
    const people = "characters" in evt
      ? (evt as HistoricalEvent).characters.map((ch: HistoricalEventCharacter) => ch.id).filter(Boolean)
      : (evt as BookTimelineEvent).people
          .map((name) => {
            const c = characters.find((cc) => cc.name === name);
            return c?.id;
          })
          .filter(Boolean);

    const uniquePeople = Array.from(new Set(people as string[])).filter((id) => id !== centerId);
    const count = uniquePeople.length;
    const angleStep = (2 * Math.PI) / Math.max(count, 1);
    const radius = Math.min(150, 70 + count * 8);

    uniquePeople.forEach((pid, i) => {
      const c = charMap.get(pid);
      if (!c) return;
      const angle = i * angleStep + idx * 0.35 - Math.PI / 2;
      const x = ex + radius * Math.cos(angle);
      const y = ey + radius * Math.sin(angle);

      if (!nodeIds.has(c.id)) {
        nodeIds.add(c.id);
        charNodes.push(charNode(c, { x, y, labelShow: c.mentions >= 35 }));
      }
      links.push({ source: `evt-${evt.id}`, target: c.id, value: 1 });
    });
  });

  const nodes: GraphNode[] = [charNode(center, { labelShow: true, x: 500, y: 380 })];
  eventNodes.forEach(({ evt, x, y }) =>
    nodes.push(eventNode(evt, { x, y, shortTitle: shortenTitle("title" in evt ? evt.title : (evt as any).title) }))
  );
  nodes.push(...charNodes);

  const categories = getCategories();
  categories.push({ name: "事件" });

  return { data: { nodes, links, categories }, matchedEvents, hasData: true };
}
