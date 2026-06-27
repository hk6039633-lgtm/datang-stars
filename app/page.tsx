import Link from "next/link";
import { getCharacters, getBookTimeline } from "./lib/data";
import { CharacterAvatar } from "./components/CharacterAvatar";
import { SectionTitle } from "./components/SectionTitle";
import { TangPanel } from "./components/TangPanel";

export default async function HomePage() {
  const [characters, events] = await Promise.all([getCharacters(), getBookTimeline()]);
  const totalMentions = characters.reduce((sum, c) => sum + c.mentions, 0);
  const categoryCounts = characters.reduce<Record<string, number>>((acc, c) => {
    acc[c.primaryCategory] = (acc[c.primaryCategory] || 0) + 1;
    return acc;
  }, {});

  const featuredIds = [
    "lishimin",
    "wuzetian",
    "libai",
    "dufu",
    "shangguanwaner",
    "taipinggongzhu",
    "lijing",
    "fangxuanling",
    "weizheng",
    "huangchao",
  ];
  const featured = featuredIds
    .map((id) => characters.find((c) => c.id === id))
    .filter(Boolean) as typeof characters;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f3e9] px-4 pb-16 pt-12 text-[#451a03]">
      {/* 背景纹样 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40L40 0z' fill='none' stroke='%238B4513' stroke-width='1'/%3E%3Ccircle cx='40' cy='40' r='10' fill='none' stroke='%238B4513' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f8f3e9] via-transparent to-[#f8f3e9]" />

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl text-center">
        <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-amber-300/60 bg-[#fdfbf7]/70 px-5 py-2 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
          <span className="text-sm tracking-[0.2em] text-amber-800">大唐人物志 · 权力星图</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
        </div>

        <h1 className="mb-5 text-5xl font-black tracking-[0.15em] text-[#451a03] sm:text-6xl sm:tracking-[0.25em] lg:text-8xl">
          唐局
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base font-medium leading-relaxed tracking-wide text-amber-800/90 sm:text-lg lg:text-xl">
          一张图看懂大唐三百年人物、权力与风云
        </p>

        <div className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4">
          {featured.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.id}`}
              className="group flex flex-col items-center gap-2 transition hover:-translate-y-1"
            >
              <CharacterAvatar character={c} size="lg" />
              <span className="text-xs font-medium text-amber-800 group-hover:text-[#451a03]">{c.name}</span>
            </Link>
          ))}
        </div>

        <div className="mx-auto mb-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
          <TangPanel className="py-4 text-center">
            <p className="text-2xl font-bold text-[#451a03] sm:text-3xl">{characters.length}</p>
            <p className="text-[10px] tracking-widest text-amber-700 sm:text-xs">历史人物</p>
          </TangPanel>
          <TangPanel className="py-4 text-center">
            <p className="text-2xl font-bold text-[#451a03] sm:text-3xl">{totalMentions}</p>
            <p className="text-[10px] tracking-widest text-amber-700 sm:text-xs">总出场次数</p>
          </TangPanel>
          <TangPanel className="py-4 text-center">
            <p className="text-2xl font-bold text-[#451a03] sm:text-3xl">{Object.keys(categoryCounts).length}</p>
            <p className="text-[10px] tracking-widest text-amber-700 sm:text-xs">人物类型</p>
          </TangPanel>
        </div>
      </section>

      {/* 核心入口 */}
      <section className="relative mx-auto mb-14 max-w-5xl">
        <SectionTitle subtitle="从人物、事件、年表与关系中探索大唐">核心入口</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <EntranceCard href="/characters" glyph="群" title="群英录" desc={`${characters.length} 位唐代人物`} />
          <EntranceCard href="/timeline" glyph="轴" title="风云轴" desc="从太原起兵到朱温篡唐" />
          <EntranceCard href="/chronicle" glyph="表" title="全书年表" desc={`${events.length} 个书中事件`} />
          <EntranceCard href="/graph" glyph="谱" title="权力图谱" desc="核心人物星图可视化" />
          <EntranceCard href="/ranking" glyph="榜" title="人物榜" desc="历史影响榜" />
        </div>
      </section>

      {/* 推荐人物 */}
      <section className="relative mx-auto max-w-5xl">
        <SectionTitle subtitle="已拥有专属视觉资产的重点人物">人物图鉴</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featured.map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.id}`}
              className="group flex items-center gap-3 rounded-xl border border-amber-200/70 bg-[#fdfbf7] p-3 transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-sm"
            >
              <CharacterAvatar character={c} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[#451a03] group-hover:text-amber-800">{c.name}</p>
                <p className="truncate text-xs text-amber-700">{c.primaryCategory}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function EntranceCard({
  href,
  glyph,
  title,
  desc,
}: {
  href: string;
  glyph: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fdfbf7] p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-md"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60 transition group-hover:opacity-100" />
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/80 bg-amber-50 text-xl font-bold text-amber-800 transition group-hover:border-amber-400 group-hover:bg-amber-100">
        {glyph}
      </div>
      <h2 className="mb-1 text-lg font-bold tracking-widest text-[#451a03]">{title}</h2>
      <p className="text-xs leading-relaxed text-amber-700">{desc}</p>
    </Link>
  );
}
