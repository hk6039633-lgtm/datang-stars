"use client";

import { useEffect, useRef, useState } from "react";
import type { Character, HistoricalEvent, BookTimelineEvent } from "../types";
import type { GraphData, GraphNode } from "../lib/graphData";

type GraphMode = "star" | "event" | "neighborhood";

interface EChartsGraphProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  selectedId?: string | null;
  mode?: GraphMode;
}

// 唐风历史色谱：赭金、暗红、蓝灰、墨色
const tangColors: Record<string, string> = {
  "皇帝/皇室": "#7a1f1f",
  "宰相/大臣": "#4a5d6a",
  "武将/将领": "#4a3b2a",
  "节度使/藩镇": "#8b5a2b",
  "宦官": "#5a3d5c",
  "后宫/女性": "#8b4a5e",
  "外族": "#3d5c5c",
  "文人": "#2e4a3e",
  "叛乱势力": "#3d3222",
  "宗教人物": "#5d4a3a",
  "其他": "#5a5a5a",
  "事件": "#9c6b2d",
};

// 原有模式保留明亮色彩
const categoryColors: Record<string, string> = {
  "皇帝/皇室": "#dc2626",
  "宰相/大臣": "#4f46e5",
  "武将/将领": "#d97706",
  "节度使/藩镇": "#ea580c",
  "宦官": "#9333ea",
  "后宫/女性": "#db2777",
  "外族": "#0f766e",
  "文人": "#2563eb",
  "叛乱势力": "#44403c",
  "宗教人物": "#059669",
  "其他": "#9ca3af",
  "事件": "#b45309",
};

