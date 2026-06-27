"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/characters", label: "群英录" },
  { href: "/timeline", label: "风云轴" },
  { href: "/graph", label: "权力图谱" },
  { href: "/galaxy", label: "星河" },
  { href: "/ranking", label: "人物榜" },
];

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/60 bg-[#fdfbf7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-[#451a03]">
          <span className="text-xl font-bold tracking-[0.25em]">唐局</span>
        </Link>
        <nav className="hidden gap-1 sm:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-amber-800 text-white"
                    : "text-amber-800 hover:bg-amber-100 hover:text-[#451a03]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 移动端横向导航 */}
      <nav className="sm:hidden border-t border-amber-100 bg-[#fdfbf7]/90">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium transition whitespace-nowrap sm:px-3 sm:py-1.5 ${
                  active
                    ? "bg-amber-800 text-white"
                    : "text-amber-800 hover:bg-amber-100 hover:text-[#451a03]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
