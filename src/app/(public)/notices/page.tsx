"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, FileText, Search, ExternalLink, AlertCircle, Loader2,
  X, Download, ChevronRight, Calendar
} from "lucide-react";
import { getPublishedNotices, type Notice } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const CATEGORIES = ["ALL", "GENERAL", "ACADEMIC", "EXAMINATION", "ADMISSION", "EVENT", "HOLIDAY", "CIRCULAR"];

const CATEGORY_COLORS: Record<string, string> = {
  GENERAL:     "bg-blue-500/15 text-blue-300",
  ACADEMIC:    "bg-purple-500/15 text-purple-300",
  EXAMINATION: "bg-red-500/15 text-red-300",
  ADMISSION:   "bg-green-500/15 text-green-300",
  EVENT:       "bg-orange-500/15 text-orange-300",
  HOLIDAY:     "bg-pink-500/15 text-pink-300",
  CIRCULAR:    "bg-yellow-500/15 text-yellow-300",
};

export default function NoticesPage() {
  const [notices,  setNotices]  = useState<Notice[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("ALL");
  const [selected, setSelected] = useState<Notice | null>(null);

  useEffect(() => {
    getPublishedNotices(0, 100).then(data => {
      setNotices(data);
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

  const filtered = notices.filter(n => {
    const matchCat = category === "ALL" || n.category === category;
    const matchQ   = !search
      || n.title.toLowerCase().includes(search.toLowerCase())
      || (n.description ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-brand-black">
      {/* Header */}
      <section className="relative border-b border-brand-crimson/20 bg-gradient-to-b from-brand-maroon/20 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-2">
            <Bell size={14} className="text-brand-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Notice Board</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white md:text-5xl">School Notices</h1>
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

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={28} className="animate-spin text-brand-crimson" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/8 py-24 text-center text-brand-slate">
            {notices.length === 0 ? "No notices published yet. Check back soon." : "No notices match your search."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notice, i) => (
              <motion.button
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(notice)}
                className={cn(
                  "group w-full cursor-pointer rounded-2xl border p-5 text-left transition-all",
                  "hover:-translate-y-0.5 hover:border-brand-crimson/40 hover:shadow-lg hover:shadow-brand-crimson/5",
                  notice.important ? "border-brand-gold/30 bg-brand-gold/5" : "border-white/8 bg-white/3"
                )}
              >
                <div className="flex items-start gap-4">
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
                      <span className="text-xs text-brand-slate">{fmt(notice.createdAt)}</span>
                      {notice.pdfUrl && (
                        <span className="flex items-center gap-1 text-[10px] text-brand-slate">
                          <FileText size={10} /> PDF attached
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-brand-crimson">
                      {notice.title}
                    </h3>

                    {notice.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-brand-slate">{notice.description}</p>
                    )}

                    <span className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-crimson/60 transition-colors group-hover:text-brand-crimson">
                      Read full notice <ChevronRight size={12} />
                    </span>
                  </div>

                  <ChevronRight size={18} className="mt-1 hidden shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-brand-crimson sm:block" />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-brand-slate">
          Showing {filtered.length} of {notices.length} notices · Click any notice to read in full
        </p>
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
              {/* Header */}
              <div className="flex-shrink-0 border-b border-white/8 p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {selected.important && (
                    <span className="flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                      <AlertCircle size={10} /> Important
                    </span>
                  )}
                  <span className={cn("rounded-full px-3 py-1 text-[10px] font-semibold",
                    CATEGORY_COLORS[selected.category] ?? "bg-white/10 text-white/60")}>
                    {selected.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-brand-slate">
                    <Calendar size={11} /> {fmt(selected.createdAt)}
                  </span>
                </div>

                <h2 className="pr-10 font-display text-xl font-bold text-white sm:text-2xl">
                  {selected.title}
                </h2>

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

              {/* PDF */}
              {selected.pdfUrl && (
                <div className="flex-shrink-0 border-t border-white/8 p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
                    Attached Document
                  </p>
                  <div className="mb-4 flex flex-wrap gap-3">
                    <a
                      href={selected.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-xl bg-brand-crimson px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-crimson/80"
                    >
                      <ExternalLink size={14} />
                      Open PDF
                    </a>
                    <a
                      href={selected.pdfUrl}
                      download
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                  <iframe
                    src={selected.pdfUrl}
                    title={selected.title}
                    className="h-64 w-full rounded-xl border border-white/10 sm:h-80"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
