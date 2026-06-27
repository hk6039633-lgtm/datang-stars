import type { Character } from "../types";

/**
 * 统一人物搜索匹配函数
 *
 * 搜索字段：
 * - name / displayName
 * - canonicalName / personalName
 * - templeName / dynastyTitle / formerTitle
 * - aliases
 * - role
 * - summary
 * - events
 */
export function matchCharacterSearch(character: Character, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const c = character;

  const textFields = [
    c.name,
    c.displayName,
    c.canonicalName,
    c.personalName,
    c.templeName,
    c.dynastyTitle,
    c.formerTitle,
    c.role,
    c.summary,
  ].filter((v): v is string => Boolean(v));

  if (textFields.some((field) => field.toLowerCase().includes(q))) {
    return true;
  }

  const aliases = c.aliases || [];
  if (aliases.some((alias) => alias.toLowerCase().includes(q))) {
    return true;
  }

  const events = c.events || [];
  if (events.some((evt) => evt.toLowerCase().includes(q))) {
    return true;
  }

  return false;
}
