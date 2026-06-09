"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, FlaskConical, Music, Monitor, Dumbbell, Palette, CheckCircle2, ArrowRight, Calendar, FileText } from "lucide-react";

const programs = [
  {
    icon: Palette, title: "Early Years", grades: "Nursery – KG II", age: "3–6 years",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    subjects: ["Language & Literacy", "Numeracy", "Art & Craft", "Music & Movement", "Environmental Awareness"],
    desc: "Play-based learning that builds language, motor skills, and curiosity in a warm, nurturing environment.",
  },
  {
    icon: BookOpen, title: "Primary School", grades: "Grade I – V", age: "6–11 years",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    subjects: ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Arts", "Physical Education"],
    desc: "Core subjects enriched with arts, music and physical education — developing well-rounded young learners.",
  },
  {
    icon: FlaskConical, title: "Middle School", grades: "Grade VI – VIII", age: "11–14 years",
    color: "bg-brand-crimson/10 text-brand-crimson border-brand-crimson/20",
    subjects: ["English", "Hindi", "Sanskrit", "Mathematics", "Science", "Social Science", "Computer Science"],
    desc: "Project-based science, mathematics and humanities programmes cultivating analytical and critical thinking.",
  },
  {
    icon: Monitor, title: "Secondary", grades: "Grade IX – X", age: "14–16 years",
    color: "bg-violet-50 text-violet-600 border-violet-200",
    subjects: ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Applications"],
    desc: "CBSE board-aligned curriculum with mentored study groups, career counselling and strong board exam prep.",
  },
  {
    icon: Music, title: "Arts & Culture", grades: "All Grades", age: "All Ages",
    color: "bg-rose-50 text-rose-600 border-rose-200",
    subjects: ["Visual Arts", "Performing Arts", "Dance", "Drama", "Music", "Cultural Studies"],
    desc: "Performing arts, visual arts and cultural exchange activities that awaken creativity and self-expression.",
  },
  {
    icon: Dumbbell, title: "Sports & Fitness", grades: "All Grades", age: "All Ages",
    color: "bg-green-50 text-green-600 border-green-200",
    subjects: ["Cricket", "Football", "Basketball", "Athletics", "Yoga", "Swimming", "Table Tennis"],
    desc: "Multi-sport facilities, professional coaching and inter-school competitions building teamwork and resilience.",
  },
];

const calendarEvents = [
  { month: "April",     events: ["New Academic Session Begins", "Orientation for New Students", "House Selection"] },
  { month: "May",       events: ["Unit Test 1", "Annual Sports Day", "Science Exhibition"] },
  { month: "June",      events: ["Summer Vacation", "Cultural Fest — Tarang"] },
  { month: "July",      events: ["School Reopens", "Half Yearly Exam Preparation Begins"] },
  { month: "August",    events: ["Independence Day Celebration", "Half Yearly Examinations"] },
  { month: "September", events: ["Result Declaration", "Parent Teacher Meeting", "Inter-House Competitions"] },
  { month: "October",   events: ["Dussehra Holidays", "Unit Test 2", "Science Day"] },
  { month: "November",  events: ["Children's Day Celebration", "Annual Function Preparation"] },
  { month: "December",  events: ["Annual Prize Distribution", "Winter Break", "Christmas Celebration"] },
  { month: "January",   events: ["School Reopens", "Pre-Board Exams Begin", "Republic Day"] },
  { month: "February",  events: ["Board Practical Exams", "Pre-Board Result", "Farewell for Class X"] },
  { month: "March",     events: ["CBSE Board Examinations", "Session Ends", "Summer Vacation Begins"] },
];

