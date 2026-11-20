"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HalftoneWordmark } from "@/components/footer/HalftoneWordmark";
import {
  FileText,
  Copy,
  Check,
} from "lucide-react";

interface GlitchSweepProps {
  baseText: string;
  glitchText: string;
  className?: string;
  href?: string;
  as?: "h2" | "a" | "div";
}

function GlitchSweep({
  baseText,
  glitchText,
  className = "",
  href,
  as: Component = "div",
}: GlitchSweepProps) {
  const [isActive, setIsActive] = useState(false);
  const [displayText, setDisplayText] = useState(glitchText);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    setIsActive(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let progress = 0;

    timerRef.current = setInterval(() => {
      setDisplayText(
        glitchText
          .split("")
          .map((c, i) => {
            if (i < progress) return glitchText[i];
            if (c === " ") return " ";
            return LETTERS[Math.floor(Math.random() * 26)];
          })
          .join("")
      );
      progress += 0.6;
      if (progress >= glitchText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplayText(glitchText);
      }
    }, 28);
  };

  const stopScramble = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setDisplayText(glitchText);
  };

  // Touch trigger: active for 2.2 seconds then reset
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

  const commonProps = {
    className: `gl-container group ${isActive ? "is-active" : ""} ${className}`,
    onMouseEnter: startScramble,
    onMouseLeave: stopScramble,
    onTouchStart: handleTouch,
    onPointerDown: handleTouch,
  };

  const content = (
    <>
      <span className="block text-white transition-opacity duration-200">
        {baseText}
      </span>
      <span
        className={`gl-overlay ${isActive ? "gl-overlay-active" : ""}`}
        aria-hidden="true"
      >
        {displayText}
      </span>
    </>
  );

  if (Component === "a" && href) {
    return (
      <a href={href} {...commonProps}>
        {content}
      </a>
    );
  }

  if (Component === "h2") {
    return (
      <h2 {...commonProps}>
        {content}
      </h2>
    );
  }

  return (
    <div {...commonProps}>
      {content}
    </div>
  );
}

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("lingalasandeepgoud1234@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  return (
    <footer
      id="contact"
      className="relative pt-24 sm:pt-36 pb-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto"
    >
      <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white/80 uppercase mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#8fb3d9] inline-block" />
        04 — Connect & Contact
      </p>

      {/* Signature Steel-Blue Glitch Sweep Heading (Active on Hover + Touch) */}
      <div className="mb-6 max-w-5xl">
        <GlitchSweep
          as="h2"
          baseText="Let’s build something that refuses to go down."
          glitchText="GET IN TOUCH"
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-archivo tracking-tight uppercase select-none cursor-pointer"
        />
      </div>

      {/* Signature Steel-Blue Glitch Sweep Email (Active on Hover + Touch) */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <GlitchSweep
          as="a"
          href="mailto:lingalasandeepgoud1234@gmail.com"
          baseText="lingalasandeepgoud1234@gmail.com"
          glitchText="SAY HELLO"
          className="inline-block text-lg sm:text-2xl md:text-3xl font-black font-archivo tracking-tight border-b-2 border-white pb-1 hover:border-[#8fb3d9] transition-colors"
        />

        <button
          onClick={copyEmail}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.04] text-xs font-mono uppercase tracking-wider text-white/80 hover:bg-[#8fb3d9] hover:text-black hover:border-[#8fb3d9] active:bg-[#8fb3d9] active:text-black transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied to clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        <a
          href="https://wa.me/919347651574"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>WhatsApp: +91 93476 51574</span>
        </a>
      </div>

      {/* Resume & Fast Actions Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <h4 className="font-archivo font-black text-lg text-white uppercase tracking-tight mb-1">
            Looking for a Software Engineer?
          </h4>
          <p className="text-xs sm:text-sm text-muted">
            Download my resume for full academic records, technical proficiencies, and project details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://drive.google.com/file/d/10zcMYfSPL16-OGSnWm5aPyteuWgNtPyo/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-xs font-archivo tracking-wider uppercase hover:bg-[#8fb3d9] hover:text-black active:bg-[#8fb3d9] active:text-black transition-all shadow-md touch-manipulation cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Download CV</span>
          </a>
        </div>
      </div>

      {/* Social Media & Action Bubbles */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 my-8 relative z-10">
        <a
          href="mailto:lingalasandeepgoud1234@gmail.com"
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white text-black font-archivo font-bold text-sm tracking-tight hover:bg-[#8fb3d9] hover:text-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          Write to me
        </a>

        <a
          href="https://github.com/Sandeepgoudlingala"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full border border-white/20 bg-[#121212] text-white font-archivo font-bold text-sm tracking-tight hover:border-[#8fb3d9] hover:bg-[#8fb3d9]/10 hover:scale-105 active:bg-[#8fb3d9] active:text-black transition-all shadow-md cursor-pointer"
        >
          <span>GitHub</span>
          <span className="text-white/70">↗</span>
        </a>

        <a
          href="https://linkedin.com/in/lingala-sandeep-goud"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full border border-white/20 bg-[#121212] text-white font-archivo font-bold text-sm tracking-tight hover:border-[#8fb3d9] hover:bg-[#8fb3d9]/10 hover:scale-105 active:bg-[#8fb3d9] active:text-black transition-all shadow-md cursor-pointer"
        >
          <span>LinkedIn</span>
          <span className="text-white/70">↗</span>
        </a>

        <a
          href="https://wa.me/919347651574"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full border border-white/20 bg-[#121212] text-white font-archivo font-bold text-sm tracking-tight hover:border-emerald-400 hover:bg-emerald-500/10 hover:scale-105 active:bg-emerald-500 active:text-black transition-all shadow-md cursor-pointer"
        >
          <span>WhatsApp</span>
          <span className="text-white/70">↗</span>
        </a>

        <Link
          href="#hero"
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full border border-white/20 bg-[#121212] text-white font-archivo font-bold text-sm tracking-tight hover:border-[#8fb3d9] hover:bg-[#8fb3d9]/10 hover:scale-105 active:bg-[#8fb3d9] active:text-black transition-all shadow-md cursor-pointer"
        >
          <span>Fall again</span>
          <span>↑</span>
        </Link>
      </div>

      {/* Halftone Canvas Wordmark with Interactive Touch Illuminations */}
      <HalftoneWordmark />

      {/* Legal Notice */}
      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="font-mono text-xs text-muted">
          © 2026 Lingala Sandeep Goud. Made with gravity.
        </p>
        <p className="font-mono text-[10px] text-muted tracking-wider">
          Next.js App Router · Vercel · Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
