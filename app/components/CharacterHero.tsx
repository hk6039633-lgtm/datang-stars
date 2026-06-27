"use client";

import type { Character } from "../types";

interface CharacterHeroProps {
  character: Character;
}

/**
 * 从 cleanPath 提取 slug 并转换为罗马字姓名。
 * 例：/images/characters/clean/li-shimin_clean_v01.png -> Li Shimin
 */
function getRomanizedName(cleanPath?: string): string | null {
  if (!cleanPath) return null;
  const match = cleanPath.match(/\/clean\/([^_]+)_clean_/);
  if (!match) return null;
  return match[1]
    .split("-")
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
    .join(" ");
}

function getDisplayName(c: Character): string {
  return c.displayName || c.canonicalName || c.name;
}

function getTitle(c: Character): string {
  return c.dynastyTitle || c.templeName || c.formerTitle || c.role || "";
}

function getCategoryLabel(c: Character): string {
  if (c.subCategory && c.primaryCategory) {
    return `${c.primaryCategory} · ${c.subCategory}`;
  }
  return c.primaryCategory || "";
}

export default function CharacterHero({ character: c }: CharacterHeroProps) {
  const displayName = getDisplayName(c);
  const title = getTitle(c);
  const category = getCategoryLabel(c);
  const statement = c.impactStatement || c.summary || "";
  const romanized = getRomanizedName(c.cleanPath);
  const sealChar = displayName.charAt(0);
  const aliases = (c.aliases || []).filter((a) => a !== displayName).slice(0, 4);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-[#f5efe3] shadow-sm">
      {/* 古典纸纹/暗纹背景 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(120,53,15,0.6) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(120,53,15,0.4) 0%, transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(120,53,15,0.08) 60px, rgba(120,53,15,0.08) 61px), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(120,53,15,0.08) 60px, rgba(120,53,15,0.08) 61px)",
        }}
      />

      <div className="relative flex min-h-[280px] flex-col sm:min-h-[360px] lg:min-h-[440px] lg:flex-row">
        {/* 图片区：移动端在上，桌面端在右 */}
        <div className="relative order-1 h-[220px] w-full overflow-hidden sm:h-[320px] lg:order-2 lg:h-auto lg:w-[55%]">
          {/* 米金到透明的渐变，让文字区与图片过渡自然 */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-24 bg-gradient-to-r from-[#f5efe3] to-transparent lg:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.cleanPath}
            alt={displayName}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
          {/* 移动端底部渐变遮罩，避免图片底部生硬 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f5efe3]/90 to-transparent lg:hidden" />
        </div>

        {/* 文字题签区：移动端在下，桌面端在左 */}
        <div className="order-2 flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:order-1 lg:w-[45%] lg:px-12 lg:py-12">
          {/* 顶部装饰线 + 分类 */}
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px w-10 bg-amber-700/30" />
            <span className="inline-block rounded-full border border-amber-300/70 bg-amber-50/60 px-3 py-1 text-xs tracking-widest text-amber-800">
              {category || "历史人物"}
            </span>
          </div>

          {/* 印章装饰 */}
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-sm border-2 border-red-900/70 bg-red-50/90 shadow-sm">
            <span className="font-serif text-base font-bold leading-none text-red-900">
              {sealChar}
            </span>
          </div>

          {/* 姓名 */}
          <h1 className="mb-1 font-serif text-3xl font-bold tracking-[0.08em] text-amber-950 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]">
            {displayName}
          </h1>

          {/* 罗马字 */}
          {romanized && (
            <p className="mb-3 text-xs tracking-[0.25em] text-amber-600/80 uppercase sm:text-sm">
              {romanized}
            </p>
          )}

          {/* 称号 */}
          {title && (
            <p className="hero-line-clamp-2 mb-5 text-sm font-medium text-amber-800/90 sm:text-base lg:text-lg">
              {title}
            </p>
          )}

          {/* 分隔线 */}
          <div className="mb-5 h-px w-20 bg-gradient-to-r from-amber-700/50 to-transparent" />

          {/* 影响说明 */}
          {statement && (
            <p className="hero-line-clamp-2 hero-line-clamp-none mb-5 max-w-md text-sm leading-7 text-amber-800/80">
              {statement}
            </p>
          )}

          {/* 别名小签 */}
          {aliases.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {aliases.slice(0, 3).map((alias) => (
                <span
                  key={alias}
                  className="rounded-md border border-amber-200/80 bg-amber-50/60 px-2 py-0.5 text-xs text-amber-700"
                >
                  {alias}
                </span>
              ))}
              {aliases.length > 3 && (
                <span className="text-xs text-amber-500">+{aliases.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
