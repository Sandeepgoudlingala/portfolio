"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface MenuItem {
  n: string;
  label: string;
  hover: string;
  href: string;
}

const MENU_ITEMS: MenuItem[] = [
  { n: "01", label: "The leap", hover: "START", href: "#hero" },
  { n: "02", label: "About", hover: "WHO I AM", href: "#about" },
  { n: "03", label: "Selected work", hover: "THINGS I BUILT", href: "#work" },
  { n: "04", label: "Skills", hover: "WHAT I DO", href: "#skills" },
  { n: "05", label: "Contact", hover: "LET’S TALK", href: "#contact" },
];

/* ── Glitch Heading with Steel-Blue (#8fb3d9) Sweep ─────────────── */
function MenuGlitchHeading() {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState("SANDEEP GOUD");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const onEnter = () => {
    setIsHovered(true);
    let iter = 0;
    const target = "SOFTWARE ENGINEER";
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((c, i) =>
            i < iter
              ? target[i]
              : c === " "
              ? " "
              : LETTERS[Math.floor(Math.random() * 26)]
          )
          .join("")
      );
      iter += 0.45;
      if (iter >= target.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplayText(target);
      }
    }, 28);
  };

  const onLeave = () => {
    setIsHovered(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayText("SANDEEP GOUD");
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="gl-container cursor-pointer select-none mb-8 sm:mb-12"
    >
      {/* Base White Heading */}
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-archivo tracking-tight text-white uppercase">
        SANDEEP GOUD
      </h2>

      {/* Steel-Blue Sweep Overlay */}
      <div
        className={`gl-overlay text-2xl sm:text-4xl md:text-5xl font-black font-archivo tracking-tight px-1 ${
          isHovered ? "gl-overlay-active" : ""
        }`}
      >
        {displayText}
      </div>
    </div>
  );
}

