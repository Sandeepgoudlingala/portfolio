"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", name: "01 The leap" },
  { id: "about", name: "02 About" },
  { id: "work", name: "03 Work" },
  { id: "skills", name: "04 Skills" },
  { id: "contact", name: "05 Contact" },
];

export function Hud() {
  const [activeSection, setActiveSection] = useState("01 The leap");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [altitude, setAltitude] = useState(12400);
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setIstTime(
          now.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
      } catch {
        // fallback
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      setScrollProgress(progress);
      setAltitude(Math.round((1 - progress) * 12400));

      // Determine active section
      let current = SECTIONS[0].name;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            current = SECTIONS[i].name;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      className="fixed bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 z-30 pointer-events-none flex items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] tracking-widest text-muted mix-blend-difference select-none"
      aria-label="Page scroll progress hud"
    >
      {/* Active Section Label & Live IST Time */}
      <div className="flex items-center gap-3 w-40 sm:w-52">
        <span className="uppercase truncate">{activeSection}</span>
        {istTime && (
          <span className="hidden md:inline text-white/40 border-l border-white/20 pl-3">
            HYD · {istTime} IST
          </span>
        )}
      </div>

      {/* Progress Track */}
      <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden max-w-xl mx-auto">
        <div
          className="h-full bg-white transition-[width] duration-75 ease-out"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* Altitude Counter */}
      <span className="w-32 sm:w-36 text-right uppercase">
        Altitude {altitude.toLocaleString()} m
      </span>
    </aside>
  );
}
