"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Loader2, Star, X, ChevronRight, ExternalLink } from "lucide-react";
import { getPublicEvents, getUpcomingEvents, type Event } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  ACADEMIC:  "bg-blue-500/15 text-blue-300",
  SPORTS:    "bg-green-500/15 text-green-300",
  CULTURAL:  "bg-purple-500/15 text-purple-300",
  RELIGIOUS: "bg-orange-500/15 text-orange-300",
  EXAM:      "bg-red-500/15 text-red-300",
  HOLIDAY:   "bg-pink-500/15 text-pink-300",
  OTHER:     "bg-white/10 text-white/60",
};

export default function EventsPage() {
  const [events,   setEvents]   = useState<Event[]>([]);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("ALL");
  const [selected, setSelected] = useState<Event | null>(null);

  useEffect(() => {
    Promise.all([getPublicEvents(0, 50), getUpcomingEvents()]).then(([all, up]) => {
      setEvents(all);
      setUpcoming(up);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const CATEGORIES = ["ALL", ...Array.from(new Set(events.map(e => e.category)))];
  const filtered = filter === "ALL" ? events : events.filter(e => e.category === filter);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const fmtLong = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-brand-black">
      {/* Header */}
      <section className="relative border-b border-brand-crimson/20 bg-gradient-to-b from-brand-maroon/20 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-2">
            <CalendarDays size={14} className="text-brand-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">School Calendar</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white md:text-5xl">Events</h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-slate">
            Explore all upcoming and past school events, activities, and programmes.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={28} className="animate-spin text-brand-crimson" />
          </div>
        ) : (
          <>
            {/* Upcoming strip */}
            {upcoming.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 font-display text-lg font-bold text-white">
                  <span className="text-brand-gold">↑</span> Upcoming Events
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {upcoming.map(ev => (
                    <button key={ev.id} onClick={() => setSelected(ev)}
                      className="flex min-w-56 shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-brand-crimson/20 bg-brand-crimson/10 p-4 text-left transition-all hover:border-brand-crimson/50 hover:bg-brand-crimson/20">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-crimson text-white">
                        <span className="text-xs font-bold leading-none">
                          {new Date(ev.startDate).toLocaleDateString("en-IN", { day: "numeric" })}
                        </span>
                        <span className="text-[9px] uppercase">
                          {new Date(ev.startDate).toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{ev.title}</p>
                        {ev.venue && <p className="truncate text-xs text-brand-slate">{ev.venue}</p>}
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-brand-crimson/70">
                          View details <ChevronRight size={10} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                    filter === c ? "bg-brand-crimson text-white" : "bg-white/5 text-brand-slate hover:bg-white/10")}>
                  {c}
                </button>
              ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-white/8 py-24 text-center text-brand-slate">No events found.</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((ev, i) => (
                  <motion.button key={ev.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelected(ev)}
                    className="group cursor-pointer overflow-hidden rounded-3xl border border-white/8 bg-white/3 text-left transition-all hover:border-brand-crimson/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-crimson/5">

                    {ev.imageUrl ? (
                      <img src={ev.imageUrl} alt={ev.title}
                        className="h-44 w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-brand-maroon/30 to-brand-crimson/10">
                        <CalendarDays size={40} className="text-brand-crimson/40" />
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                          CATEGORY_COLORS[ev.category] ?? "bg-white/10 text-white/60")}>
                          {ev.category}
                        </span>
                        {ev.highlight && <Star size={14} className="fill-brand-gold text-brand-gold" />}
                      </div>

                      <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-brand-crimson">
                        {ev.title}
                      </h3>

                      {ev.description && (
                        <p className="mt-1.5 line-clamp-2 text-sm text-brand-slate">{ev.description}</p>
                      )}

                      <div className="mt-4 space-y-1.5 text-xs text-brand-slate">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={12} />
                          {fmt(ev.startDate)}
                          {ev.endDate && ev.endDate !== ev.startDate && ` – ${fmt(ev.endDate)}`}
                        </div>
                        {ev.venue && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} />{ev.venue}
                          </div>
                        )}
                      </div>

                      <span className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-crimson/60 transition-colors group-hover:text-brand-crimson">
                        View details <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={e => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#110408] shadow-2xl"
            >
              {/* Image */}
              {selected.imageUrl && (
                <div className="flex-shrink-0">
                  <img src={selected.imageUrl} alt={selected.title}
                    className="h-52 w-full object-cover sm:h-64" />
                </div>
              )}

              {/* Header */}
              <div className="flex-shrink-0 border-b border-white/8 p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-3 py-1 text-[10px] font-semibold",
                    CATEGORY_COLORS[selected.category] ?? "bg-white/10 text-white/60")}>
                    {selected.category}
                  </span>
                  {selected.highlight && (
                    <span className="flex items-center gap-1 rounded-full bg-brand-gold/20 px-3 py-1 text-[10px] font-bold text-brand-gold">
                      <Star size={10} className="fill-brand-gold" /> Highlighted
                    </span>
                  )}
                </div>

                <h2 className="pr-10 font-display text-xl font-bold text-white sm:text-2xl">
                  {selected.title}
                </h2>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-brand-slate">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-brand-crimson" />
                    {fmtLong(selected.startDate)}
                    {selected.endDate && selected.endDate !== selected.startDate && ` – ${fmtLong(selected.endDate)}`}
                  </span>
                  {selected.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand-crimson" />
                      {selected.venue}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {selected.description ? (
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-white/80">
                    {selected.description}
                  </p>
                ) : (
                  <p className="italic text-white/30">No additional details provided.</p>
                )}
              </div>

              {/* Image link if exists */}
              {selected.imageUrl && (
                <div className="flex-shrink-0 border-t border-white/8 p-4">
                  <a
                    href={selected.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10 w-fit"
                  >
                    <ExternalLink size={14} />
                    View Full Image
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
