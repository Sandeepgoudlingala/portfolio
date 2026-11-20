"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealBlockProps {
  children: React.ReactNode;
  blockColor?: string;
  duration?: number;
  delay?: number;
  className?: string;
  textClassName?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  once?: boolean;
}

export function TextRevealBlock({
  children,
  blockColor = "#8fb3d9",
  duration = 0.65,
  delay = 0.1,
  className = "",
  textClassName = "",
  as: Tag = "span",
  once = true,
}: TextRevealBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once, margin: "-10% 0px -10% 0px" });

  return (
    <Tag
      ref={containerRef as any}
      className={`relative inline-block overflow-hidden align-top ${className}`}
    >
      {/* Underlying text content (revealed during animation) */}
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{
          duration: duration * 0.7,
          delay: delay + duration * 0.45,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        className={`inline-block font-sora ${textClassName}`}
      >
        {children}
      </motion.span>

      {/* Sweeping block wipe overlay inspired by @soralabs */}
      <motion.span
        initial={{ scaleX: 0, originX: 0 }}
        animate={
          isInView
            ? {
                scaleX: [0, 1, 1, 0],
                originX: [0, 0, 1, 1],
              }
            : { scaleX: 0, originX: 0 }
        }
        transition={{
          duration,
          delay,
          times: [0, 0.45, 0.55, 1],
          ease: [0.77, 0, 0.175, 1],
        }}
        style={{
          backgroundColor: blockColor,
        }}
        className="absolute inset-0 z-10 pointer-events-none block will-change-transform"
        aria-hidden="true"
      />
    </Tag>
  );
}
