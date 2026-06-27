import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e9] px-4 py-8 text-[#451a03]">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-black tracking-wide sm:text-4xl">关于唐局</h1>

        <section className="mb-8 rounded-2xl border border-amber-200/80 bg-[#fdfbf7] p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">项目简介</h2>
          <p className="leading-relaxed text-amber-900/90">
            唐局是一个以唐朝历史人物与事件为核心的知识可视化项目。通过人物关系图谱、事件时间轴、
            全书年表、星河总览与人物榜单等形式，帮助读者更直观地理解《中国历代通俗演义（唐朝）》
            中的人物群像与历史脉络。
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-amber-200/80 bg-[#fdfbf7] p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">数据来源</h2>
          <p className="leading-relaxed text-amber-900/90">
            人物与事件数据基于《中国历代通俗演义（唐朝）》整理，经脚本解析与人工校订后生成。
            当前收录约 890 位人物、18 场核心事件与 100 条全书年表。
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-amber-200/80 bg-[#fdfbf7] p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">免责声明</h2>
          <p className="leading-relaxed text-amber-900/90">
            本项目为历史知识可视化与学习展示用途。人物、事件、分类基于整理资料与人工校订，
            仍可能存在疏漏或不同学术观点。项目内容不代表权威历史定论，欢迎后续修订与反馈。
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-amber-200/80 bg-[#fdfbf7] p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold">技术栈</h2>
          <p className="leading-relaxed text-amber-900/90">
            Next.js · React · TypeScript · Tailwind CSS · ECharts · Canvas
          </p>
        </section>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block rounded-lg bg-amber-800 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#451a03]"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