const highlights = [
  "CBSE affiliated curriculum",
  "Smart classrooms in all sections",
  "Dedicated science & computer labs",
  "Weekly PTM for struggling students",
  "Remedial classes available",
  "Career counselling from Grade VIII",
  "100% board exam preparation support",
  "Co-curricular activities every week",
];

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-black pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_20%,rgba(107,15,26,0.6),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_80%,rgba(74,10,18,0.4),transparent)]" />
        <div className="container-aspcs relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="section-eyebrow mb-5 inline-flex">
              <BookOpen size={11} /> Academics
            </span>
            <h1 className="font-display text-display-lg font-bold text-white">
              A Programme for Every{" "}
              <span className="text-gold-shimmer">Stage of Growth</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-slate">
              From nursery to secondary, every programme at ASPCS is crafted to
              inspire curiosity, build character, and develop the whole child.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-brand-maroon-dark py-10 border-y border-brand-gold/20">
        <div className="container-aspcs">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highlights.slice(0, 4).map((h, i) => (
              <motion.div
                key={h}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={15} className="shrink-0 text-brand-gold" />
                <span className="text-sm text-white/90">{h}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-pad" id="programs">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">Our Programmes</span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              Academic <span className="text-brand-crimson">Programmes</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
              Structured learning pathways from early childhood to secondary education,
              designed around CBSE guidelines and holistic development.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((prog, i) => {
              const Icon = prog.icon;
              return (
                <motion.div
                  key={prog.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="card p-6 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${prog.color}`}>
                    <Icon size={22} />
                  </div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    {prog.grades} · Ages {prog.age}
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-[var(--text-primary)]">{prog.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{prog.desc}</p>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-brand-crimson uppercase tracking-wider">Subjects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prog.subjects.map((s) => (
                        <span key={s} className="rounded-full border border-brand-crimson/15 bg-brand-crimson/5 px-2.5 py-0.5 text-[10px] font-medium text-brand-crimson">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section-pad bg-brand-cream" id="curriculum">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">
              <FileText size={11} /> Curriculum
            </span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              Our <span className="text-brand-crimson">Curriculum</span> Approach
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                title: "CBSE Aligned",
                desc: "Our curriculum strictly follows the Central Board of Secondary Education (CBSE) framework, ensuring students are fully prepared for national board examinations and competitive entrance tests.",
                points: ["NCERT textbooks", "Board exam pattern", "Continuous evaluation", "Periodic assessments"],
              },
              {
                title: "Beyond Textbooks",
                desc: "We go beyond rote learning through project-based assignments, science fairs, debates, and real-world problem-solving activities that develop critical thinking and creativity.",
                points: ["Project-based learning", "Field trips", "Guest lectures", "Science exhibitions"],
              },
              {
                title: "Digital Learning",
                desc: "Smart classrooms equipped with interactive boards, educational apps, and internet access make learning engaging and prepare students for a technology-driven future.",
                points: ["Smart classrooms", "E-learning resources", "Computer lab sessions", "Coding fundamentals"],
              },
              {
                title: "Assessment System",
                desc: "A balanced assessment approach combining continuous internal evaluation, unit tests, half-yearly and annual examinations with detailed feedback and parent communication.",
                points: ["Unit tests", "Half-yearly exams", "Annual examinations", "Report cards"],
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="mb-3 font-display text-xl font-bold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
                <ul className="space-y-2">
                  {item.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 size={14} className="shrink-0 text-brand-crimson" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="section-pad" id="calendar">
        <div className="container-aspcs">
          <div className="mb-14 text-center">
            <span className="section-eyebrow mb-5 inline-flex">
              <Calendar size={11} /> Academic Calendar
            </span>
            <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
              Academic <span className="text-brand-crimson">Calendar 2025–26</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--text-muted)]">
              Key dates, events, and examinations for the academic session 2025–26.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calendarEvents.map((month, i) => (
              <motion.div
                key={month.month}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/10">
                    <Calendar size={16} className="text-brand-crimson" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{month.month}</h3>
                </div>
                <ul className="space-y-2">
                  {month.events.map((ev) => (
                    <li key={ev} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-crimson" />
                      {ev}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link href="/admissions" className="btn-primary">
              Apply for Admissions <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
