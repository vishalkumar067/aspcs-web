"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

const pillars = [
  "Academic rigour with creative freedom",
  "Holistic personality development",
  "State-of-the-art infrastructure",
  "Experienced & dedicated faculty",
  "Inclusive, safe learning environment",
  "Strong alumni community & network",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutSection() {
  return (
    <section className="section-pad bg-brand-cream dark:bg-brand-black">
      <div className="container-aspcs">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* ── Left: Visual ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {/* Main image placeholder */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-maroon-dark to-brand-maroon shadow-maroon">
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(201,168,76,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.15) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Replace with <Image> when actual photo is available */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="mb-4 font-display text-6xl font-bold text-brand-gold/15">ASPCS</div>
               <Image
                               src="/images/gallery/image_19.jpg"
                               alt="ASPCS School"
                               fill
                               priority
                               className="object-cover"
                             />
            </div>
             </div>

            {/* Floating badge — Years */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 rounded-2xl border border-brand-gold/30 bg-brand-maroon-dark p-5 shadow-glass"
            >
              <div className="font-display text-4xl font-bold text-brand-gold">45+</div>
              <div className="text-xs font-medium text-brand-slate">Years of<br />Excellence</div>
            </motion.div>

            {/* Floating badge — Accredited */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-6 top-8 rounded-2xl border border-brand-gold/20 bg-brand-maroon-dark p-4 shadow-glass"
            >
              <div className="text-2xl">🏆</div>
              <div className="mt-1 text-xs font-semibold text-white">Nationally<br />Accredited</div>
            </motion.div>
          </motion.div>

          {/* ── Right: Content ─────────────────────────────────────── */}
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <span className="section-eyebrow mb-6 inline-flex">About ASPCS</span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mb-6 font-display text-display-sm font-bold text-[var(--text-primary)]"
            >
              A Legacy of Learning,{" "}
              <span className="text-brand-gold">A Future of Promise</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mb-4 text-[var(--text-secondary)] leading-relaxed">
              Founded in 1980, ASPCS has stood at the forefront of quality education — blending
              academic rigour with creative exploration. We believe every child carries
              extraordinary potential, and it is our mission to unlock it.
            </motion.p>

            <motion.p variants={fadeUp} className="mb-8 text-[var(--text-secondary)] leading-relaxed">
              From our foundational early-childhood programmes to our advanced secondary
              curriculum, every stage is designed to inspire curiosity, build character,
              and prepare students to lead with confidence.
            </motion.p>

            {/* Pillars checklist */}
            <motion.ul variants={fadeUp} className="mb-10 grid gap-3 sm:grid-cols-2">
              {pillars.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-gold" />
                  {p}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp}>
              <Link href="/about" className="btn-primary">
                Discover Our Story <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
