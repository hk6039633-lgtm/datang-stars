import Link from "next/link";
import { getEvents } from "../lib/data";

export default async function TimelinePage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen bg-[#fdfbf7] px-4 py-8 text-amber-950">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-amber-900 sm:text-3xl">风云轴</h1>
        <p className="mb-6 text-center text-sm text-amber-700 sm:text-base">从太原起兵到朱温篡唐，十八个关键节点串起大唐三百年</p>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-center">
          <p className="text-sm text-amber-800">
            当前显示核心历史节点。
            <Link href="/chronicle" className="ml-1 font-medium underline hover:text-amber-900">
              查看完整全书年表 →
            </Link>
          </p>
        </div>

        <div className="relative border-l-2 border-amber-300 pl-6 sm:pl-10">
          {events.map((evt) => (
            <div key={evt.id} className="relative mb-10">
              <span className="absolute -left-[31px] top-2 h-4 w-4 rounded-full border-2 border-amber-400 bg-[#fdfbf7] sm:-left-[49px]" />

              <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm transition hover:border-amber-300">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-amber-900 sm:text-xl">{evt.title}</h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs text-amber-800">
                    {evt.period}
                  </span>
                </div>
                <p className="mb-3 text-xs font-medium text-amber-600 sm:text-sm">{evt.year}</p>

                <p className="mb-4 leading-relaxed text-amber-800/90">{evt.summary}</p>

                <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                  <span className="mb-1 block text-xs font-semibold text-amber-700">历史影响</span>
                  <p className="text-sm leading-relaxed text-amber-800/90">{evt.consequences}</p>
                </div>

                {evt.characters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-amber-500">相关人物：</span>
                    {evt.characters.map((char, idx) =>
                      char.id ? (
                        <Link
                          key={idx}
                          href={`/characters/${char.id}`}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800 transition hover:border-amber-400 hover:bg-amber-100"
                        >
                          {char.name}
                        </Link>
                      ) : (
                        <span
                          key={idx}
                          className="rounded-full border border-amber-100 bg-amber-50/50 px-3 py-1 text-sm text-amber-600"
                        >
                          {char.name}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