/* ── Menu Link with Steel-Blue (#8fb3d9) Sweep & Scramble ───────── */
function MenuGlitchLink({
  item,
  onNavigate,
}: {
  item: MenuItem;
  onNavigate: (href: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [displayText, setDisplayText] = useState(item.label);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const scrambleTo = (target: string, onFinish?: () => void) => {
    let iter = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((c, i) =>
            i < iter
              ? target[i]
              : c === " "
              ? " "
              : LETTERS[Math.floor(Math.random() * 26)]
          )
          .join("")
      );
      iter += 0.45;
      if (iter >= target.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplayText(target);
        if (onFinish) onFinish();
      }
    }, 25);
  };

  const onEnter = () => {
    setIsHovered(true);
    scrambleTo(item.hover);
  };

  const onLeave = () => {
    if (isActivating) return;
    setIsHovered(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayText(item.label);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsActivating(true);
    setIsHovered(true);
    scrambleTo(item.hover, () => {
      setTimeout(() => {
        onNavigate(item.href);
      }, 350);
    });
  };

  return (
    <li className="flex items-baseline gap-4 sm:gap-6">
      <span className="font-mono text-xs sm:text-sm text-muted font-normal select-none">
        {item.n}
      </span>
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={handleClick}
        className="gl-container cursor-pointer transition-transform duration-200 hover:translate-x-3.5"
      >
        {/* Base Dim Heading */}
        <span className="text-3xl sm:text-5xl md:text-6xl font-black font-archivo tracking-tight text-[#4a4743] hover:text-white transition-colors duration-200 block">
          {item.label}
        </span>

        {/* Steel-Blue Sweep Overlay */}
        <div
          className={`gl-overlay text-3xl sm:text-5xl md:text-6xl font-black font-archivo tracking-tight px-1.5 ${
            isHovered || isActivating ? "gl-overlay-active" : ""
          }`}
        >
          {displayText}
        </div>
      </div>
    </li>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Keyboard navigation: Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Web Audio API ambient drone toggle (Exact frequencies from sandeep-anim.html: 55Hz, 82.4Hz, 110.5Hz)
  const toggleSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        const freqs = [55, 82.4, 110.5];
        const gains = [0.035, 0.02, 0.01];

        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          const g = ctx.createGain();
          g.gain.setValueAtTime(gains[i], ctx.currentTime);

          osc.connect(g);
          g.connect(masterGain);
          osc.start();
        });
      }

      const ctx = audioCtxRef.current;
      const masterGain = gainNodeRef.current;
      if (!ctx || !masterGain) return;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (!isAudioPlaying) {
        masterGain.gain.setTargetAtTime(0.05, ctx.currentTime, 0.15);
        setIsAudioPlaying(true);
      } else {
        masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
        setIsAudioPlaying(false);
      }
    } catch {
      // AudioContext fallback
    }
  };

  // Smooth scroll handler
  const handleNavigate = (href: string) => {
    setIsOpen(false);
    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── Fixed Nav Bar ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white">
        <nav
          className="grid grid-cols-3 items-center px-4 sm:px-8 py-5 text-[11px] font-bold font-archivo tracking-[0.14em] uppercase"
          aria-label="Main Navigation"
        >
          {/* Left: Menu Button */}
          <div>
            <button
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              aria-controls="fullscreen-menu"
              className="text-white hover:text-accent transition-colors py-1 focus-visible:outline-accent"
            >
              Menu
            </button>
          </div>

          {/* Center: Branding */}
          <div className="text-center">
            <Link
              href="#hero"
              className="inline-flex items-baseline gap-2 font-black tracking-wider group"
            >
              <span>SANDEEP</span>
              <span className="opacity-55 font-semibold text-[9px] hidden sm:inline">
                SOFTWARE ENGINEER
              </span>
            </Link>
          </div>

          {/* Right: Sound Toggle + Contact */}
          <div className="justify-self-end flex items-center gap-4 sm:gap-7">
            {/* Sound Toggle with Equalizer Bars from sandeep-anim.html */}
            <button
              onClick={toggleSound}
              aria-pressed={isAudioPlaying}
              aria-label="Toggle ambient sound"
              className="group flex items-center gap-2 text-white hover:text-accent transition-colors py-1 cursor-pointer focus-visible:outline-accent"
            >
              <span className="hidden sm:inline text-[10px] tracking-widest text-white/70 group-hover:text-white">
                {isAudioPlaying ? "Sound on" : "Sound off"}
              </span>
              <span className="flex items-end gap-[2px] h-[10px] pb-[1px]" aria-hidden="true">
                <span
                  className={`w-[2px] bg-white transition-all ${
                    isAudioPlaying ? "animate-bar-1" : "h-[3px]"
                  }`}
                />
                <span
                  className={`w-[2px] bg-white transition-all ${
                    isAudioPlaying ? "animate-bar-2" : "h-[3px]"
                  }`}
                />
                <span
                  className={`w-[2px] bg-white transition-all ${
                    isAudioPlaying ? "animate-bar-3" : "h-[3px]"
                  }`}
                />
                <span
                  className={`w-[2px] bg-white transition-all ${
                    isAudioPlaying ? "animate-bar-4" : "h-[3px]"
                  }`}
                />
              </span>
            </button>

            {/* Let's Talk */}
            <Link
              href="#contact"
              className="text-white hover:text-accent transition-colors py-1"
            >
              Let’s talk
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Fullscreen Glitch Menu Overlay ───────────────────────── */}
      <div
        id="fullscreen-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed inset-0 z-40 bg-[rgba(7,6,5,0.97)] backdrop-blur-md flex flex-col justify-between p-6 sm:p-12 md:p-16 transition-all duration-400 ease-out ${
          isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Giant Background Watermark */}
        <span
          className="absolute left-6 sm:left-12 bottom-0 text-[20vw] sm:text-[22vw] font-black font-archivo text-white/[0.035] leading-none pointer-events-none select-none"
          aria-hidden="true"
        >
          SANDEEP
        </span>

        {/* Top bar: Close Button */}
        <div className="flex justify-between items-center z-10">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="text-muted hover:text-white font-mono text-xs tracking-widest uppercase transition-colors py-2"
          >
            [Close ✕]
          </button>
        </div>

        {/* Center: Glitch Heading + Links */}
        <div className="my-auto z-10 max-w-4xl">
          {/* Glitch Heading with Steel-Blue Sweep */}
          <MenuGlitchHeading />

          {/* Links list with Steel-Blue Sweep on each link */}
          <ol className="space-y-4 sm:space-y-6">
            {MENU_ITEMS.map((item) => (
              <MenuGlitchLink
                key={item.n}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}
          </ol>
        </div>

        {/* Bottom bar: Esc notice */}
        <div className="z-10">
          <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
            Press Esc to close
          </span>
        </div>
      </div>
    </>
  );
}
