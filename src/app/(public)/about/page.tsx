"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Award, Users, BookOpen, Heart, Target, Eye } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const milestones = [
  { year: "1980", title: "Founded",            desc: "ASPCS established with a vision to provide quality education" },
  { year: "1995", title: "Expanded",           desc: "Added secondary classes and science laboratories" },
  { year: "2005", title: "CBSE Affiliation",   desc: "Received CBSE affiliation, strengthening academic standards" },
  { year: "2015", title: "New Campus",         desc: "Moved to the modern 13,000 sq.mt. campus at Jaganpura" },
  { year: "2020", title: "Digital Learning",   desc: "Launched smart classrooms and digital learning platforms" },
  { year: "2024", title: "2000+ Students",     desc: "Crossed 2,000 enrolled students across all grades" },
];

const values = [
  { icon: BookOpen, title: "Academic Excellence",  desc: "Rigorous curriculum balanced with creative exploration and critical thinking.", color: "bg-brand-crimson/10 text-brand-crimson border-brand-crimson/20" },
  { icon: Heart,    title: "Holistic Development", desc: "Sports, arts, and cultural activities nurture the whole child beyond academics.", color: "bg-brand-gold/10 text-brand-gold border-brand-gold/20" },
  { icon: Users,    title: "Inclusive Community",  desc: "A safe, welcoming environment where every student feels valued and respected.", color: "bg-brand-maroon/10 text-brand-maroon-light border-brand-maroon/20" },
  { icon: Award,    title: "Character Building",   desc: "Instilling values of integrity, responsibility, and compassion in every student.", color: "bg-brand-crimson/10 text-brand-crimson border-brand-crimson/20" },
];

const faculty = [
  { name: "Mr. Om Prakash Singh", role: "Principal",          qual: "M.Sc., B.Ed.", dept: "Administration",  initials: "OP" },
  { name: "Mrs. Sunita Sharma",   role: "Vice Principal",     qual: "M.A., B.Ed.",  dept: "Administration",  initials: "SS" },
  { name: "Mr. Rajesh Kumar",     role: "Senior Teacher",     qual: "M.Sc., B.Ed.", dept: "Science",         initials: "RK" },
  { name: "Mrs. Priya Verma",     role: "HOD English",        qual: "M.A., B.Ed.",  dept: "English",         initials: "PV" },
  { name: "Mr. Amit Gupta",       role: "HOD Mathematics",    qual: "M.Sc., B.Ed.", dept: "Mathematics",     initials: "AG" },
  { name: "Mrs. Kavita Singh",    role: "HOD Social Science", qual: "M.A., B.Ed.",  dept: "Social Science",  initials: "KS" },
];

