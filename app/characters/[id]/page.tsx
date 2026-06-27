import Link from "next/link";
import { notFound } from "next/navigation";
import { getCharacterById, getCharacters, getBookTimeline } from "../../lib/data";
import { CharacterAvatar } from "../../components/CharacterAvatar";
import { TangTag } from "../../components/TangTag";
import { TangPanel } from "../../components/TangPanel";
import type { BookTimelineEvent } from "../../types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const characters = await getCharacters();
  return characters.map((c) => ({ id: c.id }));
}

const typeColors: Record<string, string> = {
  战争: "bg-red-100 text-red-800 border-red-200",
  叛乱: "bg-stone-100 text-stone-800 border-stone-200",
  政治: "bg-indigo-100 text-indigo-800 border-indigo-200",
  外交: "bg-teal-100 text-teal-800 border-teal-200",
  人物命运: "bg-pink-100 text-pink-800 border-pink-200",
  建国: "bg-amber-100 text-amber-800 border-amber-200",
  宫廷: "bg-purple-100 text-purple-800 border-purple-200",
  文化: "bg-blue-100 text-blue-800 border-blue-200",
};

export default async function CharacterDetailPage({ params }: PageProps) {
  const { id } = await params;
  const character = await getCharacterById(id);

  if (!character) {
    notFound();
  }

  const hasVisual = !!(character.cardPath || character.cleanPath);

  const timelineEvents = await getBookTimeline();
  const involvedEvents = timelineEvents.filter((evt) => evt.people.some((p) => p === character.name));

  return (
    <main className="min-h-screen bg-[#f8f3e9] px-4 py-8 text-[#451a03]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/characters"
          className="mb-4 inline-flex items-center text-sm text-amber-800 hover:text-[#451a03] hover:underline"
        >
          ← 返回群英录
        </Link>

        <div className={`grid gap-6 ${hasVisual ? "lg:grid-cols-[360px_1fr]" : ""}`}>
          {/* 左侧：card 大图 */}
          {hasVisual && (
            <TangPanel className="h-fit p-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={character.cardPath || character.cleanPath}
                alt={character.name}
                loading="eager"
                decoding="async"
                className="w-full max-h-[40vh] object-contain sm:max-h-[60vh] lg:max-h-[70vh]"
              />
            </TangPanel>
          )}

          {/* 右侧：人物信息 */}
          <div className="space-y-6">
            <TangPanel>
              <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <CharacterAvatar character={character} size="xl" />
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-black tracking-wide text-[#451a03] sm:text-4xl">{character.name}</h1>
                    <TangTag variant="category">{character.primaryCategory}</TangTag>
                    {character.subCategory && <TangTag variant="default">{character.subCategory}</TangTag>}
                  </div>

                  <p className="mb-4 text-lg font-medium leading-relaxed text-amber-800/90">
                    {character.role}
                  </p>

                  {character.aliases && character.aliases.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {character.aliases.slice(0, 10).map((alias) => (
                        <TangTag key={alias} variant="alias">
                          {alias}
                        </TangTag>
                      ))}
                    </div>
                  )}
                </div>
              </header>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <InfoItem label="所属时期" value={character.period} />
                <InfoItem label="历史影响力" value={`${character.historicalImportanceScore ?? "-"} 分`} />
                <InfoItem label="出场次数" value={`${character.mentions} 次`} />
                <InfoItem label="相关事件" value={`${character.events.length} 个`} />
              </div>

              {(character.templeName || character.dynastyTitle || character.formerTitle || character.reignTitle) && (
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border border-amber-100/80 bg-amber-50/40 p-4 text-sm text-amber-800">
                  {character.personalName && character.personalName !== character.name && (
                    <span><span className="text-amber-600">本名：</span>{character.personalName}</span>
                  )}
                  {character.templeName && (
                    <span><span className="text-amber-600">庙号：</span>{character.templeName}</span>
                  )}
                  {character.dynastyTitle && (
                    <span><span className="text-amber-600">历史称号：</span>{character.dynastyTitle}</span>
                  )}
                  {character.formerTitle && (
                    <span><span className="text-amber-600">早期封号：</span>{character.formerTitle}</span>
                  )}
                  {character.reignTitle && (
                    <span><span className="text-amber-600">年号：</span>{character.reignTitle}</span>
                  )}
                </div>
              )}
            </TangPanel>

            <TangPanel title="人物简介">
              <p className="leading-loose text-amber-900/90">{character.summary}</p>
              {character.impactStatement && character.impactStatement !== character.summary && (
                <p className="mt-4 border-l-2 border-amber-400 pl-4 text-amber-800/80">{character.impactStatement}</p>
              )}
            </TangPanel>

            <TangPanel title="入局事件">
              {involvedEvents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/30 p-4 text-amber-700">
                  暂无书中事件线数据。
                </div>
              ) : (
                <div className="space-y-3">
                  {involvedEvents.map((evt) => (
                    <TimelineEventCard key={evt.id} event={evt} />
                  ))}
                </div>
              )}
            </TangPanel>

            <TangPanel title="相关事件">
              {character.events.length === 0 ? (
                <p className="text-amber-700">暂无相关事件记录</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {character.events.map((evt) => (
                    <TangTag key={evt} variant="event">
                      {evt}
                    </TangTag>
                  ))}
                </div>
              )}
            </TangPanel>

            <TangPanel title="关系人物">
              {character.relations.length === 0 ? (
                <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/30 p-4 text-amber-700">
                  关系数据待补充
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {character.relations.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/characters/${rel.id}`}
                      className="flex items-center justify-between rounded-xl border border-amber-200/70 bg-amber-50/40 px-4 py-3 transition hover:border-amber-400 hover:bg-amber-50"
                    >
                      <span className="font-medium text-[#451a03]">{rel.name}</span>
                      <span className="text-sm text-amber-700">{rel.type}</span>
                    </Link>
                  ))}
                </div>
              )}
            </TangPanel>
          </div>
        </div>
      </div>
    </main>
  );
}

function TimelineEventCard({ event: evt }: { event: BookTimelineEvent }) {
  const displayYear = evt.yearRange || evt.year;

  return (
    <div className="rounded-xl border border-amber-200/70 bg-amber-50/30 p-4 transition hover:border-amber-400">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-amber-700">
        <span className="font-semibold text-[#451a03]">{displayYear}</span>
        <span>·</span>
        <span>{evt.chapter}</span>
        {evt.type.map((t) => (
          <span
            key={t}
            className={`rounded-full px-2 py-0.5 text-xs border ${typeColors[t] || "bg-amber-100 text-amber-800 border-amber-200"}`}
          >
            {t}
          </span>
        ))}
      </div>
      <h3 className="mb-1 font-bold text-[#451a03]">{evt.title}</h3>
      <p className="text-sm leading-relaxed text-amber-800/85">{evt.summary}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-100/80 bg-amber-50/50 p-3 text-center">
      <p className="mb-1 text-xs text-amber-600">{label}</p>
      <p className="text-base font-semibold text-[#451a03] sm:text-lg">{value}</p>
    </div>
  );
}
