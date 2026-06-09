"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Bell, ExternalLink, Clock, Search, Filter, Download } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = ["ALL", "ACADEMIC", "EXAM", "HOLIDAY", "ADMISSION", "GENERAL", "URGENT"];

const mockNotices = [
  { id: "1",  title: "Annual Sports Day 2025 — Schedule & Registration Open for All Students", category: "GENERAL",  isImportant: true,  publishedAt: "2025-05-10T10:00:00Z", pdfUrl: "#" },
  { id: "2",  title: "Class X Board Examination Timetable Released — Download Now",            category: "EXAM",     isImportant: true,  publishedAt: "2025-05-08T09:00:00Z", pdfUrl: "#" },
  { id: "3",  title: "Summer Holiday Dates Announcement — 2025",                               category: "HOLIDAY",  isImportant: false, publishedAt: "2025-05-06T08:30:00Z", pdfUrl: null },
  { id: "4",  title: "Parent-Teacher Meeting — Grades VI to VIII (22nd May 2025)",             category: "ACADEMIC", isImportant: false, publishedAt: "2025-05-04T11:00:00Z", pdfUrl: null },
  { id: "5",  title: "Admissions Open for Session 2025–26: Apply Online Before 31st May",      category: "ADMISSION",isImportant: true,  publishedAt: "2025-05-01T00:00:00Z", pdfUrl: "#" },
  { id: "6",  title: "Science Exhibition Results — Prize Winners Announced",                   category: "ACADEMIC", isImportant: false, publishedAt: "2025-04-28T12:00:00Z", pdfUrl: "#" },
  { id: "7",  title: "Urgent: School Closed on 15th May Due to Local Holiday",                 category: "URGENT",   isImportant: true,  publishedAt: "2025-04-25T08:00:00Z", pdfUrl: null },
  { id: "8",  title: "Class IX & X Pre-Board Examination Schedule",                            category: "EXAM",     isImportant: true,  publishedAt: "2025-04-20T09:00:00Z", pdfUrl: "#" },
  { id: "9",  title: "Annual Prize Distribution Ceremony — 10th May 2025",                    category: "GENERAL",  isImportant: false, publishedAt: "2025-04-18T10:00:00Z", pdfUrl: null },
  { id: "10", title: "Fee Payment Deadline Reminder — Last Date: 30th April",                 category: "GENERAL",  isImportant: true,  publishedAt: "2025-04-15T08:00:00Z", pdfUrl: null },
  { id: "11", title: "New Library Books Added — Catalogue Available at Library Desk",          category: "ACADEMIC", isImportant: false, publishedAt: "2025-04-10T11:00:00Z", pdfUrl: "#" },
  { id: "12", title: "Holiday Homework for Summer Vacation — All Grades",                     category: "HOLIDAY",  isImportant: false, publishedAt: "2025-04-05T09:00:00Z", pdfUrl: "#" },
];

const categoryColors: Record<string, string> = {
  ACADEMIC:  "bg-blue-500/15 text-blue-300 border-blue-500/30",
  EXAM:      "bg-rose-500/15 text-rose-300 border-rose-500/30",
  HOLIDAY:   "bg-green-500/15 text-green-300 border-green-500/30",
  ADMISSION: "bg-brand-gold/15 text-brand-gold border-brand-gold/30",
  GENERAL:   "bg-violet-500/15 text-violet-300 border-violet-500/30",
  URGENT:    "bg-red-500/20 text-red-300 border-red-500/40",
};

const categoryColorsLight: Record<string, string> = {
  ACADEMIC:  "bg-blue-50 text-blue-700 border-blue-200",
  EXAM:      "bg-rose-50 text-rose-700 border-rose-200",
  HOLIDAY:   "bg-green-50 text-green-700 border-green-200",
  ADMISSION: "bg-amber-50 text-amber-700 border-amber-200",
  GENERAL:   "bg-violet-50 text-violet-700 border-violet-200",
  URGENT:    "bg-red-50 text-red-700 border-red-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const ITEMS_PER_PAGE = 8;

export default function NoticesPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = mockNotices.filter((n) => {
    const matchCat    = activeCategory === "ALL" || n.category === activeCategory;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-black">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black pb-16 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(201,168,76,0.12),transparent)]" />
        <div className="container-aspcs relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-eyebrow mb-5 inline-flex"><Bell size={11} />School Notices</span>
            <h1 className="font-display text-display-md font-bold text-white">
              Notices & <span className="text-brand-gold">Circulars</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-brand-slate">
              Stay up to date with the latest announcements, exam schedules,
              holiday notices, and important circulars from ASPCS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filters + List ──────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-aspcs">

          {/* Search + Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search notices..."
                className="input-field pl-10"
              />
            </div>

            {/* Result count */}
            <p className="text-sm text-[var(--text-muted)]">
              Showing <span className="font-semibold text-[var(--text-primary)]">{filtered.length}</span> notices
            </p>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  activeCategory === cat
                    ? "border-brand-gold bg-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.3)]"
                    : "border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-muted)] hover:border-brand-gold/40 hover:text-brand-gold"
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Notice list */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {paginated.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center text-[var(--text-muted)]"
                >
                  No notices found.
                </motion.div>
              ) : (
                paginated.map((notice, i) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.04 }}
                    className="group flex items-start gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-5 transition-all duration-200 hover:border-brand-gold/30 hover:shadow-card"
                  >
                    {/* Icon */}
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10">
                      <FileText size={17} className="text-brand-gold" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          categoryColorsLight[notice.category]
                        )}>
                          {notice.category}
                        </span>
                        {notice.isImportant && (
                          <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-brand-gold">
                        {notice.title}
                      </p>
                      <div className="mt-1.5 flex items-center gap-4">
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <Clock size={11} />{formatDate(notice.publishedAt)}
                        </span>
                      </div>
                    </div>

                    {/* PDF download */}
                    {notice.pdfUrl && (
                      <a
                        href={notice.pdfUrl}
                        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-gold/30 bg-brand-gold/5 px-3 py-2 text-xs font-semibold text-brand-gold transition-all hover:bg-brand-gold/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download size={13} /> PDF
                      </a>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-brand-gold/40 hover:text-brand-gold disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "h-9 w-9 rounded-xl border text-sm font-semibold transition-all",
                    page === i + 1
                      ? "border-brand-gold bg-brand-gold text-brand-black"
                      : "border-[var(--surface-border)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:border-brand-gold/40"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-brand-gold/40 hover:text-brand-gold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
