"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Palette, FlaskConical, Music, Monitor, Dumbbell, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: BookOpen,
    title: "Early Years",
    grades: "Nursery – KG II",
    color: "from-amber-400/20 to-amber-600/10",
    border: "border-amber-400/25",
    iconColor: "text-amber-400",
    description:
      "Play-based learning that builds language, motor skills, and curiosity in a warm, nurturing environment.",
  },
  {
    icon: Palette,
    title: "Primary School",
    grades: "Grade I – V",
    color: "from-rose-400/20 to-rose-600/10",
    border: "border-rose-400/25",
    iconColor: "text-rose-400",
    description:
      "Core subjects enriched with arts, music and physical education — developing well-rounded young learners.",
  },
  {
    icon: FlaskConical,
    title: "Middle School",
    grades: "Grade VI – VIII",
    color: "from-cyan-400/20 to-cyan-600/10",
    border: "border-cyan-400/25",
    iconColor: "text-cyan-400",
    description:
      "Project-based science, mathematics and humanities programmes cultivating analytical and critical thinking.",
  },
{
  icon: Monitor,
  title: "Secondary",
  grades: "Grade IX – X",
  color: "from-violet-400/20 to-violet-600/10",
  border: "border-violet-400/25",
  iconColor: "text-violet-400",
  description:
    "Board-aligned curriculum with mentored study groups, career counselling and strong board exam preparation.",
},

{
  icon: Monitor,
  title: "Senior Secondary",
  grades: "Grade XI – XII",
  color: "from-indigo-400/20 to-indigo-600/10",
  border: "border-indigo-400/25",
  iconColor: "text-indigo-400",
  description:
    "Advanced streams in science, commerce and humanities with career-focused mentorship and university preparation.",
},

  {
    icon: Music,
    title: "Arts & Culture",
    grades: "All Grades",
    color: "from-pink-400/20 to-pink-600/10",
    border: "border-pink-400/25",
    iconColor: "text-pink-400",
    description:
      "Performing arts, visual arts and cultural exchange activities that awaken creativity and self-expression.",
  },
  {
    icon: Dumbbell,
    title: "Sports & Fitness",
    grades: "All Grades",
    color: "from-green-400/20 to-green-600/10",
    border: "border-green-400/25",
    iconColor: "text-green-400",
    description:
      "Multi-sport facilities, professional coaching and inter-school competitions building teamwork and resilience.",
  },
];

export default function ProgramsSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-brand-black">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(201,168,76,0.06),transparent)]" />

      <div className="container-aspcs relative z-10">

        {/* Heading */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-6 inline-flex"
          >
            Academic Programmes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl font-display text-display-sm font-bold text-white"
          >
            A Programme for Every{" "}
            <span className="text-brand-gold">Stage of Growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-brand-slate"
          >
            From nursery to secondary, every programme is crafted to inspire,
            challenge and develop the whole child.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((prog, i) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl border ${prog.border} bg-gradient-to-br ${prog.color} p-7 backdrop-blur-sm transition-all duration-300 hover:shadow-glass-lg cursor-pointer`}
              >
                {/* Icon */}
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${prog.iconColor}`}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/40">
                  {prog.grades}
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-white">
                  {prog.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {prog.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-white/0 transition-all duration-300 group-hover:text-white/70">
                  Learn more <ArrowRight size={12} />
                </div>

                {/* Decorative corner ring */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/5" />
                <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full border border-white/5" />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/academics" className="btn-outline">
            View Full Curriculum <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
