"use client";

import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDownRight, FileText } from "lucide-react";
import Image from "next/image";
import { HeroAnimatedBackground } from "@/components/hero/HeroAnimatedBackground";

export function HeroSection() {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLElement>(null);

  // 3D Pointer tracking & spotlight
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      rx: -(y - 0.5) * 12,
      ry: (x - 0.5) * 16,
    });
    setLightPos({
      x: x * 100,
      y: y * 100,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const name1 = "Sandeep".split("");
  const name2 = "Goud".split("");

  return (
    <section
      id="hero"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-[100svh] flex flex-col justify-end pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-8 md:px-12 overflow-hidden bg-transparent"
    >
      {/* Animated Interactive Hero Background from sandeep-anim (2).html */}
      <HeroAnimatedBackground lightPos={lightPos} tilt={tilt} />

      <div className="relative z-20 max-w-7xl w-full mx-auto">
        {/* Minimal Kicker Line (Replacing bulky badge) */}
        <div className="mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 text-white/70 font-mono text-xs uppercase tracking-[0.24em]"
          >
            <span className="w-8 sm:w-12 h-[1px] bg-accent/60" />
            <span>Software Engineer · Cloud & Full-Stack</span>
          </motion.div>
        </div>

        {/* Hero Middle Content: Headline + Large Hero Portrait Showcase */}
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 sm:mb-12">
          {/* 3D Tilting Name Headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: "transform 0.18s ease-out",
            }}
            className="select-none z-10"
          >
            <h1
              className="text-[14vw] sm:text-[12vw] md:text-[8.5rem] lg:text-[9.5rem] leading-[0.88] font-black font-archivo uppercase tracking-tighter"
              aria-label="Sandeep Goud"
            >
              {/* Line 1: Sandeep (solid with dynamic spotlight lighting) */}
              <div className="flex flex-wrap">
                {name1.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, transform: "translateZ(300px) rotateX(-90deg)" }}
                    animate={{ opacity: 1, transform: "none" }}
                    transition={{
                      duration: 1,
                      delay: i * 0.06 + 0.1,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    style={{
                      backgroundImage: `radial-gradient(320px circle at ${lightPos.x}% ${lightPos.y}%, #ffffff 0%, #e2e8f0 35%, #94a3b8 70%, #475569 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Line 2: Goud (outline stroke) */}
              <div className="flex flex-wrap text-stroke-2">
                {name2.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, transform: "translateZ(300px) rotateX(-90deg)" }}
                    animate={{ opacity: 1, transform: "none" }}
                    transition={{
                      duration: 1,
                      delay: (name1.length + i) * 0.06 + 0.1,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </h1>
          </motion.div>

          {/* Large Hero Portrait Showcase with Smooth Rotating Circular Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="self-center lg:self-end flex items-center justify-center select-none z-20 shrink-0"
          >
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
              {/* Ambient Radial Glow Aura */}
              <div className="absolute inset-0 rounded-full bg-[#8fb3d9]/15 blur-3xl pointer-events-none" />

              {/* Orbiting Rotating Typography Ring (SVG Exact Arc) */}
              <svg
                viewBox="0 0 300 300"
                className="absolute inset-0 w-full h-full animate-spin-20s will-change-transform pointer-events-none"
              >
                <path
                  id="heroRingPath"
                  d="M 150, 150 m -122, 0 a 122,122 0 1,1 244,0 a 122,122 0 1,1 -244,0"
                  fill="none"
                />
                <text className="font-mono text-[9px] uppercase tracking-[0.24em] fill-white/70 font-semibold">
                  <textPath href="#heroRingPath" startOffset="0%">
                    ✦ SANDEEP GOUD ✦ SOFTWARE ENGINEER ✦ VIT-AP ✦ FULL-STACK DEVELOPER
                  </textPath>
                </text>
              </svg>

              {/* Substantial High-Resolution Hero Portrait Photo */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full border-2 border-white/40 bg-zinc-950 p-1 shadow-[0_0_40px_rgba(143,179,217,0.3)] transition-transform duration-500 hover:scale-105 group">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-900">
                  <Image
                    src="/sandeep.jpg"
                    alt="Lingala Sandeep Goud"
                    fill
                    sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, 240px"
                    className="object-cover object-[center_16%] scale-105"
                    priority
                  />
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subhead, Credentials & Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-xl">
            <p className="font-mono text-xs sm:text-sm text-accent uppercase tracking-widest mb-2 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Hire · VIT-AP University</span>
            </p>
            <p className="text-sm sm:text-base font-archivo text-muted leading-relaxed">
              Integrated M.Tech in Software Engineering at VIT-AP University.
              Building resilient full-stack systems, modern architectures, and generative AI integrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#work"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold font-archivo text-xs uppercase tracking-wider hover:bg-accent hover:text-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Selected Work</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>

            <a
              href="https://drive.google.com/file/d/10zcMYfSPL16-OGSnWm5aPyteuWgNtPyo/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 bg-white/[0.04] text-xs font-mono tracking-wider uppercase text-white/90 hover:bg-[#8fb3d9] hover:text-black hover:border-[#8fb3d9] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>Resume</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
