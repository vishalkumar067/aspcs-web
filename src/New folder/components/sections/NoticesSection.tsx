"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Bell, ArrowRight, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Static mock data — replace with API call via server component or SWR
const mockNotices = [
  {
    id: "1",
    title: "Annual Sports Day 2025 — Schedule & Registration",
    category: "GENERAL",
    isImportant: true,
    publishedAt: "2025-05-10T10:00:00Z",
    pdfUrl: "#",
  },
  {
    id: "2",
    title: "Class X Board Examination Timetable Released",
    category: "EXAM",
    isImportant: true,
    publishedAt: "2025-05-08T09:00:00Z",
    pdfUrl: "#",
  },
  {
    id: "3",
    title: "Summer Holiday Dates Announcement — 2025",
    category: "HOLIDAY",
    isImportant: false,
    publishedAt: "2025-05-06T08:30:00Z",
    pdfUrl: null,
  },
  {
    id: "4",
    title: "Parent-Teacher Meeting — Grades VI to VIII",
    category: "ACADEMIC",
    isImportant: false,
    publishedAt: "2025-05-04T11:00:00Z",
    pdfUrl: null,
  },
  {
    id: "5",
    title: "Admissions Open for Session 2026–27: Apply Online",
    category: "ADMISSION",
    isImportant: true,
    publishedAt: "2025-05-01T00:00:00Z",
    pdfUrl: "#",
  },
];

const categoryColors: Record<string, string> = {
  ACADEMIC:  "bg-blue-500/15 text-blue-300 border-blue-500/30",
  EXAM:      "bg-rose-500/15 text-rose-300 border-rose-500/30",
  HOLIDAY:   "bg-green-500/15 text-green-300 border-green-500/30",
  ADMISSION: "bg-brand-gold/15 text-brand-gold border-brand-gold/30",
  GENERAL:   "bg-violet-500/15 text-violet-300 border-violet-500/30",
  URGENT:    "bg-red-500/20 text-red-300 border-red-500/40",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NoticesSection() {
  return (
    <section className="section-pad bg-brand-cream dark:bg-brand-black">
      <div className="container-aspcs">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* ── Left: Notices list ─────────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 flex items-end justify-between"
            >
              <div>
                <span className="section-eyebrow mb-4 inline-flex">
                  <Bell size={11} />
                  Latest Notices
                </span>
                <h2 className="font-display text-display-xs font-bold text-brand-navy dark:text-white">
                  Stay <span className="text-brand-gold">Informed</span>
                </h2>
              </div>
              <Link href="/notices" className="btn-ghost hidden text-sm sm:inline-flex">
                All notices <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Notice items */}
            <ul className="space-y-3">
              {mockNotices.map((notice, i) => (
                <motion.li
                  key={notice.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={`/notices/${notice.id}`}
                    className="group flex items-start gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-4 transition-all duration-200 hover:border-brand-gold/30 hover:shadow-card"
                  >
                    {/* Icon */}
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-maroon/6 dark:bg-brand-gold/8">
                      <FileText size={17} className="text-brand-gold" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        {/* Category badge */}
                        <span className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          categoryColors[notice.category] ?? categoryColors.GENERAL
                        )}>
                          {notice.category}
                        </span>
                        {notice.isImportant && (
                          <span className="rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-gold border border-brand-gold/30">
                            Important
                          </span>
                        )}
                      </div>

                      <p className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)] group-hover:text-brand-gold transition-colors">
                        {notice.title}
                      </p>

                      <div className="mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <Clock size={11} />
                          {formatDate(notice.publishedAt)}
                        </span>
                        {notice.pdfUrl && (
                          <span className="flex items-center gap-1 text-xs text-brand-gold">
                            <ExternalLink size={11} />
                            PDF attached
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-6 sm:hidden">
              <Link href="/notices" className="btn-outline w-full justify-center">
                View All Notices <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Right: Quick Calendar / CTA ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Admission CTA card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy to-brand-navy-light p-8 shadow-navy">
              {/* Background decoration */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-gold/10 blur-2xl" />
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(201,168,76,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.2) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              <div className="relative z-10">
                <div className="mb-2 inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                  ● Admissions Open
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">
                  Join ASPCS for Session 2026–27
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-brand-slate">
                  Limited seats available. Apply online now and secure your child's
                  future at one of the region's premier institutions.
                </p>
                <Link href="/admissions" className="btn-primary w-full justify-center">
                  Start Application <ArrowRight size={15} />
                </Link>
                <p className="mt-3 text-center text-xs text-brand-slate">
                  Free counselling session included
                </p>
              </div>
            </div>

            {/* Upcoming highlight */}
            <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Upcoming Events
              </h4>
              <ul className="space-y-4">
                {[
                  { date: "15 May", title: "Annual Sports Day",    tag: "Sports" },
                  { date: "22 May", title: "Science Exhibition",   tag: "Academic" },
                  { date: "5 Jun",  title: "Cultural Fest 2025",   tag: "Cultural" },
                ].map((ev) => (
                  <li key={ev.title} className="flex items-center gap-4">
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-brand-gold/20 bg-brand-gold/8 py-2 text-center">
                      <span className="text-[10px] font-semibold text-brand-gold leading-none">
                        {ev.date.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-brand-slate leading-none mt-0.5">
                        {ev.date.split(" ")[1]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{ev.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{ev.tag}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/events" className="btn-ghost mt-4 w-full justify-center text-sm">
                View Calendar <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
