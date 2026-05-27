"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function AdmissionsHero() {
  return (
    <section className="relative overflow-hidden bg-brand-black pt-36 pb-24">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(201,168,76,0.12),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-brand-gold/15 blur-[120px]"
      />

      <div className="container-aspcs relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="section-eyebrow mb-6 inline-flex">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold" />
            Admissions Open — Session 2026–27
          </span>

          <h1 className="mb-6 font-display text-display-md font-bold text-white lg:text-display-lg">
            Begin Your Child's{" "}
            <span className="text-gold-shimmer">Journey</span>{" "}
            With Us
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-brand-slate">
            Join a community of curious minds and dedicated educators. Applications
            for session 2026-27 are now open across all grades — Nursery to Class IX and XI.
          </p>

          {/* Quick contact */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+91XXXXXXXXXX" className="btn-primary">
              <Phone size={15} /> Call Admissions Office
            </a>
            <a href="mailto:admissions@aspcs.edu.in" className="btn-outline">
              <Mail size={15} /> Email Us
            </a>
          </div>

          {/* Info pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              "Free school tour",
              "Online application",
              "Quick response within 30 minutes",
              "Transparent process",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-brand-slate"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
