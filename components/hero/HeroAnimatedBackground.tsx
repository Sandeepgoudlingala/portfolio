"use client";

import { useEffect, useRef } from "react";

interface HeroAnimatedBackgroundProps {
  lightPos: { x: number; y: number };
  tilt: { rx: number; ry: number };
}

export function HeroAnimatedBackground({ lightPos, tilt }: HeroAnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef(tilt);

  // Keep tiltRef updated without triggering useEffect re-runs
  useEffect(() => {
    tiltRef.current = tilt;
  }, [tilt]);

  useEffect(() => {
    const container = containerRef.current;
    const shapesContainer = shapesRef.current;
    if (!container || !shapesContainer) return;

    // Elements with data-d depth values
    const shapeEls = Array.from(shapesContainer.querySelectorAll<HTMLElement>(".sh"));
    const shs = shapeEls.map((el) => ({
      el,
      d: Number(el.dataset.d) || 50,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
    }));

    let heroOn = true;
    const observer = new IntersectionObserver((entries) => {
      heroOn = entries[0].isIntersecting;
    });
    observer.observe(container);

    function kick(x: number, y: number, pw: number, rad: number) {
      shs.forEach((s) => {
        const r = s.el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - x;
        const dy = r.top + r.height / 2 - y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < rad) {
          const f = (1 - dist / rad) * pw;
          s.vx += (dx / dist) * f;
          s.vy += (dy / dist) * f;
        }
      });
    }

    const onPointerDown = (e: PointerEvent) => {
      container.classList.add("used");
      kick(e.clientX, e.clientY, 26, 420);

      const r = container.getBoundingClientRect();
      const t = document.createElement("i");
      t.className = "tap";
      t.style.left = e.clientX - r.left + "px";
      t.style.top = e.clientY - r.top + "px";
      container.appendChild(t);
      setTimeout(() => {
        t.remove();
      }, 900);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.buttons) {
        kick(e.clientX, e.clientY, 1.8, 260);
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let animId = 0;

    const loop = () => {
      if (heroOn) {
        const currentTilt = tiltRef.current;
        const tx = currentTilt.ry / 16;
        const ty = -currentTilt.rx / 12;

        shs.forEach((s) => {
          s.vx += -s.ox * 0.04;
          s.vy += -s.oy * 0.04;
          s.vx *= 0.9;
          s.vy *= 0.9;
          s.ox += s.vx;
          s.oy += s.vy;
          s.el.style.transform = `translate3d(${s.ox - tx * s.d * 2}px, ${s.oy - ty * s.d * 2}px, 0)`;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      observer.disconnect();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animId);
    };
  }, []); // Run ONCE on mount

  return (
    <div
      ref={containerRef}
      className="hg absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* 1. Subtle pointer spotlight behind hero */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(500px 500px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, .09), transparent 70%)`,
        }}
      />

      {/* 2. Planetary Horizon Arc (.hz) */}
      <div className="hz" />

      {/* 3. Floating Interactive Glass Capsule Shapes (.sh) */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div
          className="sh"
          data-d="70"
          style={
            {
              "--w": "min(48vw, 560px)",
              "--h": "clamp(36px, 11vw, 130px)",
              "--r": "12deg",
              "--dl": ".3s",
              left: "-8%",
              top: "16%",
            } as React.CSSProperties
          }
        >
          <i />
        </div>
        <div
          className="sh"
          data-d="50"
          style={
            {
              "--w": "min(40vw, 460px)",
              "--h": "clamp(32px, 9vw, 110px)",
              "--r": "-15deg",
              "--dl": ".5s",
              right: "-4%",
              top: "58%",
            } as React.CSSProperties
          }
        >
          <i />
        </div>
        <div
          className="sh"
          data-d="40"
          style={
            {
              "--w": "min(26vw, 300px)",
              "--h": "clamp(26px, 6vw, 80px)",
              "--r": "-8deg",
              "--dl": ".7s",
              left: "6%",
              bottom: "8%",
            } as React.CSSProperties
          }
        >
          <i />
        </div>
        <div
          className="sh"
          data-d="90"
          style={
            {
              "--w": "min(18vw, 220px)",
              "--h": "clamp(20px, 4.6vw, 60px)",
              "--r": "20deg",
              "--dl": ".9s",
              right: "18%",
              top: "10%",
            } as React.CSSProperties
          }
        >
          <i />
        </div>
        <div
          className="sh"
          data-d="110"
          style={
            {
              "--w": "min(12vw, 150px)",
              "--h": "clamp(16px, 3.4vw, 42px)",
              "--r": "-25deg",
              "--dl": "1.1s",
              left: "28%",
              top: "6%",
            } as React.CSSProperties
          }
        >
          <i />
        </div>
      </div>

      <p className="hint mono">Tap or drag</p>
    </div>
  );
}
