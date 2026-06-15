"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, FileText, Search, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { getPublishedNotices, type Notice } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const CATEGORIES = ["ALL", "GENERAL", "ACADEMIC", "EXAMINATION", "ADMISSION", "EVENT", "HOLIDAY", "CIRCULAR"];

const CATEGORY_COLORS: Record<string, string> = {
  GENERAL:     "bg-blue-50 text-blue-700",
  ACADEMIC:    "bg-purple-50 text-purple-700",
  EXAMINATION: "bg-red-50 text-red-700",
  ADMISSION:   "bg-green-50 text-green-700",
  EVENT:       "bg-orange-50 text-orange-700",
  HOLIDAY:     "bg-pink-50 text-pink-700",
  CIRCULAR:    "bg-yellow-50 text-yellow-700",
};

export default function NoticesPage() {
  const [notices,  setNotices]  = useState<Notice[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("ALL");

  useEffect(() => {
    getPublishedNotices(0, 100).then(data => {
      setNotices(data);
      setLoading(false);
    });
  }, []);

  const filtered = notices.filter(n => {
    const matchCat = category === "ALL" || n.category === category;
    const matchQ   = !search || n.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <main className="min-h-screen bg-brand-black">
      {/* Header */}
      <section className="relative border-b border-brand-crimson/20 bg-gradient-to-b from-brand-maroon/20 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-2">
            <Bell size={14} className="text-brand-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Notice Board</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white md:text-5xl">
            School Notices
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-slate">
            Stay updated with the latest announcements, circulars and academic notices from ASPCS.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Search + Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notices..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-crimson/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={cn("rounded-full px-4 py-2 text-xs font-semibold transition-all",
                  category === c ? "bg-brand-crimson text-white" : "bg-white/5 text-brand-slate hover:bg-white/10")}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={28} className="animate-spin text-brand-crimson" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/8 py-24 text-center text-brand-slate">
            {notices.length === 0
              ? "No notices published yet. Check back soon."
              : "No notices match your search."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notice, i) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border p-5 transition-all hover:border-brand-crimson/30",
                  notice.important
                    ? "border-brand-gold/30 bg-brand-gold/5"
                    : "border-white/8 bg-white/3"
                )}>

                <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  notice.important ? "bg-brand-gold/20" : "bg-brand-crimson/10")}>
                  {notice.important
                    ? <AlertCircle size={18} className="text-brand-gold" />
                    : <Bell size={18} className="text-brand-crimson" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {notice.important && (
                      <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                        Important
                      </span>
                    )}
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      CATEGORY_COLORS[notice.category] ?? "bg-white/10 text-white/60")}>
                      {notice.category}
                    </span>
                    <span className="text-xs text-brand-slate">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white group-hover:text-brand-crimson transition-colors">
                    {notice.title}
                  </h3>

                  {notice.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-brand-slate">{notice.description}</p>
                  )}
                </div>

                {notice.pdfUrl && (
                  <a href={notice.pdfUrl} target="_blank" rel="noreferrer"
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-crimson/10 px-3 py-2 text-xs font-semibold text-brand-crimson hover:bg-brand-crimson hover:text-white transition-all">
                    <FileText size={13} />
                    PDF
                    <ExternalLink size={11} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-brand-slate">
          Showing {filtered.length} of {notices.length} notices
        </p>
      </div>
    </main>
  );
}
