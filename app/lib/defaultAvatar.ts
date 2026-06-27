import { existsSync } from "fs";
import path from "path";
import type { Character } from "../types";

const publicDir = path.join(process.cwd(), "public");

export const DEFAULT_AVATAR_BASE = "/images/characters/defaults";

/**
 * 人物 primaryCategory → 默认头像文件名。
 * 默认头像由 ChatGPT 统一生成，Kimi 只负责路径映射，不生成、不修改图片。
 */
export const categoryToDefaultAvatar: Record<string, string> = {
  "皇帝/皇室": "imperial-default.png",
  "宰相/大臣": "minister-default.png",
  "武将/将领": "general-default.png",
  "节度使/藩镇": "jiedushi-default.png",
  "宦官": "eunuch-default.png",
  "后宫/女性": "female-default.png",
  "外族": "foreign-default.png",
  "文人": "literati-default.png",
  "叛乱势力": "rebel-default.png",
  "宗教人物": "religion-default.png",
  "其他": "other-default.png",
};

export function getDefaultAvatarPath(category?: string): string | undefined {
  const file = category ? categoryToDefaultAvatar[category] : undefined;
  return file ? `${DEFAULT_AVATAR_BASE}/${file}` : undefined;
}

/**
 * 统一图片路径解析：优先返回 WebP 版本，不存在时回退原格式。
 */
function resolveImagePathWithWebp(relativePath?: string): string | undefined {
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
 * 服务端专用：根据人物自己的 avatarPath 或分类默认头像，返回真实存在的路径。
 * 优先使用 WebP 版本，找不到时回退 PNG/JPG。
 * 如果都不存在则返回 undefined，避免前端渲染破损图。
 */
export function resolveCharacterAvatar(c: Character): string | undefined {
  if (c.avatarPath) {
    const resolved = resolveImagePathWithWebp(c.avatarPath);
    if (resolved) return resolved;
  }
  const defaultPath = getDefaultAvatarPath(c.primaryCategory);
  if (defaultPath) {
    const resolved = resolveImagePathWithWebp(defaultPath);
    if (resolved) return resolved;
  }
  return undefined;
}

/**
 * 通用头像解析函数。
 * 优先使用 data.ts 已解析好的 effectiveAvatarPath；
 * 否则在服务端环境下再次解析（兜底）。
 * 客户端组件应依赖 Character.effectiveAvatarPath，本函数作为统一入口提供语义封装。
 */
export function getCharacterAvatar(c: Character): string | undefined {
  return c.effectiveAvatarPath || resolveCharacterAvatar(c);
}
