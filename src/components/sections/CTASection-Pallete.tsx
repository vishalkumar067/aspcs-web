"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-brand-teal py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(110,231,183,0.15),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, delay: 3 }}
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-sage/20 blur-3xl"
      />

      <div className="container-aspcs relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            <span className="animate-pulse inline-block h-1.5 w-1.5 rounded-full bg-brand-sage" />
            Admissions Open — 2025–26
          </span>

          <h2 className="mx-auto mb-6 max-w-3xl font-display text-display-md font-bold text-white lg:text-display-lg">
            Give Your Child the Education{" "}
            <span className="text-brand-sage">They Deserve</span>
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-white/80">
            Seats are limited. Take the first step toward an extraordinary
            educational journey at ASPCS — where every child thrives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/admissions" className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-semibold text-brand-teal shadow-glass transition-all hover:-translate-y-0.5 hover:shadow-lg">
              Apply Online Now <ArrowRight size={17} />
            </Link>
            <a href="tel:+919102997549" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5">
              <Phone size={16} /> Call Admissions
            </a>
          </div>

          <p className="mt-8 text-sm text-white/50">
            Free school tour available · No hidden charges · Transparent process
          </p>
        </motion.div>
      </div>
    </section>
  );
}
