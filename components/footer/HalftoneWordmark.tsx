"use client";

import { useEffect, useRef } from "react";

export function HalftoneWordmark() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ht = canvasRef.current;
    if (!ht) return;
    const hx = ht.getContext("2d");
    if (!hx) return;

    const NAME = "SANDEEP";
    const HM = document.createElement("canvas");
    const hm = HM.getContext("2d");
    if (!hm) return;

    let hd: Uint8ClampedArray | null = null;
    let hw = 0;
    let hh = 0;
    let hdpr = 1;
    let HS = 9;
    let hmx = -9999;
    let hmy = -9999;
    let isVisible = false;

    function build() {
      if (!ht || !hm) return;
      hdpr = Math.min(2, window.devicePixelRatio || 1);
      hw = ht.width = Math.round(ht.clientWidth * hdpr);
      hh = ht.height = Math.round(ht.clientHeight * hdpr);
      if (!hw || !hh) return;

      HS = Math.max(6, Math.round(hw / 140));
      HM.width = hw;
      HM.height = hh;
      hm.clearRect(0, 0, hw, hh);
      hm.fillStyle = "#ffffff";
      hm.textAlign = "center";
      hm.textBaseline = "middle";

      let fs = hh * 0.9;
      hm.font = `900 ${fs}px Archivo, sans-serif`;
      const wd = hm.measureText(NAME).width;
      if (wd > hw * 0.96) {
        fs *= (hw * 0.96) / wd;
        hm.font = `900 ${fs}px Archivo, sans-serif`;
      }
      hm.fillText(NAME, hw / 2, hh / 2);
      hd = hm.getImageData(0, 0, hw, hh).data;
    }

    function draw() {
      if (!isVisible || !hd || !hx || !ht) return;
      const rc = ht.getBoundingClientRect();
      const mx2 = (hmx - rc.left) * hdpr;
      const my2 = (hmy - rc.top) * hdpr;
      hx.clearRect(0, 0, hw, hh);

      // Continuous white light beam that sweeps slowly left to right and back to the left
      const now = performance.now() * 0.00075;
      const sweepProgress = (Math.sin(now) + 1) / 2; // oscillates smoothly between 0 and 1
      const sweepX = sweepProgress * hw;
      const beamWidth = Math.max(100 * hdpr, hw * 0.16);

      for (let gy = HS / 2; gy < hh; gy += HS) {
        for (let gx = HS / 2; gx < hw; gx += HS) {
          const a = hd[((gy | 0) * hw + (gx | 0)) * 4 + 3] / 255;

          // 1. Interactive mouse/touch proximity
          const dx = gx - mx2;
          const dy = gy - my2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseK = Math.max(0, 1 - dist / (hh * 1.1));

          // 2. White light beam moving left to right and back to the left
          const beamDx = Math.abs(gx - sweepX);
          const beamDist = Math.sqrt(beamDx * beamDx + (gy - hh / 2) * (gy - hh / 2) * 0.35);
          const rawBeamK = Math.max(0, 1 - beamDist / beamWidth);
          const beamK = rawBeamK * rawBeamK * (3 - 2 * rawBeamK); // smoothstep curve

          // Combined intensity (white light beam + mouse interaction)
          const totalK = Math.min(1, mouseK * 1.2 + beamK);

          if (a > 0.04) {
            // Luminous white light illumination across letter dots
            const lightness = Math.round(50 + totalK * 50); // 50% grey to 100% brilliant white
            hx.fillStyle = `hsl(0, 0%, ${lightness}%)`;
            hx.beginPath();
            hx.arc(gx, gy, HS * 0.5 * a * (1 + totalK * 0.45), 0, Math.PI * 2);
            hx.fill();
          } else {
            // Subtle ambient grid dot glow
            hx.fillStyle = `rgba(255, 255, 255, ${0.05 + totalK * 0.22})`;
            hx.beginPath();
            hx.arc(gx, gy, hdpr * (0.65 + totalK * 0.9), 0, Math.PI * 2);
            hx.fill();
          }
        }
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      hmx = e.clientX;
      hmy = e.clientY;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Touch support for mobile devices
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        hmx = e.touches[0].clientX;
        hmy = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      setTimeout(() => {
        hmx = -9999;
        hmy = -9999;
      }, 1500);
    };
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // Intersection observer to pause render loop when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !hd) build();
      },
      { threshold: 0.1 }
    );
    observer.observe(ht);

    build();
    window.addEventListener("resize", build, { passive: true });

    let animId = 0;
    const loop = () => {
      if (isVisible) draw();
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", build);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full my-12 overflow-hidden touch-none select-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-[120px] sm:h-[180px] md:h-[240px]"
        aria-hidden="true"
      />
    </div>
  );
}
