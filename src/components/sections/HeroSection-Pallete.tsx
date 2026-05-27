"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } } };

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-brand-mint via-brand-mint-light to-brand-cream">
      {/* Soft background orbs */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(13,148,136,0.08),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_70%,rgba(110,231,183,0.12),transparent)]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "linear-gradient(rgba(13,148,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-brand-sage/15 blur-3xl"
      />

      {/* Floating dots */}
      {[
        { top: "15%", left: "8%",  size: 6, delay: 0 },
        { top: "35%", left: "92%", size: 4, delay: 1.5 },
        { top: "70%", left: "5%",  size: 8, delay: 0.8 },
        { top: "80%", left: "85%", size: 4, delay: 2.5 },
        { top: "25%", left: "75%", size: 5, delay: 1 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          animate={{ y: [-6, 6, -6], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: dot.delay }}
          className="pointer-events-none absolute rounded-full bg-brand-teal/40"
          style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
        />
      ))}

      {/* Content */}
      <div className="container-aspcs relative z-10 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <motion.div variants={stagger} initial="hidden" animate="show" className="mx-auto max-w-4xl text-center">

          <motion.div variants={fadeUp} className="mb-8 flex justify-center">
            <span className="section-eyebrow">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-teal" />
              Admissions Open — Session 2025–26
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="mb-6 font-display text-display-md font-bold leading-[1.1] text-brand-dark lg:text-display-xl">
            Where{" "}
            <span className="relative inline-block">
              <span className="text-teal-shimmer">Excellence</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-brand-teal to-brand-sage"
              />
            </span>{" "}
            Meets{" "}
            <span className="text-brand-teal-light">Creativity</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-brand-slate lg:text-xl">
            ASPCS nurtures young minds with world-class education, innovative
            pedagogy, and a holistic environment — shaping confident leaders for tomorrow&apos;s world.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/admissions" className="btn-primary px-8 py-4 text-base shadow-glow-teal">
              Begin Your Journey <ArrowRight size={16} />
            </Link>
            <button className="btn-outline px-8 py-4 text-base">
              <Play size={15} className="fill-current" /> Watch Our Story
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-14 flex flex-wrap items-center justify-center gap-8">
            {[
              { value: "2,000+", label: "Students" },
              { value: "150+",   label: "Faculty Members" },
              { value: "45 yrs", label: "of Excellence" },
              { value: "98%",    label: "Pass Rate" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-display text-2xl font-bold text-brand-teal lg:text-3xl">{stat.value}</span>
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
            transition={{ duration: 1.8, repeat: Infinity }}
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
