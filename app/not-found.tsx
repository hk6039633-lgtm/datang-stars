import Link from "next/link";

export const metadata = {
  title: "页面未找到",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f8f3e9] px-4 py-16 text-[#451a03]">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-4xl font-black text-amber-700">
        404
      </div>
      <h1 className="mb-3 text-2xl font-black tracking-wide sm:text-3xl">此页不在唐局版图之中</h1>
      <p className="mb-8 max-w-md text-center text-amber-800/80">
        你要寻找的页面可能已经迁址，或尚未载入大唐群星谱。
      </p>
      <Link
        href="/"
        className="rounded-lg bg-amber-800 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#451a03]"
      >
        返回首页
      </Link>
    </main>
  );
}
