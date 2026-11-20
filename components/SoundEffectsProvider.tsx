"use client";

import { useEffect, useRef } from "react";
import { soundEngine } from "@/lib/sound";

export function SoundEffectsProvider({ children }: { children: React.ReactNode }) {
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);
  const scrollStopTimer = useRef<NodeJS.Timeout | null>(null);
  const lastHoverTarget = useRef<EventTarget | null>(null);
  const lastHoverTime = useRef(0);

  useEffect(() => {
    // 1. Global Click (Select)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, [role='button'], input[type='submit'], .gl-container, .cursor-pointer"
      );
      if (interactive) {
        soundEngine.playSelect();
      }
    };

    // 2. Global Hover Tick (Throttled)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target === lastHoverTarget.current) return;

      const interactive = target.closest(
        "a, button, [role='button'], .cursor-pointer, input, textarea"
      );
      if (interactive && interactive !== lastHoverTarget.current) {
        lastHoverTarget.current = interactive;
        const now = Date.now();
        if (now - lastHoverTime.current > 40) {
          lastHoverTime.current = now;
          soundEngine.playHoverTick();
        }
      }
    };

    // 3. Scroll Tick & Wind Modulation
    const handleScroll = () => {
      const currentY = window.scrollY;
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime.current);
      const dy = Math.abs(currentY - lastScrollY.current);
      const speed = Math.min(25, (dy / dt) * 10); // normalized speed

      lastScrollY.current = currentY;
      lastScrollTime.current = now;

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      soundEngine.handleScroll(currentY, docHeight, speed);

      // Reset wind sound shortly after scroll stops
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
      scrollStopTimer.current = setTimeout(() => {
        soundEngine.stopWind();
      }, 140);
    };

    // 4. Touch Pop, Drag Tone & Release Thud
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, [role='button'], input, textarea");
      if (!interactive && e.touches.length > 0) {
        const normY = e.touches[0].clientY / window.innerHeight;
        soundEngine.playTouchPop(normY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const normY = e.touches[0].clientY / window.innerHeight;
        soundEngine.playDragTone(normY);
      }
    };

    const handleTouchEnd = () => {
      soundEngine.playReleaseThud();
    };

    // 5. Coin sound on card scroll into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            soundEngine.playCoin();
          }
        });
      },
      { threshold: 0.35 }
    );

    const observeCards = () => {
      const cards = document.querySelectorAll(
        "article, .tile, [data-sound='coin']"
      );
      cards.forEach((c) => observer.observe(c));
    };

    // 6. Section Level-Up sound
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const currentIdx = ["hero", "about", "work", "skills", "contact"].indexOf(
              entry.target.id
            );
            soundEngine.notifySection(entry.target.id, currentIdx >= 0);
          }
        });
      },
      { threshold: 0.25 }
    );

    const observeSections = () => {
      const sections = document.querySelectorAll("section, footer#contact");
      sections.forEach((s) => sectionObserver.observe(s));
    };

    // 7. Hero Boing on Hero Tap/Click
    const heroEl = document.getElementById("hero");
    const handleHeroClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("a, button, [role='button']")) {
        soundEngine.playHeroBoing();
      }
    };
    if (heroEl) {
      heroEl.addEventListener("click", handleHeroClick);
    }

    // Attach listeners
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Initial observer hook
    const timer = setTimeout(() => {
      observeCards();
      observeSections();
    }, 500);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (heroEl) {
        heroEl.removeEventListener("click", handleHeroClick);
      }
      clearTimeout(timer);
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
}
