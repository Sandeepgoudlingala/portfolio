"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { marqueeItemsRow1, marqueeItemsRow2 } from "@/lib/data/skills";
import { ArrowUpRight, FileText, Terminal } from "lucide-react";
import { soundEngine } from "@/lib/sound";

/* ── Glitch Sweep Heading for "Who I am" ── */
function AboutGlitchHeading() {
  const [isActive, setIsActive] = useState(false);
  const [displayText, setDisplayText] = useState("WHO I AM");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    setIsActive(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const target = "WHO I AM";
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let progress = 0;

    timerRef.current = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((c, i) => {
            if (i < progress) return target[i];
            if (c === " ") return " ";
            return LETTERS[Math.floor(Math.random() * 26)];
          })
          .join("")
      );
      progress += 0.55;
      if (progress >= target.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplayText(target);
      }
    }, 25);
  };

  const stopScramble = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setDisplayText("WHO I AM");
  };

  const handleTouch = () => {
    startScramble();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      stopScramble();
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      onTouchStart={handleTouch}
      onPointerDown={handleTouch}
      className={`gl-container group select-none cursor-pointer cursor-hover inline-block ${
        isActive ? "is-active" : ""
      }`}
    >
      <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-archivo uppercase tracking-tight text-white">
        Who I am
      </h2>
      <div
        className={`gl-overlay text-4xl sm:text-6xl md:text-7xl font-black font-archivo uppercase tracking-tight px-3 ${
          isActive ? "gl-overlay-active" : ""
        }`}
        aria-hidden="true"
      >
        {displayText}
      </div>
    </div>
  );
}

export function AboutSection() {
  const manifestoCardRef = useRef<HTMLDivElement>(null);
  const [litIndex, setLitIndex] = useState(0);

  const MANIFESTO =
    "I’m Lingala Sandeep Goud, a software engineer pursuing Integrated M.Tech at VIT-AP University. I build resilient full-stack applications with React, Node.js and modern databases, integrate generative AI into practical products, and deploy scalable cloud systems.";

  const words = useMemo(() => MANIFESTO.split(/\s+/), [MANIFESTO]);

  useEffect(() => {
    const handleScroll = () => {
      if (!manifestoCardRef.current) return;
      const rect = manifestoCardRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Scroll illumination formula
      const progress = (windowH * 0.85 - rect.top) / (rect.height + windowH * 0.25);
      const activeWordCount = Math.floor(Math.max(0, Math.min(1, progress)) * words.length);
      setLitIndex(activeWordCount);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [words.length]);

  return (
    <>
      {/* ── Marquee Band (Single Unified Line Rolling Left to Right) ── */}
      <div
        onPointerDown={() => soundEngine.playMarqueeCharge()}
        onPointerUp={() => soundEngine.playMarqueeRelease()}
        onPointerLeave={() => soundEngine.playMarqueeRelease()}
        className="py-5 sm:py-6 border-y border-white/10 bg-[#070707]/95 backdrop-blur-md overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        <div className="w-full overflow-hidden flex">
          <div className="flex w-max shrink-0 animate-marquee-right">
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {marqueeItemsRow1.concat(marqueeItemsRow2).map((item, idx) => (
                  <span
                    key={idx}
                    className="font-black font-archivo text-2xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white pr-8 flex items-center gap-6"
                  >
                    <span>{item}</span>
                    <span className="text-accent text-lg sm:text-xl drop-shadow-[0_0_12px_rgba(143,179,217,0.7)]">
                      ✦
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 01 — About / Minimalist Bento Cards ────────────────── */}
      <section
        id="about"
        className="py-24 sm:py-36 md:py-40 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto"
      >
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white/80 uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8fb3d9] inline-block" />
            01 — About Me
          </p>
          <AboutGlitchHeading />
        </div>

        {/* Minimal 2-Card Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── CARD 1 (Manifesto & Core Identity - 8 Columns) ── */}
          <div
            ref={manifestoCardRef}
            className="lg:col-span-8 rounded-3xl border border-white/10 hover:border-[#8fb3d9] bg-[#0a0a0c] hover:bg-[#0e0e12] p-7 sm:p-10 md:p-12 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(143,179,217,0.16)] flex flex-col justify-between"
          >
            {/* Top Sheen Line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8fb3d9]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              aria-hidden="true"
            />

            <div>
              {/* Badge & Identity Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/20 flex items-center justify-center font-black font-archivo text-white text-base shadow-inner group-hover:border-[#8fb3d9] transition-colors">
                    SG
                  </div>
                  <div>
                    <h3 className="font-archivo font-bold text-white text-base sm:text-lg tracking-tight">
                      Lingala Sandeep Goud
                    </h3>
                    <p className="font-mono text-xs text-muted">
                      Software Engineer · VIT-AP University
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for Hire</span>
                </div>
              </div>

              {/* Dynamic Scroll-Illuminated Text */}
              <p className="text-xl sm:text-3xl md:text-4xl font-bold font-archivo tracking-tight leading-[1.32] my-2 select-text">
                {words.map((word, i) => {
                  const isLit = i < litIndex;
                  return (
                    <span
                      key={i}
                      className={`transition-colors duration-300 ${
                        isLit ? "text-white" : "text-[#3a3732]"
                      }`}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Minimal Footer Row */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-white/80">VIT-AP · CGPA 7.56</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-white/60">
                <span>Hyderabad, India</span>
                <span>·</span>
                <span>Full-Stack & AI</span>
              </div>
            </div>
          </div>

          {/* ── CARD 2 (Quick Profile & Resume Link - 4 Columns) ── */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 hover:border-[#8fb3d9] bg-[#0a0a0c] hover:bg-[#0e0e12] p-6 sm:p-8 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(143,179,217,0.16)] flex flex-col justify-between">
            {/* Top Sheen Line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8fb3d9]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              aria-hidden="true"
            />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-widest text-[#8fb3d9] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Quick Overview
                </span>
                <span className="font-mono text-[11px] text-white/40">2022 — Present</span>
              </div>

              {/* Minimalist Specs */}
              <div className="space-y-4 font-archivo">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
                    Degree & University
                  </span>
                  <p className="text-sm font-bold text-white">
                    Integrated M.Tech (Software Engineering)
                  </p>
                  <p className="text-xs text-white/70 font-mono mt-0.5">
                    VIT-AP University · 7.56 CGPA
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
                    Core Languages
                  </span>
                  <p className="text-xs font-mono text-white/90">
                    Java · JavaScript · Python · SQL
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
                    Primary Technologies
                  </span>
                  <p className="text-xs font-mono text-white/90">
                    React.js · Node.js · Express.js · MySQL · MongoDB · Gemini API
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">
                    Location & Status
                  </span>
                  <p className="text-xs font-mono text-emerald-400">
                    Hyderabad, India · Open to Roles
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Google Drive Resume Button */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="https://drive.google.com/file/d/10zcMYfSPL16-OGSnWm5aPyteuWgNtPyo/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white text-black font-archivo font-bold text-xs uppercase tracking-wider hover:bg-[#8fb3d9] hover:text-black active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Resume</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
