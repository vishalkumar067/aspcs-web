"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Bell, ArrowRight, ExternalLink, Clock, CalendarDays, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPublishedNotices, getUpcomingEvents, type Notice, type Event } from "@/lib/publicApi";

const categoryColors: Record<string, string> = {
  ACADEMIC:    "bg-blue-500/20 text-blue-200 border-blue-500/40",
  EXAMINATION: "bg-rose-500/20 text-rose-200 border-rose-500/40",
  EXAM:        "bg-rose-500/20 text-rose-200 border-rose-500/40",
  HOLIDAY:     "bg-green-500/20 text-green-200 border-green-500/40",
  ADMISSION:   "bg-brand-gold/20 text-brand-gold border-brand-gold/40",
  GENERAL:     "bg-violet-500/20 text-violet-200 border-violet-500/40",
  EVENT:       "bg-orange-500/20 text-orange-200 border-orange-500/40",
  CIRCULAR:    "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatEventDate(d: string) {
  const dt = new Date(d);
  return {
    day: dt.toLocaleDateString("en-IN", { day: "numeric" }),
    mon: dt.toLocaleDateString("en-IN", { month: "short" }),
  };
}

export default function NoticesSection() {
  const [notices,  setNotices]  = useState<Notice[]>([]);
  const [events,   setEvents]   = useState<Event[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      getPublishedNotices(0, 5),
      getUpcomingEvents(),
    ]).then(([n, e]) => {
      setNotices(n);
      setEvents(e.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <section className="section-pad bg-brand-black">
      {/* Subtle top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-crimson/40 to-transparent" />

      <div className="container-aspcs">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* ── Left: Notices ──────────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 flex items-end justify-between"
            >
              <div>
                <span className="section-eyebrow mb-4 inline-flex">
                  <Bell size={11} /> Latest Notices
                </span>
                <h2 className="font-display text-display-xs font-black text-white">
                  Stay <span className="text-brand-gold">Informed</span>
                </h2>
              </div>
              <Link href="/notices" className="btn-ghost hidden text-sm sm:inline-flex">
                All notices <ArrowRight size={14} />
              </Link>
            </motion.div>

            {loading ? (
              <div className="flex items-center gap-3 text-brand-slate py-8">
                <Loader2 size={18} className="animate-spin text-brand-crimson" />
                <span className="text-sm font-medium">Loading notices...</span>
              </div>
            ) : notices.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/3 py-10 text-center text-brand-slate">
                No notices published yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {notices.map((notice, i) => (
                  <motion.li
                    key={notice.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={`/notices`}
                      className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/4 p-4 transition-all duration-200 hover:border-brand-gold/40 hover:bg-white/6"
                    >
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 border border-brand-gold/20">
                        <FileText size={17} className="text-brand-gold" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            categoryColors[notice.category] ?? categoryColors.GENERAL
                          )}>
                            {notice.category}
                          </span>
                          {notice.important && (
                            <span className="rounded-full border border-brand-gold/40 bg-brand-gold/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-gold">
                              ★ Important
                            </span>
                          )}
                        </div>

                        <p className="line-clamp-1 text-sm font-bold text-white group-hover:text-brand-gold transition-colors">
                          {notice.title}
                        </p>

                        <div className="mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs font-medium text-brand-slate">
                            <Clock size={11} />{formatDate(notice.createdAt)}
                          </span>
                          {notice.pdfUrl && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-brand-gold">
                              <ExternalLink size={11} />PDF
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}

            <div className="mt-6 sm:hidden">
              <Link href="/notices" className="btn-outline w-full justify-center">
                View All Notices <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Right: CTA + Events ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Admission CTA card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-maroon-dark to-brand-black p-8 shadow-maroon border border-brand-crimson/20">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-gold/10 blur-2xl" />
              <div className="pointer-events-none absolute inset-0 opacity-10"
                style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.2) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

              <div className="relative z-10">
                <div className="mb-2 inline-flex rounded-full border border-brand-gold/40 bg-brand-gold/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold">
                  ● Admissions Open 2026–27
                </div>
                <h3 className="mb-3 font-display text-2xl font-black text-white">
                  Join ASPCS for<br />Session 2026–27
                </h3>
                <p className="mb-6 text-sm font-medium leading-relaxed text-brand-slate">
                  Limited seats available. Apply online now and secure your child's
                  future at one of Bihar's premier institutions.
                </p>
                <Link href="/admissions" className="btn-primary w-full justify-center">
                  Start Application <ArrowRight size={15} />
                </Link>
                <p className="mt-3 text-center text-xs font-medium text-brand-slate">
                  Free counselling session included
                </p>
              </div>
            </div>

            {/* Upcoming events — real data */}
            <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
              <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white">
                Upcoming Events
              </h4>
              {events.length === 0 ? (
                <p className="text-sm font-medium text-brand-slate">No upcoming events.</p>
              ) : (
                <ul className="space-y-4">
                  {events.map((ev) => {
                    const { day, mon } = formatEventDate(ev.startDate);
                    return (
                      <li key={ev.id} className="flex items-start gap-4">
                        <div className="flex w-12 shrink-0 flex-col items-center rounded-xl border border-brand-gold/30 bg-brand-gold/10 py-2 text-center">
                          <span className="text-[11px] font-black text-brand-gold leading-none">{day}</span>
                          <span className="text-[10px] font-semibold text-brand-slate leading-none mt-0.5">{mon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white">{ev.title}</p>
                          <p className="text-xs font-medium text-brand-slate">{ev.category}</p>
                          {ev.venue && (
                            <p className="flex items-center gap-1 text-[11px] text-brand-slate mt-0.5">
                              <MapPin size={9} />{ev.venue}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link href="/events" className="btn-ghost mt-4 w-full justify-center text-sm font-semibold">
                View Calendar <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
