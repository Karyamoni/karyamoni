"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Chapter {
  id: string;
  index: string;
  label: string;
  slogan: string;
  body: string;
  bg: string;
  fg: string;
  accentColor: string;
  layout: "left" | "right" | "diagonal";
}

const chapters: Chapter[] = [
  {
    id: "problem",
    index: "01",
    label: "The Problem",
    slogan: "Returns are the hidden cost of fashion.",
    body: "Every wrong size costs merchants money, trust, and carbon. The loop is broken.",
    bg: "var(--color-ink)",
    fg: "var(--color-paper)",
    accentColor: "var(--color-signal)",
    layout: "left",
  },
  {
    id: "vision",
    index: "02",
    label: "The Vision",
    slogan: "One-click confidence for every shopper.",
    body: "Precision fit intelligence, embedded where decisions happen — the product page.",
    bg: "var(--color-paper)",
    fg: "var(--color-ink)",
    accentColor: "var(--color-cobalt)",
    layout: "right",
  },
  {
    id: "impact",
    index: "03",
    label: "The Impact",
    slogan: "Reducing waste, one byte at a time.",
    body: "Smarter data means fewer returns, fewer shipments, fewer regrets.",
    bg: "#c7ff47",
    fg: "var(--color-ink)",
    accentColor: "var(--color-ink)",
    layout: "diagonal",
  },
];

const wordVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.08,
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1] as number[],
    },
  }),
};

const bodyVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.55,
      duration: 0.9,
      ease: [0.25, 1, 0.5, 1] as number[],
    },
  },
};

const lineVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { delay: 0.15, duration: 1.3, ease: [0.16, 1, 0.3, 1] as number[] },
  },
};

