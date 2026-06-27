"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  base: number;
  twinkle: number;
  layer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
}

interface Streamer {
  x: number;
  y: number;
  len: number;
  angle: number;
  speed: number;
  alpha: number;
  color: string;
}

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let streamers: Streamer[] = [];

    const isMobile = () => window.innerWidth < 640;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width || window.innerWidth;
      height = rect?.height || window.innerHeight;
      const mobile = isMobile();
      const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = [];
      const counts = mobile ? [90, 60, 35] : [180, 120, 70];
      for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < counts[layer]; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: (Math.random() * 1.2 + 0.2) * (1 + layer * 0.4),
            alpha: Math.random(),
            base: Math.random() * 0.5 + 0.15,
            twinkle: Math.random() * Math.PI * 2,
            layer,
          });
        }
      }
    };

    const addParticle = () => {
      const colors = ["#f59e0b", "#a855f7", "#0ea5e9", "#f43f5e", "#6366f1", "#d4af37"];
      const mobile = isMobile();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (mobile ? 0.15 : 0.2),
        vy: (Math.random() - 0.5) * (mobile ? 0.15 : 0.2),
        size: Math.random() * (mobile ? 1.4 : 1.8) + 0.5,
        alpha: Math.random() * 0.35 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
      if (particles.length > (mobile ? 40 : 80)) particles.shift();
    };

    const addStreamer = () => {
      streamers.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        len: Math.random() * 120 + 60,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        speed: Math.random() * 3 + 2,
        alpha: Math.random() * 0.3 + 0.15,
        color: Math.random() > 0.6 ? "#f59e0b" : "#a855f7",
      });
    };

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 深邃黑金底色
      const bg = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.5, width * 0.9);
      bg.addColorStop(0, "#110f18");
      bg.addColorStop(0.4, "#0a0810");
      bg.addColorStop(1, "#020205");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // 大面积星云团（黑金 + 墨蓝紫）
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const nebulas = [
        { x: 0.4, y: 0.25, r: 0.6, c1: "rgba(90, 55, 12, 0.22)", c2: "rgba(0,0,0,0)" },
        { x: 0.75, y: 0.6, r: 0.45, c1: "rgba(35, 25, 45, 0.22)", c2: "rgba(0,0,0,0)" },
        { x: 0.18, y: 0.72, r: 0.5, c1: "rgba(18, 32, 48, 0.18)", c2: "rgba(0,0,0,0)" },
        { x: 0.82, y: 0.18, r: 0.35, c1: "rgba(70, 45, 14, 0.16)", c2: "rgba(0,0,0,0)" },
      ];
      for (const n of nebulas) {
        const g = ctx.createRadialGradient(width * n.x, height * n.y, 0, width * n.x, height * n.y, width * n.r);
        g.addColorStop(0, n.c1);
        g.addColorStop(1, n.c2);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(width * n.x, height * n.y, width * n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 斜向流光
      if (frame % (isMobile() ? 360 : 180) === 0) addStreamer();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (let i = streamers.length - 1; i >= 0; i--) {
        const s = streamers[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.003;
        if (s.alpha <= 0 || s.x > width + s.len || s.y > height + s.len) {
          streamers.splice(i, 1);
          continue;
        }
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        grad.addColorStop(0, s.color + Math.floor(s.alpha * 255).toString(16).padStart(2, "0"));
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
      }
      ctx.restore();

      // 星尘层
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const drift = s.layer * 0.05;
        s.x += drift;
        if (s.x > width) s.x = 0;
        s.twinkle += 0.002 + s.layer * 0.001;
        const a = s.base + Math.sin(s.twinkle) * 0.18;
        ctx.fillStyle = `rgba(255, 248, 220, ${Math.max(0.04, a)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 漂移粒子
      if (frame % (isMobile() ? 20 : 10) === 0) addParticle();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.002;
        if (p.life <= 0 || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ background: "radial-gradient(ellipse at center, #0f0d16 0%, #050408 60%, #000000 100%)" }}
    />
  );
}