export default function EChartsGraph({ data, onNodeClick, selectedId, mode = "star" }: EChartsGraphProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const echartsRef = useRef<any>(null);
  const dataRef = useRef(data);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  dataRef.current = data;

  useEffect(() => {
    let disposed = false;
    let handleResize: (() => void) | null = null;
    let handleZrClick: ((e: any) => void) | null = null;

    async function initChart() {
      const echarts = await import("echarts");
      if (disposed || !chartRef.current) return;
      echartsRef.current = echarts;

      const instance = echarts.init(chartRef.current, undefined, { renderer: "canvas" });
      chartInstanceRef.current = instance;

      instance.on("click", (params: any) => {
        if (params?.dataType === "node" && onNodeClick) {
          const node = dataRef.current.nodes.find((n) => n.id === params.data.id);
          if (node && node.nodeType !== "clusterLabel" && node.nodeType !== "categoryHub") {
            onNodeClick(node);
          }
        }
      });

      // 移动端兜底：zrender 层直接捕获点击/轻触，避免 roam 把 tap 吃掉
      if (typeof window !== "undefined" && window.innerWidth < 640) {
        const zr = instance.getZr();
        handleZrClick = (e: any) => {
          if (!onNodeClick) return;
          if (typeof e?.offsetX !== "number" || typeof e?.offsetY !== "number") return;
          const point = [e.offsetX, e.offsetY];
          const nodes = dataRef.current.nodes.filter(
            (n) => n.nodeType !== "clusterLabel" && n.nodeType !== "categoryHub"
          );
          let nearest: GraphNode | null = null;
          let minDist = Infinity;
          for (const n of nodes) {
            const np = instance.convertToPixel({ seriesIndex: 0 }, [n.x, n.y]) as number[] | undefined;
            if (!np) continue;
            const d = Math.hypot(np[0] - point[0], np[1] - point[1]);
            if (d < minDist) {
              minDist = d;
              nearest = n;
            }
          }
          if (nearest && minDist <= 36) {
            onNodeClick(nearest);
          }
        };
        zr.on("click", handleZrClick);
      }

      handleResize = () => instance.resize();
      window.addEventListener("resize", handleResize);
      setReady(true);
    }

    initChart();

    return () => {
      disposed = true;
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (chartInstanceRef.current) {
        try {
          if (handleZrClick && chartInstanceRef.current.getZr) {
            chartInstanceRef.current.getZr().off("click", handleZrClick);
          }
        } catch {
          // ignore
        }
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [onNodeClick]);

  useEffect(() => {
    if (!chartInstanceRef.current || !echartsRef.current || !ready) return;

    const echarts = echartsRef.current;

    const validNodes = data.nodes.filter(
      (n): n is GraphNode => Boolean(n && n.id && n.name && typeof n.x === "number" && typeof n.y === "number")
    );
    const nodeIdSet = new Set(validNodes.map((n) => n.id));
    const validLinks = data.links.filter(
      (l) => l && nodeIdSet.has(l.source) && nodeIdSet.has(l.target)
    );

    const isStarMode = mode === "star";
    const isEventMode = mode === "event";
    const isNeighborhoodMode = mode === "neighborhood";

    const characterNodes = validNodes.filter((n) => n.nodeType === "character");
    const sortedByMentions = [...characterNodes].sort((a, b) => b.value - a.value);
    const top8Ids = new Set(sortedByMentions.slice(0, 8).map((n) => n.id));
    const top10Ids = new Set(sortedByMentions.slice(0, 10).map((n) => n.id));
    const top15Ids = new Set(sortedByMentions.slice(0, 15).map((n) => n.id));

    const categories = data.categories.map((c) => ({
      name: c.name,
      itemStyle: { color: isStarMode ? tangColors[c.name] : categoryColors[c.name] || "#9ca3af" },
    }));

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          if (params?.dataType === "node") {
            const node = validNodes.find((n) => n.id === params.data.id);
            if (!node) return params.name;
            if (node.nodeType === "clusterLabel" || node.nodeType === "categoryHub") return node.name;
            if (node.nodeType === "event") {
              const evt = node.raw as HistoricalEvent | BookTimelineEvent;
              const fullTitle = "title" in evt ? evt.title : (evt as any).title;
              const period = "period" in evt ? evt.period : (evt as any).period || "";
              const importance = "importance" in evt ? ` · 重要度 ${evt.importance}` : "";
              return `<div style="max-width:280px"><b>${fullTitle}</b><br/>${period}${importance}</div>`;
            }
            const c = node.raw as Character;
            return `<div style="max-width:260px"><b>${c.name}</b><br/>${c.role}<br/>出场 ${c.mentions} 次</div>`;
          }
          if (params?.dataType === "edge") {
            return params.value ? `关联强度 ${params.value}` : "";
          }
          return params.name;
        },
        backgroundColor: "rgba(253, 251, 247, 0.98)",
        borderColor: "#d6d3d1",
        borderWidth: 1,
        textStyle: { color: "#451a03" },
        padding: 10,
      },
      animationDuration: 1000,
      animationEasingUpdate: "cubicOut",
      series: [
        {
          type: "graph",
          layout: "none",
          data: validNodes.map((n) => {
            const isSelected = n.id === selectedId;
            const isClusterLabel = n.nodeType === "clusterLabel";
            const isCategoryHub = n.nodeType === "categoryHub";
            const isEvent = n.nodeType === "event";
            const isCharacter = n.nodeType === "character";

            // categoryHub / clusterLabel 使用节点自身配置
            if (isCategoryHub || isClusterLabel) {
              return {
                id: n.id,
                name: n.name,
                value: n.value,
                category: n.category,
                x: n.x,
                y: n.y,
                symbolSize: n.symbolSize,
                fixed: n.fixed,
                silent: n.silent,
                label: n.label,
                itemStyle: n.itemStyle,
                emphasis: n.emphasis || { disabled: true },
              };
            }

            let showLabel = false;
            if (isEvent) {
              showLabel = true;
            } else if (isCharacter) {
              if (isStarMode) {
                showLabel = top8Ids.has(n.id);
              } else if (isNeighborhoodMode) {
                showLabel = n.labelShow || top15Ids.has(n.id) || isSelected;
              } else {
                showLabel = n.labelShow || top15Ids.has(n.id) || isSelected;
              }
            }

            if (isStarMode) {
              return {
                id: n.id,
                name: n.name,
                value: n.value,
                category: n.category,
                x: n.x,
                y: n.y,
                symbolSize: n.symbolSize,
                label: {
                  show: showLabel,
                  formatter: "{b}",
                  fontSize: 11,
                  fontWeight: top8Ids.has(n.id) ? "bold" : "normal",
                  color: "#3d2b1f",
                  position: "bottom",
                  distance: 5,
                  backgroundColor: "rgba(253, 251, 247, 0.78)",
                  padding: [1, 4],
                  borderRadius: 3,
                },
                itemStyle: {
                  color: tangColors[n.category] || "#5a5a5a",
                  opacity: 1,
                  borderColor: isSelected
                    ? "#c9a227"
                    : top10Ids.has(n.id)
                    ? "rgba(201, 162, 39, 0.9)"
                    : "rgba(60, 40, 20, 0.45)",
                  borderWidth: isSelected ? 2.5 : top10Ids.has(n.id) ? 1.6 : 0.8,
                  shadowBlur: isSelected ? 18 : top10Ids.has(n.id) ? 6 : 0,
                  shadowColor: isSelected ? "rgba(201, 162, 39, 0.75)" : "rgba(201, 162, 39, 0.45)",
                },
                emphasis: {
                  scale: 1.6,
                  label: { show: true, fontSize: 12, fontWeight: "bold", backgroundColor: "rgba(253, 251, 247, 0.92)" },
                  itemStyle: {
                    shadowBlur: 22,
                    shadowColor: "rgba(201, 162, 39, 0.75)",
                    borderColor: "#c9a227",
                    borderWidth: 2,
                  },
                },
              };
            }

            return {
              id: n.id,
              name: n.name,
              value: n.value,
              category: n.category,
              x: n.x,
              y: n.y,
              symbolSize: n.symbolSize,
              symbol: isEvent ? "rect" : "circle",
              symbolRotate: isEvent ? 45 : 0,
              label: {
                show: showLabel,
                formatter: "{b}",
                fontSize: isEvent ? 10 : 11,
                fontWeight: top10Ids.has(n.id) ? "bold" : "normal",
                color: "#451a03",
                position: isEvent ? "top" : "bottom",
                distance: isEvent ? 8 : 6,
                backgroundColor: isStarMode ? "rgba(253, 251, 247, 0.75)" : "rgba(253, 251, 247, 0.85)",
                padding: [2, 5],
                borderRadius: 4,
              },
              itemStyle: {
                color: categoryColors[n.category] || "#9ca3af",
                opacity: 1,
                borderColor: isSelected ? "#f59e0b" : "rgba(69, 26, 3, 0.35)",
                borderWidth: isSelected ? 3 : 1.8,
                shadowBlur: isSelected ? 22 : top10Ids.has(n.id) ? 10 : 0,
                shadowColor: isSelected
                  ? "rgba(245, 158, 11, 0.75)"
                  : categoryColors[n.category] || "#9ca3af",
              },
              emphasis: {
                scale: 1.25,
                label: { show: true, fontSize: 13, fontWeight: "bold", backgroundColor: "rgba(253, 251, 247, 0.92)" },
                itemStyle: {
                  shadowBlur: 20,
                  shadowColor: "rgba(245, 158, 11, 0.65)",
                  borderColor: "#f59e0b",
                  borderWidth: 2.2,
                },
              },
            };
          }),
          links: validLinks.map((l) => {
            const isHub = l.linkType === "hub";
            const weight = l.value || 1;
            if (isStarMode) {
              return {
                source: l.source,
                target: l.target,
                value: l.value,
                lineStyle: {
                  color: isHub ? "rgba(120, 80, 35, 0.06)" : "rgba(150, 82, 30, 0.14)",
                  width: isHub ? 0.5 : Math.min(1.8, 0.6 + weight * 0.1),
                  curveness: isHub ? 0.1 : 0.15,
                  opacity: isHub ? 0.45 : 0.6,
                },
                emphasis: {
                  lineStyle: {
                    color: "#c9a227",
                    width: isHub ? 0.9 : Math.min(2.4, 0.9 + weight * 0.12),
                    opacity: isHub ? 0.7 : 0.95,
                  },
                },
              };
            }
            // event / neighborhood 模式
            return {
              source: l.source,
              target: l.target,
              value: l.value,
              lineStyle: {
                color: isEventMode ? "rgba(120, 80, 35, 0.12)" : "#d6d3d1",
                width: isEventMode ? 0.9 : 1.2,
                curveness: isEventMode ? 0.08 : 0.05,
                opacity: isEventMode ? 0.65 : 0.7,
              },
              emphasis: {
                lineStyle: {
                  color: "#c9a227",
                  opacity: 0.95,
                  width: 1.6,
                },
              },
            };
          }),
          categories,
          roam: isMobile ? "scale" : true,
          draggable: mode !== "star",
          scaleLimit: { min: 0.25, max: 4 },
          lineStyle: { opacity: 0.6 },
          emphasis: isStarMode
            ? {
                focus: "adjacency",
                lineStyle: {
                  color: "#c9a227",
                  opacity: 0.95,
                },
              }
            : {
                focus: "none",
              },
        },
      ],
    };

    try {
      chartInstanceRef.current.setOption(option, true);
      // 事件局势图切换事件后自动重置视图，避免继承上一个事件的缩放/平移
      if (isEventMode) {
        chartInstanceRef.current.dispatchAction({ type: "restore" });
      }
    } catch (err) {
      console.error("ECharts setOption error:", err);
    }
  }, [data, selectedId, ready, mode]);

  function handleResetView() {
    if (chartInstanceRef.current) {
      try {
        chartInstanceRef.current.dispatchAction({ type: "restore" });
      } catch (err) {
        console.error("Reset view failed:", err);
      }
    }
  }

  return (
    <div className="relative h-full w-full">
      {!ready && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#fdfbf7]/90 text-amber-800">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
          <p className="text-base font-medium tracking-wide">正在生成大唐人物图谱……</p>
        </div>
      )}
      <button
        onClick={handleResetView}
        className="absolute right-3 top-3 z-20 rounded-lg border border-amber-200 bg-white/90 px-3 py-2 text-xs font-medium text-amber-800 shadow-sm backdrop-blur-sm transition hover:bg-amber-50 sm:py-1.5"
        title="重置视图"
      >
        ⟲ 重置视图
      </button>
      <div ref={chartRef} className="h-full w-full touch-pan-y" />
    </div>
  );
}
