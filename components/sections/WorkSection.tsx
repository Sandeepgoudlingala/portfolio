"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { projects, type Project } from "@/lib/data/projects";
import { TextRevealBlock } from "@/components/ui/text-reveal-block";

/* ── Glitch Sweep Heading with Steel-Blue (#8fb3d9) Scramble ────── */
function WorkGlitchHeading() {
  const [isActive, setIsActive] = useState(false);
  const [displayText, setDisplayText] = useState("THINGS I’VE BUILT");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    setIsActive(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const target = "THINGS I’VE BUILT";
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
    setDisplayText("THINGS I’VE BUILT");
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
      <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-archivo uppercase tracking-tight text-white flex flex-wrap items-baseline gap-3">
        <span>Things I’ve</span>{" "}
        <em className="font-serif italic font-normal capitalize tracking-normal text-white/90">
          built
        </em>
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

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [visTilt, setVisTilt] = useState({ rx: 0, ry: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  // Card pointer movement for 3D tilt & spotlight
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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

  // Dedicated tilt for the terminal box
  const handleVisPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setVisTilt({ rx: -y * 14, ry: x * 18 });
  };

  const handleVisPointerLeave = () => {
    setVisTilt({ rx: 0, ry: 0 });
  };

  // Top offset calculation for sticky stack: Card 0 sticks at 9vh, Card 1 at 9vh + 32px, etc.
  const stickyTop = `calc(9vh + ${index * 32}px)`;

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "sticky",
        top: stickyTop,
        zIndex: index + 10,
        marginBottom: index === total - 1 ? "4vh" : "14vh",
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="rounded-[28px] border border-[#333333] hover:border-[#8fb3d9]/70 bg-[linear-gradient(160deg,#141414,#000000_72%)] p-6 sm:p-10 md:p-12 overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.85)] hover:shadow-[0_0_50px_rgba(143,179,217,0.2)] min-h-[60vh] sm:min-h-[64vh] flex flex-col justify-center cursor-pointer cursor-hover group transition-all duration-300"
    >
      {/* Top subtle sheen line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8fb3d9]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial Cursor Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(450px circle at ${spotlight.x}% ${spotlight.y}%, rgba(143, 179, 217, 0.16), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Large Ghost Background Stroke Number */}
      <span
        className="absolute right-4 sm:right-8 -top-3 text-[20vw] sm:text-[14rem] font-black font-archivo leading-none select-none pointer-events-none text-stroke-dim"
        aria-hidden="true"
      >
        {project.number}
      </span>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Project Details */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono text-xs text-accent tracking-widest uppercase font-semibold">
              {project.meta}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden="true" />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-white/[0.05] border border-white/10 text-white/75">
              Production Build
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-archivo tracking-tight uppercase text-white group-hover:text-accent transition-colors mb-4">
            {project.title}
          </h3>

          <p className="text-sm sm:text-base text-muted font-archivo leading-relaxed max-w-xl mb-6">
            {project.description}
          </p>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <ul className="space-y-1.5 mb-6 text-xs text-white/80 font-mono">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-accent font-bold">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tech Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-semibold font-archivo bg-white/[0.05] border border-white/10 text-white/90 hover:border-accent hover:bg-accent/15 hover:text-white hover:scale-105 transition-all cursor-pointer"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* View Repo Button (Solid White) */}
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-accent hover:text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>View repo ↗</span>
            </Link>

            {/* Live Demo Button (Outline Pill) */}
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/[0.03] text-white font-bold text-xs tracking-wider uppercase hover:border-accent hover:bg-accent/15 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Live demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Tilting Terminal Visual */}
        <div className="lg:col-span-5">
          <div
            onPointerMove={handleVisPointerMove}
            onPointerLeave={handleVisPointerLeave}
            style={{
              transform: `perspective(900px) rotateX(${visTilt.rx}deg) rotateY(${visTilt.ry}deg)`,
              transition: "transform 0.15s ease-out",
            }}
            className="relative rounded-2xl border border-white/15 hover:border-accent/40 bg-[#0b0b0b] p-6 sm:p-7 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col justify-between transition-all duration-300"
          >
            {/* Background Grid Pattern Overlay */}
            <div
              className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_28px,rgba(255,255,255,0.06)_28px_29px),repeating-linear-gradient(0deg,transparent_0_28px,rgba(255,255,255,0.06)_28px_29px)] pointer-events-none"
              aria-hidden="true"
            />

            {/* Radial glow highlight */}
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_55%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,0.1),transparent_55%)] pointer-events-none"
              aria-hidden="true"
            />

            {/* Top terminal window controls (macOS Style) */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                zsh · live runtime
              </span>
            </div>

            {/* Code Snippet Box */}
            <div className="relative z-10 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 p-4 font-mono text-xs leading-relaxed text-white shadow-inner">
              <pre className="whitespace-pre-line font-mono">
                <code>{project.command}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="relative z-10 pt-24 sm:pt-32 pb-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-14 sm:mb-20">
        <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white/80 uppercase mb-4">
          02 — Selected work
        </p>

        <WorkGlitchHeading />
      </div>

      {/* Sticky Stacking Cards Container */}
      <div className="relative">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={idx}
            total={projects.length}
          />
        ))}
      </div>
    </section>
  );
}