const infrastructure = [
  { label: "Campus Area",      value: "13,233 sq.mt.", icon: "🏫" },
  { label: "Classrooms",       value: "111 Rooms",     icon: "🏛️" },
  { label: "Laboratories",     value: "11 Labs",       icon: "🔬" },
  { label: "Boys Toilets",     value: "62 Units",      icon: "🚻" },
  { label: "Girls Toilets",    value: "44 Units",      icon: "🚺" },
  { label: "Internet",         value: "Yes (Wi-Fi)",   icon: "📶" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_20%,rgba(107,15,26,0.6),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_80%,rgba(74,10,18,0.4),transparent)]" />
        <div className="container-aspcs relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="section-eyebrow mb-5 inline-flex">About ASPCS</span>
            <h1 className="font-display text-display-lg font-bold text-white">
              A Legacy of Learning,{" "}
              <span className="text-gold-shimmer">A Future of Promise</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-slate">
              Since 1980, ASPCS has stood at the forefront of quality education in Patna —
              blending academic rigour with creative exploration to unlock every child&apos;s extraordinary potential.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/admissions" className="btn-primary">
                Apply Now <ArrowRight size={15} />
              </Link>
              <Link href="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────── */}
      <section className="border-y border-brand-gold/20 bg-brand-maroon-dark">
        <div className="container-aspcs">
          <div className="grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
            {[
              { value: "45+",   label: "Years of Excellence" },
              { value: "2,000+",label: "Students Enrolled" },
              { value: "91",    label: "Qualified Teachers" },
              { value: "98%",   label: "Board Pass Rate" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="py-8 text-center"
              >
                <p className="font-display text-3xl font-bold text-brand-gold">{stat.value}</p>
                <p className="mt-1 text-xs text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-aspcs">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-eyebrow mb-5 inline-flex">Our Story</span>
              <h2 className="mb-6 font-display text-display-sm font-bold text-[var(--text-primary)]">
                Four Decades of{" "}
                <span className="text-brand-crimson">Shaping Futures</span>
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  Founded in 1980 by visionary educators, Acharya Shri Sudarshan Patna Central School
                  began as a small institution with a grand mission — to provide every child in Patna
                  with world-class education rooted in values.
                </p>
                <p>
                  Over four decades, we have grown from a handful of classrooms to a sprawling
                  13,000 sq.mt. campus, earning CBSE affiliation and the trust of thousands of families.
                </p>
                <p>
                  Today, ASPCS stands as a beacon of academic excellence and holistic development,
                  having shaped the lives of more than 20,000 alumni who lead in every field imaginable.
                </p>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "CBSE Affiliated School",
                  "20,000+ Alumni Network",
                  "Award-winning faculty",
                  "State-of-the-art facilities",
                  "Strong sports programme",
                  "Active parent community",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 size={15} className="shrink-0 text-brand-crimson" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-maroon/10 shadow-glass-lg">
                <Image
                  src="/images/school-building.jpg"
                  alt="ASPCS School Campus"
                  fill
                  className="object-cover"
                />
              </div>
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 rounded-2xl border border-brand-gold/30 bg-white p-5 shadow-card"
              >
                <p className="font-display text-3xl font-bold text-brand-crimson">45+</p>
                <p className="text-xs text-brand-muted">Years of Excellence</p>
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -right-6 top-8 rounded-2xl border border-brand-gold/20 bg-white p-4 shadow-card"
              >
                <p className="text-2xl">🏆</p>
                <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">CBSE<br />Affiliated</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ──────────────────────────────────────── */}
      <section className="section-pad bg-brand-cream">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">Our Purpose</span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              Vision & <span className="text-brand-crimson">Mission</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: Eye, title: "Our Vision",
                color: "bg-brand-crimson text-white",
                content: "To be a premier educational institution that nurtures intellectually curious, morally grounded, and globally aware citizens who contribute meaningfully to society.",
              },
              {
                icon: Target, title: "Our Mission",
                color: "bg-brand-maroon text-white",
                content: "To provide holistic, inclusive, and excellence-driven education through innovative pedagogy, compassionate mentorship, and state-of-the-art facilities — empowering every student to discover and achieve their highest potential.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-8"
                >
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-4 font-display text-xl font-bold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="leading-relaxed text-[var(--text-secondary)]">{item.content}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">What We Stand For</span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              Our Core <span className="text-brand-crimson">Values</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-6 text-center"
                >
                  <div className={`mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${val.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-[var(--text-primary)]">{val.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <section className="section-pad bg-brand-cream">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">Our Journey</span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              Milestones Through <span className="text-brand-crimson">The Years</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-brand-crimson/20 lg:left-1/2" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex items-start gap-6 pl-12 lg:pl-0 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-brand-crimson bg-white lg:left-1/2 lg:-translate-x-1.5" />

                  {/* Card */}
                  <div className={`card w-full p-5 lg:w-5/12 ${i % 2 === 0 ? "lg:mr-auto" : "lg:ml-auto"}`}>
                    <span className="text-xs font-bold text-brand-crimson">{m.year}</span>
                    <h3 className="mt-1 font-display text-lg font-bold text-[var(--text-primary)]">{m.title}</h3>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Faculty ───────────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">
              <Users size={11} /> Our Team
            </span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              Meet Our <span className="text-brand-crimson">Leadership</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card p-6 flex items-center gap-4"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-crimson/10 font-display text-lg font-bold text-brand-crimson">
                  {f.initials}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{f.name}</p>
                  <p className="text-sm text-brand-crimson">{f.role}</p>
                  <p className="text-xs text-[var(--text-muted)]">{f.qual} · {f.dept}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Infrastructure ────────────────────────────────────────── */}
      <section className="section-pad bg-brand-cream">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">Campus</span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              World-Class <span className="text-brand-crimson">Infrastructure</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infrastructure.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card p-6 flex items-center gap-4"
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="font-display text-xl font-bold text-brand-crimson">{item.value}</p>
                  <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
