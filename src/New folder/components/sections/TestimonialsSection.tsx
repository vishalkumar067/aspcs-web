"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Parent of Class VIII Student",
    initials: "PS",
    rating: 5,
    content:
      "ASPCS has completely transformed my daughter's outlook on learning. The teachers here genuinely care about each child's growth — academically and personally. The communication with parents is excellent.",
    color: "from-amber-500 to-amber-600",
  },
  {
    id: 2,
    name: "Rakesh Mehta",
    role: "Parent of Class X Student",
    initials: "RM",
    rating: 5,
    content:
      "My son struggled in his previous school, but ASPCS identified his strengths and built his confidence. He scored 94% in board exams this year. The faculty mentorship programme made all the difference.",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 3,
    name: "Anjali Verma",
    role: "ASPCS Alumna, 2022 Batch",
    initials: "AV",
    rating: 5,
    content:
      "Looking back, the years I spent at ASPCS were the most formative of my life. The school didn't just prepare me for competitive exams — it prepared me for life. I'm now studying engineering at a top institute.",
    color: "from-violet-500 to-violet-600",
  },
  {
    id: 4,
    name: "Dr. Sunil Kapoor",
    role: "Parent of Class V Student",
    initials: "SK",
    rating: 5,
    content:
      "The infrastructure is world-class, but what truly sets ASPCS apart is the culture of curiosity they cultivate. My child comes home excited to share what she learned every single day.",
    color: "from-emerald-500 to-emerald-600",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="section-pad bg-brand-cream dark:bg-brand-black">
      <div className="container-aspcs">

        {/* Heading */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-5 inline-flex"
          >
            <Quote size={11} />
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-display-xs font-bold text-brand-navy dark:text-white"
          >
            Voices of Our{" "}
            <span className="text-brand-gold">Community</span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((t, i) => (
              <motion.div
                key={`${t.id}-${current}`}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="card p-7"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={13} className="fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                {/* Quote */}
                <Quote size={24} className="mb-3 text-brand-gold/20" />
                <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t.content}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-secondary)] transition-all hover:border-brand-gold/40 hover:text-brand-gold"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-brand-gold"
                    : "w-2 bg-brand-slate/30 hover:bg-brand-slate/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-secondary)] transition-all hover:border-brand-gold/40 hover:text-brand-gold"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
