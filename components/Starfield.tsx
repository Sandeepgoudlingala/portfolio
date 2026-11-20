"use client";

import { useEffect, useRef } from "react";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;

    const onResize = () => {
      if (!canvasRef.current) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvasRef.current.width = W * dpr;
      canvasRef.current.height = H * dpr;
      cx.scale(dpr, dpr);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });

    // Subtle, minimalist density (drastically reduced from 140 to 38 desktop, 18 mobile)
    const starCount = coarse ? 18 : 38;
    const S: Array<{ x: number; y: number; z: number; g: boolean }> = [];
    for (let i = 0; i < starCount; i++) {
      S.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.85 + 0.15,
        g: Math.random() < 0.45,
      });
    }

    let vel = 0;
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let animId = 0;

    // Track scroll velocity via window scroll
    const onScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastY;
      lastY = currentY;
      vel += (dy - vel) * 0.22;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Wheel event listener for instantaneous velocity kick
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        vel += e.deltaY * 0.12;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });

    // Touch event listener for mobile devices
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const dy = touchY - e.touches[0].clientY;
        touchY = e.touches[0].clientY;
        vel += dy * 0.35;
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const stars = () => {
      cx.clearRect(0, 0, W, H);
      const v = Math.min(65, Math.abs(vel));

      for (let i = 0; i < S.length; i++) {
        const s = S[i];

        // Soft, gentle upward drift when scrolling down (calm baseline, no blizzard)
        s.y -= (0.0003 + v * 0.0014) * s.z;
        if (s.y < -0.05) {
          s.y = 1.05;
          s.x = Math.random();
        } else if (s.y > 1.05) {
          s.y = -0.05;
          s.x = Math.random();
        }

        const x = s.x * W;
        const y = s.y * H;
        const len = (2.4 + v * 2.4) * s.z;

        // 1. Motion streak line trailing downward — LUXURIOUS LIGHT GOLD
        const tailAlpha = s.g ? 0.3 + s.z * 0.45 : 0.2 + s.z * 0.35;
        cx.strokeStyle = s.g
          ? `rgba(255, 226, 150, ${tailAlpha})`
          : `rgba(235, 202, 125, ${tailAlpha})`;
        cx.lineWidth = Math.max(0.9, s.z * 1.6);
        cx.lineCap = "round";
        cx.beginPath();
        cx.moveTo(x, y);
        cx.lineTo(x, y + len);
        cx.stroke();

        // 2. Luminous star dot at the head of the streak — GLOWING LIGHT GOLD
        const headAlpha = 0.45 + s.z * 0.45;
        cx.beginPath();
        cx.arc(x, y, Math.max(0.9, s.z * 1.4), 0, Math.PI * 2);
        cx.fillStyle = s.g
          ? `rgba(255, 238, 180, ${headAlpha})`
          : `rgba(245, 218, 145, ${headAlpha})`;
        cx.fill();
      }
    };

    const frame = () => {
      // Smooth velocity decay
      vel *= 0.92;

      stars();

      animId = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
