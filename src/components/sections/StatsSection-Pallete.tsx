"use client";

import { motion } from "framer-motion";
import { Users, Award, BookOpen, Trophy, Star, Globe } from "lucide-react";

const stats = [
  { icon: Users,    value: "2,000+",  label: "Students Enrolled",     color: "text-brand-gold" },
  { icon: Award,    value: "150+",    label: "Qualified Faculty",      color: "text-brand-gold-light" },
  { icon: BookOpen, value: "30+",     label: "Academic Programs",      color: "text-brand-gold" },
  { icon: Trophy,   value: "98%",     label: "Board Pass Rate",        color: "text-brand-gold-light" },
  { icon: Star,     value: "500+",    label: "Award Winners",          color: "text-brand-gold" },
  { icon: Globe,    value: "20 Yrs",  label: "Legacy of Excellence",   color: "text-brand-gold-light" },
];

// Doubled for seamless marquee
const marqueeItems = [...stats, ...stats];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-brand-black py-16">
      {/* Gold line top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-crimson/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-crimson/30 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(201,168,76,0.04),transparent)]" />

      {/* Marquee track */}
      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex shrink-0 gap-0"
        >
          {marqueeItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex w-56 shrink-0 flex-col items-center justify-center gap-3 px-6 py-4"
              >
                {/* Icon ring */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-gold/20 bg-brand-crimson/10">
                  <Icon size={20} className={item.color} strokeWidth={1.8} />
                </div>
                <div className="text-center">
                  <div className={`font-display text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="mt-0.5 text-xs text-brand-slate">{item.label}</div>
                </div>

                {/* Separator dot */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="h-1 w-1 rounded-full bg-brand-gold/25" />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
