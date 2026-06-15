"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Loader2, Star } from "lucide-react";
import { getPublicEvents, getUpcomingEvents, type Event } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  ACADEMIC:  "bg-blue-50 text-blue-700",
  SPORTS:    "bg-green-50 text-green-700",
  CULTURAL:  "bg-purple-50 text-purple-700",
  RELIGIOUS: "bg-orange-50 text-orange-700",
  EXAM:      "bg-red-50 text-red-700",
  HOLIDAY:   "bg-pink-50 text-pink-700",
  OTHER:     "bg-gray-50 text-gray-700",
};

export default function EventsPage() {
  const [events,   setEvents]   = useState<Event[]>([]);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("ALL");

  useEffect(() => {
    Promise.all([
      getPublicEvents(0, 50),
      getUpcomingEvents(),
    ]).then(([all, up]) => {
      setEvents(all);
      setUpcoming(up);
      setLoading(false);
    });
  }, []);

  const CATEGORIES = ["ALL", ...Array.from(new Set(events.map(e => e.category)))];

  const filtered = filter === "ALL" ? events : events.filter(e => e.category === filter);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

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
            {/* Upcoming events strip */}
            {upcoming.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 font-display text-lg font-bold text-white">
                  <span className="text-brand-gold">↑</span> Upcoming Events
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {upcoming.map(ev => (
                    <div key={ev.id}
                      className="flex min-w-56 shrink-0 items-center gap-3 rounded-2xl border border-brand-crimson/20 bg-brand-crimson/10 p-4">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                    filter === c ? "bg-brand-crimson text-white" : "bg-white/5 text-brand-slate hover:bg-white/10")}>
                  {c}
                </button>
              ))}
            </div>

            {/* Event grid */}
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-white/8 py-24 text-center text-brand-slate">
                No events found.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((ev, i) => (
                  <motion.div key={ev.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group overflow-hidden rounded-3xl border border-white/8 bg-white/3 transition-all hover:border-brand-crimson/30">

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
                        {ev.highlight && (
                          <Star size={14} className="text-brand-gold fill-brand-gold" />
                        )}
                      </div>

                      <h3 className="font-display text-base font-bold text-white group-hover:text-brand-crimson transition-colors">
                        {ev.title}
                      </h3>

                      {ev.description && (
                        <p className="mt-1.5 line-clamp-2 text-sm text-brand-slate">{ev.description}</p>
                      )}

                      <div className="mt-4 space-y-1.5 text-xs text-brand-slate">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={12} />
                          {formatDate(ev.startDate)}
                          {ev.endDate && ev.endDate !== ev.startDate && ` – ${formatDate(ev.endDate)}`}
                        </div>
                        {ev.venue && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} />{ev.venue}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