function ChapterSlide({
  chapter,
  isActive,
}: {
  chapter: Chapter;
  isActive: boolean;
}) {
  const words = chapter.slogan.split(" ");
  const anim = isActive ? "visible" : "hidden";

  return (
    <div
      className="relative flex-shrink-0 w-screen h-screen overflow-hidden"
      style={{ background: chapter.bg, color: chapter.fg }}
    >
      {/* Top rail */}
      <div
        className="absolute top-0 left-0 right-0 flex items-end justify-between border-b pb-4 pt-6"
        style={{
          paddingLeft: "var(--grid-margin)",
          paddingRight: "var(--grid-margin)",
          borderColor: "currentColor",
        }}
      >
        <span className="k-label opacity-60" style={{ color: chapter.accentColor }}>
          {chapter.index} / {chapter.label}
        </span>
        <span className="k-label opacity-20">Karyamoni Philosophy</span>
      </div>

      {/* ── Chapter 1: THE PROBLEM ── Left-weighted composition */}
      {chapter.layout === "left" && (
        <>
          {/* Ghost symbol — top-right bleed */}
          <div
            className="absolute font-black leading-none select-none pointer-events-none"
            style={{ top: "6vh", right: "-3vw", fontSize: "clamp(10rem, 26vw, 36rem)", opacity: 0.04 }}
            aria-hidden
          >
            ∞
          </div>

          {/* Horizontal power line — mid-section */}
          <motion.div
            className="absolute left-0 right-0"
            style={{ top: "50%", height: 1, background: "currentColor", transformOrigin: "left" }}
            initial="hidden"
            animate={anim}
            variants={lineVariants}
          />

          {/* Monumental headline — bottom-left, bleeds right edge */}
          <div
            className="absolute bottom-[22vh]"
            style={{ left: "var(--grid-margin)", right: "28%", perspective: "1000px" }}
          >
            <h2
              className="font-black uppercase tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.6rem, 5.8vw, 7.5rem)", lineHeight: 0.84 }}
              aria-label={chapter.slogan}
            >
              {words.map((word, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    custom={i}
                    initial="hidden"
                    animate={anim}
                    variants={wordVariants}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>

          {/* Body copy — bottom-right quadrant, asymmetric offset */}
          <motion.div
            className="absolute"
            style={{ right: "var(--grid-margin)", bottom: "22vh", maxWidth: "28ch" }}
            initial="hidden"
            animate={anim}
            variants={bodyVariants}
          >
            <p className="font-bold leading-[1.55] opacity-55" style={{ fontSize: "1.1rem" }}>
              {chapter.body}
            </p>
          </motion.div>
        </>
      )}

      {/* ── Chapter 2: THE VISION ── Right-weighted composition */}
      {chapter.layout === "right" && (
        <>
          {/* Ghost K — top-left bleed */}
          <div
            className="absolute font-black leading-none select-none pointer-events-none"
            style={{ top: "4vh", left: "-4vw", fontSize: "clamp(12rem, 30vw, 42rem)", opacity: 0.04 }}
            aria-hidden
          >
            K
          </div>

          {/* Vertical power line at 1/3 column */}
          <motion.div
            className="absolute"
            style={{
              left: "33.333%",
              top: "14vh",
              bottom: "14vh",
              width: 1,
              background: "currentColor",
              opacity: 0.14,
              transformOrigin: "top",
            }}
            initial={{ scaleY: 0 }}
            animate={isActive ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ delay: 0.2, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Body copy — top-left quadrant */}
          <motion.div
            className="absolute"
            style={{ left: "var(--grid-margin)", top: "18vh", maxWidth: "24ch" }}
            initial="hidden"
            animate={anim}
            variants={bodyVariants}
          >
            <p className="font-bold leading-[1.55] opacity-55" style={{ fontSize: "1.1rem" }}>
              {chapter.body}
            </p>
          </motion.div>

          {/* Monumental headline — bottom-right, text-right */}
          <div
            className="absolute bottom-[20vh] text-right"
            style={{ right: "var(--grid-margin)", left: "22%", perspective: "1000px" }}
          >
            <h2
              className="font-black uppercase tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.8rem, 7vw, 9.5rem)", lineHeight: 0.82 }}
              aria-label={chapter.slogan}
            >
              {words.map((word, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    custom={i}
                    initial="hidden"
                    animate={anim}
                    variants={wordVariants}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>
        </>
      )}

      {/* ── Chapter 3: THE IMPACT ── Lime bg, bottom-anchored, extra tight */}
      {chapter.layout === "diagonal" && (
        <>
          {/* Ghost stat — top-left decorative */}
          <div
            className="absolute font-black leading-none select-none pointer-events-none"
            style={{ top: "6vh", left: "var(--grid-margin)", fontSize: "clamp(8rem, 22vw, 32rem)", opacity: 0.07 }}
            aria-hidden
          >
            ∞
          </div>

          {/* Body copy — top-right */}
          <motion.div
            className="absolute"
            style={{ right: "var(--grid-margin)", top: "16vh", maxWidth: "26ch" }}
            initial="hidden"
            animate={anim}
            variants={bodyVariants}
          >
            <p className="font-bold leading-[1.55] opacity-65" style={{ fontSize: "1.1rem" }}>
              {chapter.body}
            </p>
          </motion.div>

          {/* Monumental headline — bottom-anchored, viewport-filling */}
          <div
            className="absolute bottom-[22vh]"
            style={{ left: "var(--grid-margin)", right: 0, perspective: "1000px" }}
          >
            <h2
              className="font-black uppercase tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.6rem, 5.8vw, 7.5rem)", lineHeight: 0.82 }}
              aria-label={chapter.slogan}
            >
              {words.map((word, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    custom={i}
                    initial="hidden"
                    animate={anim}
                    variants={wordVariants}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>

          {/* CTA link — bottom-right */}
          <motion.div
            className="absolute"
            style={{ bottom: "7vh", right: "var(--grid-margin)" }}
            initial={{ opacity: 0, x: 24 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ delay: 0.9, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#" className="k-label flex items-center gap-3 border-b border-current pb-1">
              See impact data <span aria-hidden>→</span>
            </a>
          </motion.div>
        </>
      )}
    </div>
  );
}

function MobileChapter({ chapter }: { chapter: Chapter }) {
  const words = chapter.slogan.split(" ");

  return (
    <div
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{
        background: chapter.bg,
        color: chapter.fg,
        paddingLeft: "var(--grid-margin)",
        paddingRight: "var(--grid-margin)",
        paddingBottom: "4rem",
      }}
    >
      {/* Label rail */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-between border-b pb-4 pt-5"
        style={{
          paddingLeft: "var(--grid-margin)",
          paddingRight: "var(--grid-margin)",
          borderColor: "currentColor",
          opacity: 0.25,
        }}
      >
        <span className="k-label" style={{ color: chapter.accentColor, opacity: 1 }}>
          {chapter.index} / {chapter.label}
        </span>
      </div>

      {/* Ghost index — 2/3 offset bleed (Six Rules) */}
      <div
        className="absolute font-black leading-none select-none pointer-events-none"
        style={{
          bottom: "-2vh",
          right: "-3vw",
          fontSize: "clamp(7rem, 32vw, 14rem)",
          opacity: 0.06,
        }}
        aria-hidden
      >
        {chapter.index}
      </div>

      {/* Headline — word-by-word via whileInView */}
      <h2
        className="font-black uppercase tracking-[-0.03em] mb-6"
        style={{ fontSize: "clamp(3rem, 12vw, 6rem)", lineHeight: 0.85 }}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.15em]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.07, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h2>

      {/* Body */}
      <motion.p
        className="font-bold leading-[1.55] max-w-[34ch]"
        style={{ fontSize: "1rem", opacity: 0.6 }}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 0.6, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.5, duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
      >
        {chapter.body}
      </motion.p>
    </div>
  );
}

export function PhilosophyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Translate horizontal track as scroll progresses
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-200vw"]);

  // Progress dot opacities
  const dot1 = useTransform(scrollYProgress, [0, 0.25], [1, 0.28]);
  const dot2 = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0.28, 1, 0.28]);
  const dot3 = useTransform(scrollYProgress, [0.75, 1], [0.28, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.13], [0.5, 0]);

  // Advance active chapter — never go backwards so reveals stay visible
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.02) {
        const next = Math.min(2, Math.floor(v * 3));
        setActiveChapter((prev) => Math.max(prev, next));
      }
    });
    return unsub;
  }, [scrollYProgress]);

  // Trigger chapter 1 when section enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveChapter((prev) => Math.max(prev, 0));
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dotOpacities = [dot1, dot2, dot3];
  const displayChapter = Math.max(0, activeChapter);

  return (
    <>
      {/* Mobile: stacked chapters */}
      <div className="lg:hidden">
        {chapters.map((chapter) => (
          <MobileChapter key={chapter.id} chapter={chapter} />
        ))}
      </div>

      {/* Desktop: pinned horizontal scroll */}
      <div ref={containerRef} className="hidden lg:block" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Horizontal track */}
          <motion.div
            className="flex h-full"
            style={{ x, width: "300vw", willChange: "transform" }}
          >
            {chapters.map((chapter, i) => (
              <ChapterSlide
                key={chapter.id}
                chapter={chapter}
                isActive={activeChapter >= i}
              />
            ))}
          </motion.div>

          {/* Progress indicator — centered bottom */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none"
            style={{ color: chapters[displayChapter].fg }}
          >
            {dotOpacities.map((opacity, i) => (
              <motion.div
                key={i}
                className="rounded-full bg-current transition-all duration-300"
                style={{
                  width: activeChapter === i ? 20 : 6,
                  height: 6,
                  opacity,
                }}
              />
            ))}
            <motion.span className="k-label ml-3 opacity-45">
              {String(Math.max(1, activeChapter + 1)).padStart(2, "0")} / 03
            </motion.span>
          </div>

          {/* Scroll hint — fades after first chapter */}
          <motion.div
            className="absolute bottom-8 k-label flex items-center gap-2 pointer-events-none"
            style={{
              right: "var(--grid-margin)",
              color: chapters[0].fg,
              opacity: hintOpacity,
            }}
          >
            Scroll <span aria-hidden>→</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
