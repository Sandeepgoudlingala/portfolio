"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { skillBentoTiles, categorizedSkills, type SkillCategory } from "@/lib/data/skills";
import { TextRevealBlock } from "@/components/ui/text-reveal-block";

/* ── Glitch Sweep Heading for "What I do" ── */
function SkillsGlitchHeading() {
  const [isActive, setIsActive] = useState(false);
  const [displayText, setDisplayText] = useState("WHAT I DO");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    setIsActive(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const target = "WHAT I DO";
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
    setDisplayText("WHAT I DO");
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
      {/* Base Heading */}
      <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-archivo uppercase tracking-tight text-white">
        What I do
      </h2>

      {/* Signature Steel-Blue Glitch Sweep Overlay */}
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

/* ── Interactive Category Card with 3D Tilt, Cursor Spotlight & Animated Chips ── */
function InteractiveCategoryCard({
  cat,
  index,
  total,
}: {
  cat: SkillCategory;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      rx: -(y - 0.5) * 10,
      ry: (x - 0.5) * 12,
    });
    setSpotlight({
      x: x * 100,
      y: y * 100,
      opacity: 1,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const padNum = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -6 }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 0.15s ease-out, border-color 0.25s, box-shadow 0.25s",
      }}
      className="relative p-6 sm:p-7 rounded-3xl border border-white/10 hover:border-[#8fb3d9] bg-[#0a0a0c] hover:bg-[#0e0e12] hover:shadow-[0_20px_50px_rgba(143,179,217,0.22)] flex flex-col justify-between overflow-hidden group cursor-pointer cursor-hover transition-all duration-300"
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(350px circle at ${spotlight.x}% ${spotlight.y}%, rgba(143, 179, 217, 0.2), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Top subtle sheen line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8fb3d9]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Category Index & Status Kicker */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-[10px] tracking-widest uppercase text-accent font-semibold">
            {padNum} // 0{total}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent group-hover:scale-125 transition-all" />
        </div>

        <h3 className="font-archivo font-black text-lg sm:text-xl text-white uppercase tracking-tight mb-2.5 group-hover:text-accent transition-colors">
          {cat.title}
        </h3>

        <p className="text-xs sm:text-sm text-muted font-archivo leading-relaxed mb-6">
          {cat.description}
        </p>
      </div>

      {/* Animated Interactive Skill Chips */}
      <div className="relative z-10 flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
        {cat.skills.map((s, chipIdx) => (
          <motion.span
            key={s}
            whileHover={{ scale: 1.06, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] border border-white/10 text-white/80 hover:text-white hover:bg-white/[0.08] hover:border-accent/40 hover:shadow-[0_0_15px_rgba(143,179,217,0.25)] transition-all cursor-default"
          >
            {s}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Interactive Bento Hero Tile with Spotlight & 3D Tilt ── */
function InteractiveBentoTile({
  tile,
  index,
}: {
  tile: (typeof skillBentoTiles)[0];
  index: number;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      rx: -(y - 0.5) * 8,
      ry: (x - 0.5) * 10,
    });
    setSpotlight({
      x: x * 100,
      y: y * 100,
      opacity: 1,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={tileRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 0.15s ease-out, border-color 0.25s",
      }}
      className={`relative rounded-3xl border border-white/10 hover:border-[#8fb3d9] bg-[#0a0a0c] hover:bg-[#0e0e12] p-6 sm:p-8 flex flex-col justify-between overflow-hidden group hover:shadow-[0_20px_50px_rgba(143,179,217,0.22)] cursor-pointer cursor-hover transition-all duration-300 ${
        tile.wide ? "md:col-span-3 lg:col-span-4" : "md:col-span-3 lg:col-span-2"
      }`}
    >
      {/* Top subtle sheen line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8fb3d9]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />

      {/* Spotlight Glow Highlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(400px circle at ${spotlight.x}% ${spotlight.y}%, rgba(143, 179, 217, 0.18), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {tile.icon && (
          <span className="font-archivo font-black text-2xl sm:text-3xl text-white mb-4 block group-hover:scale-110 group-hover:text-accent transition-all duration-300">
            {tile.icon}
          </span>
        )}
        <h3 className="text-xl sm:text-2xl font-black font-archivo tracking-tight uppercase text-white mb-3">
          {tile.title}
        </h3>
        {tile.copy && (
          <p className="text-sm text-muted font-archivo leading-relaxed">
            {tile.copy}
          </p>
        )}
      </div>

      {/* Chips if present */}
      {tile.chips && (
        <div className="relative z-10 flex flex-wrap gap-2 mt-6">
          {tile.chips.map((chip) => (
            <motion.span
              key={chip}
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="px-3 py-1 rounded-full text-xs font-semibold font-archivo bg-white/[0.04] border border-white/10 text-white/85 hover:text-white hover:border-accent hover:bg-accent/15 transition-all cursor-pointer"
            >
              {chip}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="relative z-10 py-24 sm:py-36 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 sm:mb-16">
        <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white/80 uppercase mb-4">
          03 — Skills
        </p>
        <SkillsGlitchHeading />
      </div>

      {/* Bento Grid Top Section with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-16">
        {skillBentoTiles.map((tile, i) => (
          <InteractiveBentoTile key={i} tile={tile} index={i} />
        ))}
      </div>

      {/* Categorized Skills Breakdown with 3D Tilt, Cursor Spotlight & Animated Chips */}
      <div className="pt-10 border-t border-white/10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Specialized Disciplines // Interactive Matrix
          </p>
          <span className="font-mono text-[10px] tracking-wider uppercase text-white/40">
            Hover to explore
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorizedSkills.map((cat, idx) => (
            <InteractiveCategoryCard
              key={cat.title}
              cat={cat}
              index={idx}
              total={categorizedSkills.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
