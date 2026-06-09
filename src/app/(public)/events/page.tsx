"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Tag, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type EventCategory = "ALL" | "ACADEMIC" | "CULTURAL" | "SPORTS" | "HOLIDAY" | "EXAM";

const categories: EventCategory[] = ["ALL", "ACADEMIC", "CULTURAL", "SPORTS", "HOLIDAY", "EXAM"];

const categoryColors: Record<string, string> = {
  ACADEMIC: "bg-blue-50 text-blue-700 border-blue-200",
  CULTURAL: "bg-rose-50 text-rose-700 border-rose-200",
  SPORTS:   "bg-green-50 text-green-700 border-green-200",
  HOLIDAY:  "bg-amber-50 text-amber-700 border-amber-200",
  EXAM:     "bg-violet-50 text-violet-700 border-violet-200",
};

const events = [
  {
    id: "1", title: "Annual Sports Day 2025",
    date: "2025-05-15", endDate: "2025-05-16",
    venue: "School Ground", category: "SPORTS",
    isHighlight: true, isUpcoming: true,
    description: "Two days of exciting sporting events including athletics, team sports, and field events. All students from Grades I to X participate. Parents are cordially invited.",
  },
  {
    id: "2", title: "Science & Technology Exhibition",
    date: "2025-05-22", endDate: "",
    venue: "School Hall", category: "ACADEMIC",
    isHighlight: true, isUpcoming: true,
    description: "Students showcase their science projects and innovations. Open to parents and the public. Best projects receive certificates and trophies.",
  },
  {
    id: "3", title: "Cultural Fest 2025 — Tarang",
    date: "2025-06-05", endDate: "2025-06-06",
    venue: "Main Auditorium", category: "CULTURAL",
    isHighlight: true, isUpcoming: true,
    description: "Annual cultural extravaganza featuring dance, drama, music, and art. A celebration of student talent and creativity across all grades.",
  },
  {
    id: "4", title: "Summer Vacation Begins",
    date: "2025-05-31", endDate: "",
    venue: "", category: "HOLIDAY",
    isHighlight: false, isUpcoming: true,
    description: "School will remain closed for summer vacation. Classes resume on 1st July 2025.",
  },
  {
    id: "5", title: "Pre-Board Examinations",
    date: "2025-06-10", endDate: "2025-06-20",
    venue: "Classrooms", category: "EXAM",
    isHighlight: false, isUpcoming: true,
    description: "Pre-board examinations for Classes IX and X. Timetable will be shared separately.",
  },
  {
    id: "6", title: "Annual Prize Distribution 2024",
    date: "2024-12-15", endDate: "",
    venue: "School Auditorium", category: "ACADEMIC",
    isHighlight: true, isUpcoming: false,
    description: "Celebrated the achievements of outstanding students across academics, sports, and co-curricular activities.",
  },
  {
    id: "7", title: "Independence Day Celebration",
    date: "2024-08-15", endDate: "",
    venue: "School Ground", category: "CULTURAL",
    isHighlight: false, isUpcoming: false,
    description: "Flag hoisting ceremony followed by cultural performances and patriotic songs by students.",
  },
  {
    id: "8", title: "Sports Meet 2024",
    date: "2024-03-10", endDate: "2024-03-11",
    venue: "School Ground", category: "SPORTS",
    isHighlight: true, isUpcoming: false,
    description: "Annual sports meet with participation from all grades. Multiple gold medals won by ASPCS students.",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function EventCard({ event, i }: { event: typeof events[0]; i: number }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(event.date);
  const day  = date.getDate().toString().padStart(2, "0");
  const mon  = date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      className={cn(
        "card overflow-hidden transition-all duration-300",
        event.isHighlight && "border-brand-crimson/30 ring-1 ring-brand-crimson/10"
      )}
    >
      <div className="flex items-start gap-4 p-5">
        {/* Date block */}
        <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-crimson/8 border border-brand-crimson/15 px-4 py-3 text-center min-w-[64px]">
          <span className="font-display text-2xl font-bold text-brand-crimson leading-none">{day}</span>
          <span className="text-[10px] font-semibold text-brand-muted mt-0.5">{mon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", categoryColors[event.category])}>
              {event.category}
            </span>
            {event.isHighlight && (
              <span className="rounded-full border border-brand-gold/30 bg-brand-gold/8 px-2.5 py-0.5 text-[10px] font-semibold text-brand-gold">
                Highlight
              </span>
            )}
          </div>

          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{event.title}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(event.date)}
              {event.endDate && ` – ${formatDate(event.endDate)}`}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />{event.venue}
              </span>
            )}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] overflow-hidden"
              >
                {event.description}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-crimson hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronRight size={12} className={cn("transition-transform", expanded && "rotate-90")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory>("ALL");
  const [activeTab, setActiveTab]           = useState<"upcoming" | "past">("upcoming");

  const filtered = events.filter((e) => {
    const matchCat = activeCategory === "ALL" || e.category === activeCategory;
    const matchTab = activeTab === "upcoming" ? e.isUpcoming : !e.isUpcoming;
    return matchCat && matchTab;
  });

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-black pb-16 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(107,15,26,0.7),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_80%,rgba(74,10,18,0.4),transparent)]" />
        <div className="container-aspcs relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-eyebrow mb-5 inline-flex"><Calendar size={11} />Events</span>
            <h1 className="font-display text-display-md font-bold text-white">
              School <span className="text-gold-shimmer">Events</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-brand-slate">
              Stay updated with all upcoming and past events at ASPCS —
              from sports days to cultural fests and academic programmes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-pad pt-10">
        <div className="container-aspcs">

          {/* Tabs */}
          <div className="mb-8 flex items-center gap-2 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-1.5 w-fit shadow-card">
            {(["upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-xl px-6 py-2.5 text-sm font-semibold capitalize transition-all",
                  activeTab === tab
                    ? "bg-brand-crimson text-white shadow-crimson"
                    : "text-[var(--text-muted)] hover:text-brand-crimson"
                )}
              >
                {tab} Events
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                  activeCategory === cat
                    ? "border-brand-crimson bg-brand-crimson text-white"
                    : "border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-muted)] hover:border-brand-crimson/40 hover:text-brand-crimson"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Events list */}
          <div className="grid gap-4 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((event, i) => (
                  <EventCard key={event.id} event={event} i={i} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 py-20 text-center text-[var(--text-muted)]"
                >
                  No events found in this category.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
