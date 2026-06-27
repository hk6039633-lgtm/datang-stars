import { promises as fs, existsSync } from "fs";
import path from "path";
import type { Character, HistoricalEvent, BookTimelineEvent } from "../types";
import { resolveCharacterAvatar } from "./defaultAvatar";

const dataDir = path.join(process.cwd(), "data");
const publicDir = path.join(process.cwd(), "public");

// 模块级缓存：避免构建时重复读取 characters.json 和 character_overrides.json
let charactersCache: Promise<Character[]> | null = null;

/**
 * 校验图片路径是否真实存在，并优先返回 WebP 版本。
 * 如果对应的 .webp 文件存在则返回 .webp 路径；否则返回原格式路径；
 * 如果都不存在则返回 undefined，避免页面渲染破损图。
 */
function resolveImagePath(relativePath?: string): string | undefined {
  if (!relativePath) return undefined;
  const webpPath = relativePath.replace(/\.(png|jpe?g)$/i, ".webp");
  if (webpPath !== relativePath) {
    const webpFilePath = path.join(publicDir, webpPath.replace(/^\//, ""));
    if (existsSync(webpFilePath)) return webpPath;
  }
  const filePath = path.join(publicDir, relativePath.replace(/^\//, ""));
  return existsSync(filePath) ? relativePath : undefined;
}

/**
 * 读取人工覆盖校订表（data/character_overrides.json）。
 * key 为人物 name，value 为需要覆盖的字段。
 */
async function loadCharacterOverrides(): Promise<
  Record<string, Partial<Character> & { note?: string }>
> {
  const overridesPath = path.join(dataDir, "character_overrides.json");
  if (!existsSync(overridesPath)) return {};
  const raw = await fs.readFile(overridesPath, "utf-8");
  return JSON.parse(raw) as Record<string, Partial<Character> & { note?: string }>;
}

export async function getCharacters(): Promise<Character[]> {
  if (!charactersCache) {
    charactersCache = loadCharacters();
  }
  return charactersCache;
}

async function loadCharacters(): Promise<Character[]> {
  const [file, overrides] = await Promise.all([
    fs.readFile(path.join(dataDir, "characters.json"), "utf-8"),
    loadCharacterOverrides(),
  ]);
  const data = JSON.parse(file);
  const characters = data.characters as Character[];

  // 过滤掉不存在的图片路径，确保新增视觉人物在未放图前不显示破图
  return characters.map((c) => {
    const override = overrides[c.name];
    let merged = c;
    let overrideMeta: Pick<
      Character,
      "_overrideApplied" | "_overrideSource" | "_overrideNote" | "_overrideOriginalCategory"
    > | null = null;

    if (override) {
      // note 不是 Character 字段，单独取出作为追溯信息
      const { note, ...overrideFields } = override;
      merged = { ...c, ...overrideFields };
      overrideMeta = {
        _overrideApplied: true,
        _overrideSource: "data/character_overrides.json",
        _overrideNote: note,
        _overrideOriginalCategory: c.primaryCategory,
      };
    }

    const cleanPath = resolveImagePath(merged.cleanPath);
    const cardPath = resolveImagePath(merged.cardPath);
    const avatarPath = resolveImagePath(merged.avatarPath);

    return {
      ...merged,
      cleanPath,
      cardPath,
      avatarPath,
      effectiveAvatarPath: avatarPath || resolveCharacterAvatar({ ...merged, avatarPath }),
      ...overrideMeta,
    };
  });
}

export async function getCharacterById(id: string): Promise<Character | undefined> {
  const characters = await getCharacters();
  return characters.find((c) => c.id === id);
}

export async function getEvents(): Promise<HistoricalEvent[]> {
  const file = await fs.readFile(path.join(dataDir, "events.json"), "utf-8");
  const data = JSON.parse(file);
  return data.events as HistoricalEvent[];
}

export async function getBookTimeline(): Promise<BookTimelineEvent[]> {
  const file = await fs.readFile(path.join(dataDir, "book_timeline.json"), "utf-8");
  return JSON.parse(file) as BookTimelineEvent[];
}
