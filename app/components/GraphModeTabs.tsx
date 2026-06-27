"use client";

export type GraphMode = "star" | "event" | "neighborhood";

interface GraphModeTabsProps {
  mode: GraphMode;
  onChange: (mode: GraphMode) => void;
}

const tabs: { key: GraphMode; label: string; desc: string }[] = [
  { key: "star", label: "核心人物星图", desc: "高频出场人物分布" },
  { key: "event", label: "事件局势图", desc: "事件中的入局人物" },
  { key: "neighborhood", label: "人物邻域图", desc: "人物卷入的核心事件" },
];

export default function GraphModeTabs({ mode, onChange }: GraphModeTabsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      {tabs.map((tab) => {
        const active = mode === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex flex-1 flex-col items-start rounded-xl border px-4 py-3 text-left transition ${
              active
                ? "border-amber-500 bg-amber-100/60 text-amber-900"
                : "border-amber-200 bg-white/70 text-amber-700 hover:border-amber-400 hover:bg-amber-50/70"
            }`}
          >
            <span className="font-bold">{tab.label}</span>
            <span className="text-xs opacity-80">{tab.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
