"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HalftoneWordmark } from "@/components/footer/HalftoneWordmark";
import {
  FileText,
  Copy,
  Check,
  X,
  Send,
  Loader2,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setFormError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setFormStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white text-black font-archivo font-bold text-sm tracking-tight hover:bg-[#8fb3d9] hover:text-black hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
        >
          Write to me
        </button>

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

      {/* ── Direct Message Modal ─────────────────────────────── */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#0c0c0e] p-6 sm:p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Sheen Line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8fb3d9] to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#8fb3d9] block mb-1">
                  Direct Channel
                </span>
                <h3 className="font-archivo font-black text-2xl text-white uppercase tracking-tight">
                  Write To Me
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            {formStatus === "success" ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-archivo font-bold text-xl text-white">
                  Message Dispatched!
                </h4>
                <p className="font-archivo text-xs sm:text-sm text-muted max-w-sm mx-auto">
                  Thank you! Your message was transmitted. I will review and get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormStatus("idle");
                  }}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-archivo font-bold text-xs uppercase tracking-wider hover:bg-[#8fb3d9] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm font-archivo focus:outline-none focus:border-[#8fb3d9] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm font-archivo focus:outline-none focus:border-[#8fb3d9] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hello Sandeep, I'd like to discuss a role..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-sm font-archivo focus:outline-none focus:border-[#8fb3d9] transition-colors resize-none"
                  />
                </div>

                {formError && (
                  <p className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                    {formError}
                  </p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href="mailto:lingalasandeepgoud1234@gmail.com"
                    className="text-[11px] font-mono text-white/50 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Or open desktop email client ↗
                  </a>

                  <button
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white text-black font-archivo font-bold text-xs uppercase tracking-wider hover:bg-[#8fb3d9] hover:text-black active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {formStatus === "loading" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
