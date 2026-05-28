"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } };

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-black">

  {/* Background Drone Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src="/videos/campus-drone.mp4" type="video/mp4" />
  </video>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60 z-[1]" />

  {/* Existing Gradient overlays */}
  <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(107,15,26,0.8),transparent)]" />

  <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,rgba(74,10,18,0.5),transparent)]" />
      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(107,15,26,0.8),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,rgba(74,10,18,0.5),transparent)]" />

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(196,30,58,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-brand-maroon/30 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute -right-40 bottom-20 h-[600px] w-[600px] rounded-full bg-brand-crimson/15 blur-[120px]"
      />

      {/* Floating dots */}
      {[
        { top: "15%", left: "8%",  size: 3, delay: 0 },
        { top: "35%", left: "92%", size: 2, delay: 1.5 },
        { top: "70%", left: "5%",  size: 4, delay: 0.8 },
        { top: "80%", left: "85%", size: 2, delay: 2.5 },
        { top: "50%", left: "50%", size: 2, delay: 1 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
          className="pointer-events-none absolute rounded-full bg-brand-gold"
          style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
        />
      ))}

      {/* Content */}
      <div className="container-aspcs relative z-10 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <motion.div variants={stagger} initial="hidden" animate="show" className="mx-auto max-w-4xl text-center">

          <motion.div variants={fadeUp} className="mb-8 flex justify-center">
            <span className="section-eyebrow">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold" />
              Admissions Open — Session 2026–27
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="mb-6 font-display text-display-md font-bold leading-[1.1] text-white lg:text-display-xl">
            Where{" "}
            <span className="relative inline-block">
              <span className="text-gold-shimmer">Excellence</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light"
              />
            </span>{" "}
            Meets{" "}
            <span className="text-brand-crimson">Creativity</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-brand-slate lg:text-xl">
            ASPCS nurtures young minds with world-class education, innovative
            pedagogy, and a holistic environment — shaping confident leaders for tomorrow's world.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/admissions" className="btn-primary px-8 py-4 text-base shadow-glow-crimson">
              Begin Your Journey <ArrowRight size={16} />
            </Link>
            <button className="btn-outline-gold px-8 py-4 text-base">
              <Play size={15} className="fill-current" /> Watch Our Story
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-14 flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { value: "2,000+", label: "Students" },
              { value: "150+",   label: "Faculty Members" },
              { value: "45 yrs", label: "of Excellence" },
              { value: "98%",    label: "Pass Rate" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-2xl font-bold text-brand-gold lg:text-3xl">{stat.value}</span>
                <span className="mt-0.5 text-xs tracking-wider text-brand-slate">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5 text-brand-slate"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
