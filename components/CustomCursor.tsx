"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on pointer fine devices (mice / trackpads)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          'a, button, [role="button"], input, textarea, select, .cursor-hover, article, [data-hover], .group'
        )
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    // Spring/lerp loop for the outer ring
    const render = () => {
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("mouseleave", handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Center 6px dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white rounded-full will-change-transform"
      />

      {/* Outer magnetic ring */}
      <div
        ref={ringRef}
        className={`absolute top-0 left-0 rounded-full border border-white transition-all duration-200 ease-out will-change-transform ${
          isHovered ? "w-16 h-16 opacity-100" : "w-9 h-9 opacity-80"
        }`}
      />
    </div>
  );
}
