"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-brand-black py-24">
      {/* Layered background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(196,30,58,0.08),transparent)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(196,30,58,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-brand-gold blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 9, repeat: Infinity, delay: 3 }}
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-gold blur-3xl"
      />

      <div className="container-aspcs relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow mb-6 inline-flex">
            <span className="animate-pulse inline-block h-1.5 w-1.5 rounded-full bg-brand-gold" />
            Admissions Open — 2025–26
          </span>

          <h2 className="mx-auto mb-6 max-w-3xl font-display text-display-md font-bold text-white lg:text-display-lg">
            Give Your Child the Education{" "}
            <span className="text-gold-shimmer">They Deserve</span>
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-brand-slate">
            Seats are limited. Take the first step toward an extraordinary
            educational journey at ASPCS — where every child thrives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/admissions" className="btn-primary px-10 py-4 text-base shadow-glow-crimson">
              Apply Online Now
              <ArrowRight size={17} />
            </Link>
            <a href="tel:+91XXXXXXXXXX" className="btn-outline px-10 py-4 text-base">
              <Phone size={16} />
              Call Admissions
            </a>
          </div>

          {/* Trust note */}
          <p className="mt-8 text-sm text-brand-slate/60">
            Free school tour available · No hidden charges · Transparent process
          </p>
        </motion.div>
      </div>
    </section>
  );
}
