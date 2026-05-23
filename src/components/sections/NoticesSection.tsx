"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Bell, ArrowRight, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotices } from "@/hooks/useApi";

const categoryColorsLight: Record<string, string> = {
  ACADEMIC:  "bg-blue-50 text-blue-700 border-blue-200",
  EXAM:      "bg-rose-50 text-rose-700 border-rose-200",
  HOLIDAY:   "bg-green-50 text-green-700 border-green-200",
  ADMISSION: "bg-amber-50 text-amber-700 border-amber-200",
  GENERAL:   "bg-violet-50 text-violet-700 border-violet-200",
  URGENT:    "bg-red-50 text-red-700 border-red-200",
};

const FALLBACK = [
  { id: "1", title: "Annual Sports Day 2025 — Schedule & Registration", category: "GENERAL",  important: true,  publishedAt: "2025-05-10T10:00:00Z", pdfUrl: "#" },
  { id: "2", title: "Class X Board Examination Timetable Released",     category: "EXAM",     important: true,  publishedAt: "2025-05-08T09:00:00Z", pdfUrl: "#" },
  { id: "3", title: "Summer Holiday Dates Announcement",                category: "HOLIDAY",  important: false, publishedAt: "2025-05-06T08:30:00Z", pdfUrl: null },
  { id: "4", title: "Parent-Teacher Meeting — Grades VI to VIII",       category: "ACADEMIC", important: false, publishedAt: "2025-05-04T11:00:00Z", pdfUrl: null },
  { id: "5", title: "Admissions Open for Session 2025-26",              category: "ADMISSION",important: true,  publishedAt: "2025-05-01T00:00:00Z", pdfUrl: "#" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function NoticesSection() {
  const { data, loading } = useNotices(0, 5);
  const notices = data?.content?.length ? data.content : FALLBACK;

  return (
    <section className="section-pad bg-white">
      <div className="container-aspcs">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 flex items-end justify-between">
              <div>
                <span className="section-eyebrow mb-4 inline-flex"><Bell size={11} /> Latest Notices</span>
                <h2 className="font-display text-display-xs font-bold text-brand-dark">Stay <span className="text-brand-teal">Informed</span></h2>
              </div>
              <Link href="/notices" className="btn-ghost hidden text-sm sm:inline-flex">All notices <ArrowRight size={14} /></Link>
            </motion.div>

            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-brand-mint" />)}</div>
            ) : (
              <ul className="space-y-3">
                {notices.map((notice, i) => (
                  <motion.li key={notice.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                    <Link href={`/notices/${notice.id}`} className="group flex items-start gap-4 rounded-2xl border border-brand-teal/10 bg-brand-cream p-4 transition-all hover:border-brand-teal/30 hover:shadow-card">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/8">
                        <FileText size={17} className="text-brand-teal" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", categoryColorsLight[notice.category] ?? categoryColorsLight.GENERAL)}>{notice.category}</span>
                          {notice.important && <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">Important</span>}
                        </div>
                        <p className="line-clamp-1 text-sm font-semibold text-brand-dark group-hover:text-brand-teal">{notice.title}</p>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-brand-muted"><Clock size={11} />{formatDate(notice.publishedAt)}</span>
                          {notice.pdfUrl && <span className="flex items-center gap-1 text-xs text-brand-teal"><ExternalLink size={11} />PDF</span>}
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal to-brand-teal-deep p-8 shadow-teal">
              <div className="relative z-10">
                <div className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">● Admissions Open</div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">Join ASPCS for Session 2025-26</h3>
                <p className="mb-6 text-sm text-white/80">Limited seats available. Apply online and secure your child&apos;s future.</p>
                <Link href="/admissions" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-teal transition-all hover:-translate-y-0.5">
                  Start Application <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-teal/15 bg-white p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-muted">Upcoming Events</h4>
              <ul className="space-y-4">
                {[
                  { date: "15 May", title: "Annual Sports Day",  tag: "Sports" },
                  { date: "22 May", title: "Science Exhibition", tag: "Academic" },
                  { date: "5 Jun",  title: "Cultural Fest 2025", tag: "Cultural" },
                ].map((ev) => (
                  <li key={ev.title} className="flex items-center gap-4">
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-brand-teal/20 bg-brand-mint py-2 text-center">
                      <span className="text-[10px] font-bold text-brand-teal">{ev.date.split(" ")[0]}</span>
                      <span className="text-[10px] text-brand-slate">{ev.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-dark">{ev.title}</p>
                      <p className="text-xs text-brand-muted">{ev.tag}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/events" className="btn-ghost mt-4 w-full justify-center text-sm">View Calendar <ArrowRight size={13} /></Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
