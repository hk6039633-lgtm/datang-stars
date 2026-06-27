"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Character, HistoricalEvent, BookTimelineEvent } from "../types";
import {
  GALAXIES,
  type GalaxyMeta,
  type RelationType,
  RELATION_COLORS,
  buildCharacterEdges,
  getRepresentatives,
  getNeighbors,
  getGalaxyRelatedEvents,
  getGalaxyByCharacter,
  getRelationLabel,
} from "../lib/galaxyData";
import { CharacterAvatar } from "./CharacterAvatar";
import { TangTag } from "./TangTag";
import { TangPanel } from "./TangPanel";
import GalaxyBackground from "./GalaxyBackground";

type ViewMode = "overview" | "galaxy" | "character";
type PathItem = { type: "galaxy" | "character"; id: string; name: string };

interface NodeItem {
  id: string;
  label: string;
  kind: "galaxy" | "character";
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  data: GalaxyMeta | Character;
  opacity: number;
  targetOpacity: number;
  scale: number;
  targetScale: number;
  pulse: number;
  edgeType?: RelationType;
  isAncestor?: boolean;
}

interface GalaxyExplorerProps {
  characters: Character[];
  events: HistoricalEvent[];
  bookEvents: BookTimelineEvent[];
}

export default function GalaxyExplorer({ characters, events, bookEvents }: GalaxyExplorerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<NodeItem[]>([]);
  const modeRef = useRef<ViewMode>("overview");
  const dimsRef = useRef({ width: 0, height: 0, dpr: 1, worldScale: 1, isMobile: false });
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const animationRef = useRef<number>(0);
  const cameraRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, scale: 1, targetScale: 1 });

  const [mode, setMode] = useState<ViewMode>("overview");
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyMeta | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [hovered, setHovered] = useState<NodeItem | null>(null);
  const [hoveredLine, setHoveredLine] = useState<{ target: string; label: string } | null>(null);
  const hoveredLineRef = useRef<{ target: string; label: string } | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [path, setPath] = useState<PathItem[]>([]);
  const [, setRenderTick] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const charMap = useMemo(() => new Map(characters.map((c) => [c.id, c])), [characters]);
  const edges = useMemo(() => buildCharacterEdges(characters, events, bookEvents), [characters, events, bookEvents]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    hoveredLineRef.current = hoveredLine;
  }, [hoveredLine]);

  const ensureImage = (src?: string) => {
    if (!src) return undefined;
    const cache = imageCacheRef.current;
    if (cache.has(src)) return cache.get(src);
    const img = new Image();
    img.src = src;
    img.onload = () => cache.set(src, img);
    return undefined;
  };

  const buildNodes = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const rect = wrapper.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = width < 640;
    const baseScale = Math.min(width, height) * (isMobile ? 0.55 : 0.42);
    dimsRef.current = { width, height, dpr, worldScale: baseScale, isMobile };
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const { worldScale } = dimsRef.current;
    const mobileRadiusFactor = isMobile ? 1.4 : 1;
    const oldMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    const selectedGalaxyWorld = selectedGalaxy ? galaxyWorldPos(selectedGalaxy, worldScale) : { x: 0, y: 0 };
    const selectedCharWorld = selectedCharacter && selectedGalaxy ? selectedGalaxyWorld : { x: 0, y: 0 };

    // 移动端首屏单独布局：按屏幕比例分布，确保全部可见
    const mobileSpread = Math.min(width, height) * 0.38;
    const mobileOverviewLayout: Record<string, { x: number; y: number }> = {
      imperial: { x: 0, y: 0 },
      royal: { x: 0.55, y: -0.42 },
      ministers: { x: -0.55, y: -0.42 },
      court: { x: 0, y: -0.62 },
      military: { x: 0.55, y: 0.42 },
      jiedushi: { x: -0.55, y: 0.42 },
      rebel: { x: 0, y: 0.62 },
      literati: { x: 0.72, y: -0.12 },
      frontier: { x: -0.72, y: -0.12 },
      others: { x: 0, y: 0.78 },
    };

    const nextNodes: NodeItem[] = [];

    // 星系节点始终存在
    for (const g of GALAXIES) {
      const pos = isMobile && mode === "overview"
        ? { x: mobileOverviewLayout[g.id].x * mobileSpread, y: mobileOverviewLayout[g.id].y * mobileSpread }
        : galaxyWorldPos(g, worldScale);
      const isSelected = selectedGalaxy?.id === g.id;

      let targetOpacity = 1;
      let targetScale = 1;
      if (mode === "overview") {
        targetOpacity = 0.95;
        targetScale = hovered?.id === g.id && hovered.kind === "galaxy" ? 1.15 : 1;
      } else if (mode === "galaxy") {
        targetOpacity = isSelected ? 1 : 0.22;
        targetScale = isSelected ? 1.45 : 0.72;
      } else {
        targetOpacity = isSelected ? 0.35 : 0.12;
        targetScale = isSelected ? 0.9 : 0.55;
      }

      const radius = isMobile && mode === "overview"
        ? (g.id === "imperial" ? 52 : 38)
        : worldScale * 0.13;

      nextNodes.push(
        createNode({
          old: oldMap.get(g.id),
          id: g.id,
          label: g.name,
          kind: "galaxy",
          x: pos.x,
          y: pos.y,
          radius,
          color: g.accent,
          data: g,
          targetOpacity,
          targetScale,
        })
      );
    }

    // 星系主星人物
    if (mode === "galaxy" && selectedGalaxy) {
      const reps = getRepresentatives(selectedGalaxy, characters);
      const orbit = worldScale * 0.30;
      reps.forEach((c, i) => {
        const angle = reps.length === 1 ? -Math.PI / 2 : (i / reps.length) * Math.PI * 2 - Math.PI / 2;
        nextNodes.push(
          createNode({
            old: oldMap.get(c.id),
            id: c.id,
            label: c.name,
            kind: "character",
            x: selectedGalaxyWorld.x + Math.cos(angle) * orbit,
            y: selectedGalaxyWorld.y + Math.sin(angle) * orbit,
            radius: worldScale * 0.06 * mobileRadiusFactor,
            color: selectedGalaxy.accent,
            data: c,
            targetOpacity: 1,
            targetScale: hovered?.id === c.id ? 1.2 : 1,
          })
        );
      });
    }

    // 人物关系视图
    if (mode === "character" && selectedCharacter && selectedGalaxy) {
      // 同一星系的其他 representative 暗淡显示
      const reps = getRepresentatives(selectedGalaxy, characters).filter((c) => c.id !== selectedCharacter.id);
      const repOrbit = worldScale * 0.30;
      reps.forEach((c, i) => {
        const angle = reps.length === 1 ? -Math.PI / 2 : (i / reps.length) * Math.PI * 2 - Math.PI / 2;
        nextNodes.push(
          createNode({
            old: oldMap.get(`rep-${c.id}`),
            id: `rep-${c.id}`,
            label: c.name,
            kind: "character",
            x: selectedCharWorld.x + Math.cos(angle) * repOrbit,
            y: selectedCharWorld.y + Math.sin(angle) * repOrbit,
            radius: worldScale * 0.04 * mobileRadiusFactor,
            color: selectedGalaxy.accent,
            data: c,
            targetOpacity: 0.18,
            targetScale: 0.8,
          })
        );
      });

      // 探索路径上的前序人物（上一层保持可见，可点击返回）
      const history = path.filter((p) => p.type === "character" && p.id !== selectedCharacter.id);
      const historyOrbit = worldScale * 0.34;
      history.forEach((p, i) => {
        const c = charMap.get(p.id)!;
        const angle = -Math.PI * 0.72 + (i - (history.length - 1) / 2) * 0.35;
        nextNodes.push(
          createNode({
            old: oldMap.get(`ancestor-${c.id}`),
            id: `ancestor-${c.id}`,
            label: c.name,
            kind: "character",
            x: selectedCharWorld.x + Math.cos(angle) * historyOrbit,
            y: selectedCharWorld.y + Math.sin(angle) * historyOrbit,
            radius: worldScale * 0.05 * mobileRadiusFactor,
            color: selectedGalaxy.accent,
            data: c,
            targetOpacity: 0.45,
            targetScale: 0.9,
            isAncestor: true,
          })
        );
      });

      // 中心人物
      nextNodes.push(
        createNode({
          old: oldMap.get(selectedCharacter.id),
          id: selectedCharacter.id,
          label: selectedCharacter.name,
          kind: "character",
          x: selectedCharWorld.x,
          y: selectedCharWorld.y,
          radius: worldScale * 0.08 * mobileRadiusFactor,
          color: selectedGalaxy.accent,
          data: selectedCharacter,
          targetOpacity: 1,
          targetScale: 1.45,
        })
      );

      // 关系近邻 —— 按关系类型分方向、按重要程度分远近，带自然错落
      const neighbors = getNeighbors(selectedCharacter.id, edges, characters, 16);
      const nOrbit = worldScale * 0.48;
      const typeSectors: Record<RelationType, { base: number; spread: number; outer?: boolean }> = {
        royal: { base: -Math.PI * 0.68, spread: 0.85 }, // 上方 / 左上
        minister: { base: -Math.PI, spread: 0.65 }, // 左侧
        military: { base: Math.PI / 2, spread: 0.75 }, // 下方
        conflict: { base: 0.18, spread: 0.65 }, // 右侧 / 右下
        culture: { base: -Math.PI * 0.25, spread: 0.55 }, // 右上
        event: { base: Math.PI * 0.75, spread: 0.85, outer: true }, // 外围补充
      };
      const groups: Record<RelationType, typeof neighbors> = {
        royal: [],
        minister: [],
        military: [],
        conflict: [],
        culture: [],
        event: [],
      };
      for (const edge of neighbors) groups[edge.type].push(edge);

      (Object.entries(groups) as [RelationType, typeof neighbors][]).forEach(([type, group]) => {
        group.sort((a, b) => b.weight - a.weight);
        const cfg = typeSectors[type];
        group.forEach((edge, i) => {
          const count = Math.max(group.length - 1, 1);
          const offset = group.length === 1 ? 0 : (i - (group.length - 1) / 2) * (cfg.spread / count);
          const jitter = Math.sin(i * 2.7 + group.length) * 0.08;
          const angle = cfg.base + offset + jitter;
          const importance = 1 - i / Math.max(group.length - 1, 1);
          const dist = nOrbit * (cfg.outer ? 1.15 : 1) * (0.58 + (1 - importance) * 0.42);
          const c = charMap.get(edge.target)!;
          nextNodes.push(
            createNode({
              old: oldMap.get(edge.target),
              id: edge.target,
              label: c.name,
              kind: "character",
              x: selectedCharWorld.x + Math.cos(angle) * dist,
              y: selectedCharWorld.y + Math.sin(angle) * dist,
              radius: worldScale * 0.058 * mobileRadiusFactor,
              color: RELATION_COLORS[edge.type],
              data: c,
              targetOpacity: 1,
              targetScale: hovered?.id === edge.target ? 1.18 : 1,
              edgeType: edge.type,
            })
          );
        });
      });
    }

    nodesRef.current = nextNodes;

    // 相机目标
    const mobileScale = isMobile ? 0.85 : 1;
    if (mode === "overview") {
      cameraRef.current.targetX = 0;
      cameraRef.current.targetY = 0;
      cameraRef.current.targetScale = isFullscreen ? 1.22 : mobileScale;
    } else if (mode === "galaxy" && selectedGalaxy) {
      cameraRef.current.targetX = selectedGalaxyWorld.x;
      cameraRef.current.targetY = selectedGalaxyWorld.y;
      cameraRef.current.targetScale = isFullscreen ? 1.8 : 1.48 * mobileScale;
    } else if (mode === "character" && selectedCharacter) {
      cameraRef.current.targetX = selectedCharWorld.x;
      cameraRef.current.targetY = selectedCharWorld.y;
      cameraRef.current.targetScale = isFullscreen ? 2.1 : 1.75 * mobileScale;
    }

    setRenderTick((v) => v + 1);
  }, [mode, selectedGalaxy, selectedCharacter, characters, edges, charMap, hovered, isFullscreen]);

  useEffect(() => {
    buildNodes();
  }, [buildNodes]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => buildNodes());
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [buildNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.01;
      const { width, height, dpr } = dimsRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // 更新相机
      const cam = cameraRef.current;
      cam.x += (cam.targetX - cam.x) * 0.05;
      cam.y += (cam.targetY - cam.y) * 0.05;
      cam.scale += (cam.targetScale - cam.scale) * 0.05;

      // 更新节点
      for (const n of nodesRef.current) {
        n.x += (n.targetX - n.x) * 0.08;
        n.y += (n.targetY - n.y) * 0.08;
        n.opacity += (n.targetOpacity - n.opacity) * 0.08;
        n.scale += (n.targetScale - n.scale) * 0.08;
      }

      // 相机变换
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(cam.scale, cam.scale);
      ctx.translate(-cam.x, -cam.y);

      // 按 opacity 排序，先画暗淡背景
      const sorted = [...nodesRef.current].sort((a, b) => a.opacity - b.opacity);

      // 关系线（仅人物视图）
      if (modeRef.current === "character") {
        const center = sorted.find((n) => n.id === selectedCharacter?.id && n.kind === "character");
        if (center) {
          for (const n of sorted) {
            if (n.kind === "character" && n.id !== center.id && n.opacity > 0.1 && n.edgeType) {
              drawRelationLine(ctx, center, n, time);
            }
          }
        }
      }

      for (const n of sorted) {
        if (n.opacity <= 0.01) continue;
        if (n.kind === "galaxy") drawGalaxyNode(ctx, n, time);
        else drawCharacterNode(ctx, n, time);
      }

      ctx.restore();
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [selectedCharacter?.id]);

  const drawRelationLine = (ctx: CanvasRenderingContext2D, a: NodeItem, b: NodeItem, time: number) => {
    const color = b.edgeType ? RELATION_COLORS[b.edgeType] : a.color;
    const isHovered = hoveredLineRef.current?.target === b.id;
    const lineOpacity = Math.min(1, b.opacity * (isHovered ? 3.5 : 2.5));
    if (lineOpacity <= 0.02) return;

    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, hexWithAlpha(color, 0.95 * lineOpacity));
    grad.addColorStop(0.5, hexWithAlpha(color, 0.45 * lineOpacity));
    grad.addColorStop(1, hexWithAlpha(color, 0));

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    // 外层发光光纤
    ctx.strokeStyle = grad;
    ctx.lineWidth = isHovered ? 5 : 3;
    ctx.shadowBlur = isHovered ? 22 : 16;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    // 内芯
    ctx.strokeStyle = hexWithAlpha("#fff8e7", (isHovered ? 0.55 : 0.35) * lineOpacity);
    ctx.lineWidth = isHovered ? 1.8 : 1;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#fff8e7";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    // 流动光点
    const t = (time * 0.45 + b.pulse) % 1;
    const px = a.x + (b.x - a.x) * t;
    const py = a.y + (b.y - a.y) * t;
    ctx.fillStyle = "#fff8e7";
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawGalaxyNode = (ctx: CanvasRenderingContext2D, n: NodeItem, time: number) => {
    const breath = 1 + Math.sin(time * 1.2 + n.pulse) * 0.035;
    const r = n.radius * n.scale * breath;
    const isHovered = hovered?.id === n.id && hovered.kind === "galaxy";
    const brightness = isHovered ? 1.35 : 1;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // 柔和星云团（不规则偏移）
    const cloudCount = 7;
    for (let i = 0; i < cloudCount; i++) {
      const angle = n.pulse + i * 1.27 + time * 0.05;
      const dist = r * (0.15 + (i % 4) * 0.22);
      const size = r * (0.85 + i * 0.16);
      const alpha = (0.055 + (i % 3) * 0.022) * n.opacity * brightness;
      const grd = ctx.createRadialGradient(
        n.x + Math.cos(angle) * dist,
        n.y + Math.sin(angle) * dist * 0.6,
        0,
        n.x,
        n.y,
        size
      );
      grd.addColorStop(0, hexWithAlpha(n.color, alpha * 1.6));
      grd.addColorStop(0.45, hexWithAlpha(n.color, alpha * 0.7));
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 中心亮核（柔和，不像按钮）
    const core = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 0.55);
    core.addColorStop(0, hexWithAlpha("#fff8e7", 0.75 * n.opacity * brightness));
    core.addColorStop(0.3, hexWithAlpha(n.color, 0.42 * n.opacity * brightness));
    core.addColorStop(0.75, hexWithAlpha(n.color, 0.1 * n.opacity * brightness));
    core.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // 微弱能量环
    ctx.strokeStyle = hexWithAlpha(n.color, 0.32 * n.opacity * brightness);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(n.x, n.y, r * 1.25, r * 0.82, time * 0.12 + n.pulse, 0, Math.PI * 2);
    ctx.stroke();

    // 旋臂暗示（更自然）
    ctx.save();
    ctx.strokeStyle = hexWithAlpha(n.color, 0.16 * n.opacity * brightness);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    for (let arm = 0; arm < 2; arm++) {
      ctx.beginPath();
      const a0 = n.pulse + arm * Math.PI + time * 0.04;
      for (let t = 0.03; t <= 1; t += 0.035) {
        const a = a0 + t * 2.3;
        const rr = r * (0.25 + t * 1.9);
        const px = n.x + Math.cos(a) * rr;
        const py = n.y + Math.sin(a) * rr * 0.7;
        if (t === 0.03) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();

    // 星尘扩散
    for (let i = 0; i < 36; i++) {
      const a = n.pulse * 2 + i * 0.42 + time * 0.1;
      const rr = r * (0.35 + (i % 8) * 0.16);
      const px = n.x + Math.cos(a) * rr;
      const py = n.y + Math.sin(a) * rr * (0.6 + 0.15 * Math.sin(time + i));
      const sz = 0.5 + (i % 3) * 0.35;
      ctx.globalAlpha = (0.25 + 0.45 * Math.sin(time * 1.5 + i)) * n.opacity * brightness;
      ctx.fillStyle = hexWithAlpha("#fff8e7", 1);
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // 名称标注
    ctx.save();
    ctx.globalAlpha = n.opacity;
    ctx.fillStyle = "#fff8e7";
    ctx.font = `600 ${Math.max(13, r * 0.22)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.95)";
    ctx.shadowBlur = 8;
    ctx.fillText(n.label, n.x, n.y + r + Math.max(16, r * 0.28));
    ctx.shadowBlur = 0;
    ctx.restore();
  };

  const drawCharacterNode = (ctx: CanvasRenderingContext2D, n: NodeItem, time: number) => {
    const char = n.data as Character;
    const src = char.avatarPath || char.effectiveAvatarPath;
    const img = src ? ensureImage(src) : undefined;
    const r = n.radius * n.scale;
    const isCenter = n.scale > 1.1;
    const breath = 1 + Math.sin(time * 2 + n.pulse) * 0.025;

    ctx.save();
    ctx.globalAlpha = n.opacity;
    ctx.globalCompositeOperation = "lighter";

    // 外层全息光晕
    const halo = ctx.createRadialGradient(n.x, n.y, r * 0.55, n.x, n.y, r * (isCenter ? 3.2 : 2.6));
    halo.addColorStop(0, hexWithAlpha(n.color, isCenter ? 0.5 : 0.32));
    halo.addColorStop(0.4, hexWithAlpha(n.color, isCenter ? 0.18 : 0.1));
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * (isCenter ? 3.2 : 2.6), 0, Math.PI * 2);
    ctx.fill();

    // 背后光盘
    const disc = ctx.createRadialGradient(n.x, n.y, r * 0.75, n.x, n.y, r * 1.7);
    disc.addColorStop(0, "rgba(255,255,255,0.07)");
    disc.addColorStop(0.45, hexWithAlpha(n.color, 0.16));
    disc.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * 1.7, 0, Math.PI * 2);
    ctx.fill();

    // 选中涟漪（多层）
    if (isCenter) {
      for (let k = 0; k < 2; k++) {
        const ripple = ((time * 0.7 + n.pulse + k * 0.5) % 1);
        ctx.strokeStyle = hexWithAlpha(n.color, (1 - ripple) * 0.45);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * (1 + ripple * 0.95) * breath, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();

    // 头像
    ctx.save();
    ctx.globalAlpha = n.opacity;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.clip();

    if (img && img.complete && img.naturalWidth) {
      const s = Math.max(img.width, img.height);
      const d = r * 2;
      const sx = (img.width - s) / 2;
      const sy = 0;
      ctx.drawImage(img, sx, sy, s, s, n.x - r, n.y - r, d, d);
    } else {
      const grad = ctx.createLinearGradient(n.x - r, n.y - r, n.x + r, n.y + r);
      grad.addColorStop(0, "#1f1b2e");
      grad.addColorStop(1, "#0a0812");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.fillStyle = n.color;
      ctx.font = `600 ${Math.max(12, r * 0.7)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(char.name.charAt(0), n.x, n.y + 1);
    }
    ctx.restore();

    // 金色能量环
    ctx.save();
    ctx.globalAlpha = n.opacity;
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = isCenter ? 3.5 : r >= 28 ? 2.2 : 1.5;
    ctx.shadowBlur = isCenter ? 18 : 12;
    ctx.shadowColor = n.color;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.stroke();

    // 外层辉光环
    ctx.strokeStyle = hexWithAlpha(n.color, isCenter ? 0.7 : 0.5);
    ctx.lineWidth = isCenter ? 2 : 1.2;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * (isCenter ? 1.28 : 1.18) * breath, 0, Math.PI * 2);
    ctx.stroke();

    // 中心主星装饰环
    if (isCenter) {
      ctx.strokeStyle = hexWithAlpha("#fbbf24", 0.35);
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 1.45, time * 0.5, time * 0.5 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 上一层人物虚线回归环
    if (n.isAncestor) {
      ctx.strokeStyle = hexWithAlpha(n.color, 0.35);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // 姓名（暗淡 rep 节点不渲染标签，避免 clutter）
    if (n.targetOpacity >= 0.3) {
      ctx.save();
      ctx.globalAlpha = n.opacity;
      ctx.fillStyle = "#fff8e7";
      ctx.font = isCenter
        ? `700 ${Math.max(15, Math.round(r * 0.55))}px system-ui`
        : `600 ${Math.max(13, Math.round(r * 0.5))}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.95)";
      ctx.shadowBlur = 6;
      const nameY = n.y + r + (isCenter ? Math.max(18, r * 0.42) : Math.max(20, r * 0.7));
      ctx.fillText(n.label, n.x, nameY);
      if (isCenter && char.role) {
      ctx.font = "500 11px system-ui";
      ctx.fillStyle = "#e8d5b5";
      ctx.fillText(char.role, n.x, nameY + 16);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  };

  const galaxyWorldPos = (g: GalaxyMeta, worldScale: number) => ({
    x: g.layout.x * worldScale,
    y: g.layout.y * worldScale,
  });

  const createNode = (opts: {
    old?: NodeItem;
    id: string;
    label: string;
    kind: "galaxy" | "character";
    x: number;
    y: number;
    radius: number;
    color: string;
    data: GalaxyMeta | Character;
    targetOpacity: number;
    targetScale: number;
    edgeType?: RelationType;
    isAncestor?: boolean;
  }): NodeItem => {
    const old = opts.old;
    const floatOffset = opts.kind === "character" ? 22 : 12;
    return {
      id: opts.id,
      label: opts.label,
      kind: opts.kind,
      x: old ? old.x : opts.x + (Math.random() - 0.5) * 10,
      y: old ? old.y : opts.y + floatOffset,
      targetX: opts.x,
      targetY: opts.y,
      radius: opts.radius,
      color: opts.color,
      data: opts.data,
      opacity: old ? old.opacity : 0,
      targetOpacity: opts.targetOpacity,
      scale: old ? old.scale : 0.01,
      targetScale: opts.targetScale,
      pulse: old ? old.pulse : Math.random() * Math.PI * 2,
      edgeType: opts.edgeType,
      isAncestor: opts.isAncestor,
    };
  };

  const hexWithAlpha = (hex: string, alpha: number) => {
    const h = hex.replace("#", "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getWorldMouse = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { width, height } = dimsRef.current;
    const cam = cameraRef.current;
    return {
      x: cam.x + (mx - width / 2) / cam.scale,
      y: cam.y + (my - height / 2) / cam.scale,
    };
  };

  const distToSegment = (p: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) => {
    const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + t * (b.x - a.x)), p.y - (a.y + t * (b.y - a.y)));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getWorldMouse(e);
    const hit = nodesRef.current
      .filter((n) => n.opacity > 0.15)
      .sort((a, b) => {
        const priorityA = a.kind === "character" ? 0 : 1;
        const priorityB = b.kind === "character" ? 0 : 1;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return a.radius * a.scale - b.radius * b.scale;
      })
      .find((n) => Math.hypot(n.x - pos.x, n.y - pos.y) <= n.radius * n.scale + 4 / cameraRef.current.scale);

    if (hit?.id !== hovered?.id) {
      setHovered(hit || null);
      if (hit) setHoveredLine(null);
      // 触发节点目标 scale 更新
      buildNodes();
    }

    // 关系线 hover
    if (!hit && modeRef.current === "character" && selectedCharacter) {
      const center = nodesRef.current.find((n) => n.id === selectedCharacter.id && n.kind === "character");
      if (center) {
        const threshold = dimsRef.current.isMobile ? 24 : 10 / cameraRef.current.scale;
        const near = nodesRef.current
          .filter((n) => n.kind === "character" && n.id !== selectedCharacter.id && !n.isAncestor && n.opacity > 0.15 && n.edgeType)
          .map((n) => ({ n, d: distToSegment(pos, center, n) }))
          .filter((x) => x.d <= threshold)
          .sort((a, b) => a.d - b.d)[0];
        if (near) {
          const label = getRelationLabel(selectedCharacter.id, near.n.id, edges) || "关系";
          setHoveredLine({ target: near.n.id, label: `${selectedCharacter.name} → ${near.n.label}：${label}` });
        } else if (hoveredLine) {
          setHoveredLine(null);
        }
      }
    } else if (!hit && hoveredLine) {
      setHoveredLine(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const pos = getWorldMouse(e);
    const hit = nodesRef.current
      .filter((n) => n.opacity > 0.15)
      .sort((a, b) => {
        const priorityA = a.kind === "character" ? 0 : 1;
        const priorityB = b.kind === "character" ? 0 : 1;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return a.radius * a.scale - b.radius * b.scale;
      })
      .find((n) => Math.hypot(n.x - pos.x, n.y - pos.y) <= n.radius * n.scale + 6 / cameraRef.current.scale);
    if (!hit) return;

    if (hit.kind === "galaxy") {
      const galaxy = hit.data as GalaxyMeta;
      setSelectedGalaxy(galaxy);
      setSelectedCharacter(null);
      setMode("galaxy");
      setPath([{ type: "galaxy", id: galaxy.id, name: galaxy.name }]);
      setPanelOpen(true);
    } else {
      const char = hit.data as Character;
      if (hit.isAncestor) {
        const idx = path.findIndex((p) => p.type === "character" && p.id === char.id);
        setSelectedCharacter(char);
        setMode("character");
        setPath(idx >= 0 ? path.slice(0, idx + 1) : [{ type: "galaxy", id: selectedGalaxy?.id ?? GALAXIES[0].id, name: selectedGalaxy?.name ?? GALAXIES[0].name }, { type: "character", id: char.id, name: char.name }]);
        setPanelOpen(true);
      } else {
        setSelectedCharacter(char);
        setMode("character");
        setPath((prev) => {
          const existingIdx = prev.findIndex((p) => p.type === "character" && p.id === char.id);
          if (existingIdx >= 0) return prev.slice(0, existingIdx + 1);
          return [...prev, { type: "character", id: char.id, name: char.name }];
        });
        setPanelOpen(true);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (dimsRef.current.isMobile) return;
    const pos = getWorldMouse(e);
    const clickPad = 6 / cameraRef.current.scale;
    const hit = nodesRef.current
      .filter((n) => n.opacity > 0.15 && n.kind === "character")
      .sort((a, b) => a.radius * a.scale - b.radius * b.scale)
      .find((n) => Math.hypot(n.x - pos.x, n.y - pos.y) <= n.radius * n.scale + clickPad);
    if (hit) {
      const char = hit.data as Character;
      window.open(`/characters/${char.id}`, "_blank");
    }
  };

  const getTouchClientPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    return e.touches[0] || e.changedTouches[0];
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = getTouchClientPos(e);
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    handleMouseMove({ clientX: t.clientX, clientY: t.clientY } as unknown as React.MouseEvent<HTMLCanvasElement>);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = getTouchClientPos(e);
    if (!t) return;
    handleMouseMove({ clientX: t.clientX, clientY: t.clientY } as unknown as React.MouseEvent<HTMLCanvasElement>);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = e.changedTouches[0];
    if (!t || !touchStartRef.current) return;
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    if (Math.hypot(dx, dy) < 10) {
      handleClick({ clientX: t.clientX, clientY: t.clientY } as unknown as React.MouseEvent<HTMLCanvasElement>);
    }
    touchStartRef.current = null;
  };

  const backOneLevel = () => {
    if (path.length <= 1) {
      goOverview();
      return;
    }
    const newPath = path.slice(0, -1);
    setPath(newPath);
    const last = newPath[newPath.length - 1];
    if (last.type === "galaxy") {
      const g = GALAXIES.find((x) => x.id === last.id)!;
      setSelectedGalaxy(g);
      setSelectedCharacter(null);
      setMode("galaxy");
    } else {
      const c = charMap.get(last.id)!;
      setSelectedCharacter(c);
      setMode("character");
    }
  };

  const backToCurrentGalaxy = () => {
    if (!selectedGalaxy) return;
    setSelectedCharacter(null);
    setMode("galaxy");
    setPath((prev) => (prev[0]?.type === "galaxy" ? [prev[0]] : [{ type: "galaxy", id: selectedGalaxy.id, name: selectedGalaxy.name }]));
  };

  const goOverview = () => {
    setMode("overview");
    setSelectedGalaxy(null);
    setSelectedCharacter(null);
    setPath([]);
    setPanelOpen(false);
  };

  const clearPath = () => {
    goOverview();
  };

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;
    try {
      if (!isFullscreen) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if ((document as any).webkitExitFullscreen) await (document as any).webkitExitFullscreen();
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!(document as any).fullscreenElement || !!(document as any).webkitFullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isFullscreen) {
        toggleFullscreen();
      } else if (modeRef.current !== "overview") {
        backOneLevel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, backOneLevel]);

  const renderPanel = () => {
    if (mode === "overview") {
      return (
        <TangPanel className="h-full !border-amber-700/20 !bg-[#0b0912]/85 text-amber-50" title="大唐星河探索" titleClassName="!text-amber-50">
          <p className="text-sm leading-relaxed text-amber-100/80">
            穿越黑金星河，从十大星系总览到人物关系网，层层入局探索大唐 890 位历史人物的光谱。
          </p>
          <div className="mt-5 space-y-2">
            <div className="text-xs font-medium text-amber-300/70">当前层级</div>
            <div className="flex items-center gap-2 text-sm text-amber-100">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
              星系总览
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="text-xs font-medium text-amber-300/70">操作提示</div>
            <ul className="space-y-2 text-xs text-amber-100/70">
              <li>• 点击发光星云星系进入主星</li>
              <li>• 点击全息人物星徽查看关系网络</li>
              <li>• 双击人物跳转人物详情</li>
              <li>• 右下角切换全屏沉浸</li>
            </ul>
          </div>
        </TangPanel>
      );
    }

    if (mode === "galaxy" && selectedGalaxy) {
      const reps = getRepresentatives(selectedGalaxy, characters);
      const related = getGalaxyRelatedEvents(selectedGalaxy, characters, events, 6);
      return (
        <TangPanel className="h-full !border-amber-700/20 !bg-[#0b0912]/85 text-amber-50" title={selectedGalaxy.name} titleClassName="!text-amber-50">
          <p className="text-sm leading-relaxed text-amber-100/80">{selectedGalaxy.desc}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedGalaxy.categories.map((c) => (
              <TangTag key={c} variant="category" className="border-amber-600/40 bg-amber-900/30 text-amber-50">
                {c}
              </TangTag>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs font-medium text-amber-300/70">星系主星</div>
            <div className="flex flex-wrap gap-2">
              {reps.slice(0, 10).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCharacter(c);
                    setMode("character");
                    setPath((prev) => [...prev.slice(0, 1), { type: "character", id: c.id, name: c.name }]);
                  }}
                  className="group relative"
                  title={c.name}
                >
                  <CharacterAvatar character={c} size="sm" className="group-hover:ring-2 ring-amber-400/60" />
                </button>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 text-xs font-medium text-amber-300/70">关联事件</div>
              <div className="space-y-2">
                {related.map((evt) => (
                  <div
                    key={evt.id}
                    className="block rounded-md border border-amber-700/20 bg-amber-900/20 px-3 py-2 text-xs text-amber-100/80"
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TangPanel>
      );
    }

    if (mode === "character" && selectedCharacter) {
      const galaxy = selectedGalaxy || getGalaxyByCharacter(selectedCharacter);
      const neighborEdges = getNeighbors(selectedCharacter.id, edges, characters, 14);
      const charEvents = events.filter((e) => e.characters.some((c) => c.id === selectedCharacter.id)).slice(0, 8);
      return (
        <TangPanel
          className="h-full !border-amber-700/20 !bg-[#0b0912]/85 text-amber-50"
          titleClassName="!text-amber-50"
          title={
            <div className="flex items-center gap-3">
              <CharacterAvatar character={selectedCharacter} size="sm" />
              <span>{selectedCharacter.name}</span>
            </div>
          }
        >
          <div className="flex flex-wrap gap-2">
            <TangTag variant="category" className="border-amber-600/40 bg-amber-900/30 text-amber-50">
              {selectedCharacter.primaryCategory}
            </TangTag>
            {selectedCharacter.role && (
              <TangTag variant="default" className="border-amber-600/40 bg-amber-900/20 text-amber-50">
                {selectedCharacter.role}
              </TangTag>
            )}
          </div>

          <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-amber-100/80">
            {selectedCharacter.summary || "暂无简介"}
          </p>

          {selectedCharacter.aliases && selectedCharacter.aliases.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCharacter.aliases.slice(0, 6).map((a) => (
                <TangTag key={a} variant="alias" className="border-amber-700/30 bg-amber-900/20 text-amber-100">
                  {a}
                </TangTag>
              ))}
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-md border border-amber-700/20 bg-amber-900/20 px-3 py-2">
              <div className="text-amber-300/60">提及次数</div>
              <div className="mt-1 text-lg font-semibold text-amber-100">{selectedCharacter.mentions ?? 0}</div>
            </div>
            <div className="rounded-md border border-amber-700/20 bg-amber-900/20 px-3 py-2">
              <div className="text-amber-300/60">历史权重</div>
              <div className="mt-1 text-lg font-semibold text-amber-100">{selectedCharacter.historicalImportanceScore ?? 0}</div>
            </div>
          </div>

          {neighborEdges.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-medium text-amber-300/70">关系近邻</div>
              <div className="flex flex-wrap gap-2">
                {neighborEdges.map((edge) => {
                  const c = charMap.get(edge.target)!;
                  return (
                    <button
                      key={edge.target}
                      onClick={() => {
                        setSelectedCharacter(c);
                        setPath((prev) => [...prev, { type: "character", id: c.id, name: c.name }]);
                      }}
                      title={c.name}
                      className="relative"
                    >
                      <span
                        className="absolute inset-0 rounded-full"
                        style={{ boxShadow: `0 0 8px ${RELATION_COLORS[edge.type]}` }}
                      />
                      <CharacterAvatar character={c} size="sm" />
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-amber-200/60">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RELATION_COLORS.royal }} />血缘/皇室</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RELATION_COLORS.minister }} />君臣/辅佐</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RELATION_COLORS.conflict }} />冲突/政敌</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RELATION_COLORS.culture }} />文脉/文化</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: RELATION_COLORS.event }} />事件共现</span>
              </div>
            </div>
          )}

          {charEvents.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-medium text-amber-300/70">出场事件</div>
              <div className="space-y-2">
                {charEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="block rounded-md border border-amber-700/20 bg-amber-900/20 px-3 py-2 text-xs text-amber-100/80"
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link
              href={`/characters/${selectedCharacter.id}`}
              className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
            >
              查看人物详情 →
            </Link>
          </div>
        </TangPanel>
      );
    }

    return null;
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden bg-black ${isFullscreen ? "fixed inset-0 z-50" : "h-[calc(100vh-7rem)] min-h-[520px] rounded-xl sm:h-[calc(100vh-4rem)] sm:min-h-[600px]"}`}
    >
      <GalaxyBackground />

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 touch-none ${hovered ? "cursor-pointer" : "cursor-default"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHovered(null);
          setHoveredLine(null);
          buildNodes();
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* 顶部路径与控制条 */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex flex-col items-start gap-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 text-sm text-amber-100/90">
          <button onClick={goOverview} className="rounded-md px-2 py-1 transition hover:bg-amber-900/40 hover:text-amber-50">
            星系总览
          </button>
          {path.map((p, i) => (
            <span key={`${p.type}-${p.id}`} className="flex items-center gap-1.5">
              <span className="text-amber-600">›</span>
              <button
                onClick={() => {
                  if (p.type === "galaxy") {
                    const g = GALAXIES.find((x) => x.id === p.id)!;
                    setSelectedGalaxy(g);
                    setSelectedCharacter(null);
                    setMode("galaxy");
                    setPath(path.slice(0, i + 1));
                  } else {
                    const c = charMap.get(p.id)!;
                    setSelectedCharacter(c);
                    setMode("character");
                    setPath(path.slice(0, i + 1));
                  }
                }}
                className={`rounded-md px-2 py-1 transition hover:bg-amber-900/40 ${i === path.length - 1 ? "font-semibold text-amber-50" : "text-amber-200/70 hover:text-amber-50"}`}
              >
                {p.name}
              </button>
            </span>
          ))}
        </div>

        {/* 控制条 */}
        <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible">
          {mode !== "overview" && (
            <>
              <ControlButton onClick={backOneLevel} title="返回上一层">
                返回上一层
              </ControlButton>
              {selectedGalaxy && mode === "character" && (
                <ControlButton onClick={backToCurrentGalaxy} title="回到当前星系">
                  回到当前星系
                </ControlButton>
              )}
              <ControlButton onClick={goOverview} title="回到星系总览">
                回到星系总览
              </ControlButton>
              <ControlButton onClick={clearPath} title="清空探索路径">
                清空路径
              </ControlButton>
            </>
          )}
          <ControlButton onClick={() => setPanelOpen((v) => !v)} title="切换信息面板">
            {panelOpen ? "隐藏面板" : "信息面板"}
          </ControlButton>
          <ControlButton onClick={toggleFullscreen} title="全屏沉浸">
            {isFullscreen ? "退出全屏" : "全屏"}
          </ControlButton>
        </div>
      </div>

      {/* 顶部弱提示 */}
      {mode === "overview" && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-10 -translate-x-1/2">
          <div className="rounded-full border border-amber-700/30 bg-[#0b0912]/70 px-4 py-1.5 text-xs text-amber-100/80 shadow-lg backdrop-blur-sm">
            点击星云星系，开始探索大唐星河
          </div>
        </div>
      )}

      {/* 底部探索路径 */}
      {mode !== "overview" && (
        <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 w-[calc(100%-2rem)] max-w-max -translate-x-1/2 sm:w-auto">
          <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-amber-700/30 bg-[#0b0912]/80 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm scrollbar-hide sm:px-4 sm:py-2 sm:text-sm">
            <span className="text-xs text-amber-300/60">探索路径</span>
            <button onClick={goOverview} className="text-amber-100/80 transition hover:text-amber-50">
              星系总览
            </button>
            {path.map((p, i) => (
              <span key={`bottom-${p.type}-${p.id}`} className="flex items-center gap-1.5">
                <span className="text-amber-600">›</span>
                <button
                  onClick={() => {
                    if (p.type === "galaxy") {
                      const g = GALAXIES.find((x) => x.id === p.id)!;
                      setSelectedGalaxy(g);
                      setSelectedCharacter(null);
                      setMode("galaxy");
                      setPath(path.slice(0, i + 1));
                    } else {
                      const c = charMap.get(p.id)!;
                      setSelectedCharacter(c);
                      setMode("character");
                      setPath(path.slice(0, i + 1));
                    }
                  }}
                  className={`shrink-0 transition hover:text-amber-50 ${i === path.length - 1 ? "font-semibold text-amber-50" : "text-amber-100/80"}`}
                >
                  {p.name}
                </button>
              </span>
            ))}
            <span className="mx-1 h-4 w-px bg-amber-700/50" />
            <button onClick={backOneLevel} className="text-amber-200/70 transition hover:text-amber-50">
              返回
            </button>
          </div>
        </div>
      )}

      {/* 桌面端：右侧面板 */}
      {panelOpen && !isMobile && (
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-full sm:w-80 md:w-96">
          <div className="pointer-events-auto h-full border-l border-amber-700/20 bg-black/20 backdrop-blur-sm">
            {renderPanel()}
          </div>
        </div>
      )}

      {/* 移动端：底部抽屉 */}
      {panelOpen && isMobile && (
        <div className="pointer-events-auto absolute bottom-0 left-0 right-0 z-30 flex h-[42vh] max-h-[380px] flex-col rounded-t-2xl border-t border-amber-700/30 bg-[#0b0912]/95 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-amber-700/20 px-4 py-2">
            <span className="text-xs font-medium text-amber-300/70">
              {mode === "overview" ? "大唐星河探索" : selectedCharacter?.name || selectedGalaxy?.name || "详情"}
            </span>
            <button
              onClick={() => setPanelOpen(false)}
              className="rounded-md px-2 py-1 text-xs text-amber-200 transition hover:bg-amber-900/40 hover:text-amber-50"
            >
              关闭
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderPanel()}
          </div>
        </div>
      )}

      {/* 悬停提示（节点或关系线） */}
      {(hovered || hoveredLine) && (
        <div className="pointer-events-none absolute bottom-20 left-4 z-30 rounded-md border border-amber-700/30 bg-[#0b0912]/80 px-4 py-2 text-sm text-amber-50 shadow-lg sm:bottom-6 sm:left-6">
          {hoveredLine
            ? hoveredLine.label
            : hovered?.kind === "galaxy"
            ? hovered.label
            : hovered?.kind === "character"
            ? (() => {
                const char = hovered.data as Character;
                if (hovered.isAncestor) return `点击返回 ${char.name}`;
                if (hovered.id === selectedCharacter?.id) {
                  return `${char.name} · ${char.role || char.primaryCategory}`;
                }
                const rawId = hovered.id.replace(/^ancestor-/, "");
                const label = selectedCharacter ? getRelationLabel(selectedCharacter.id, rawId, edges) : undefined;
                return `${selectedCharacter?.name} → ${char.name}：${label || "关系"}`;
              })()
            : ""}
        </div>
      )}
    </div>
  );
}

function ControlButton({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="shrink-0 rounded-md border border-amber-700/40 bg-[#0b0912]/80 px-3 py-1.5 text-xs text-amber-100 transition hover:border-amber-500/60 hover:bg-amber-900/50 hover:text-amber-50"
    >
      {children}
    </button>
  );
}
