"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, FileText, Search, AlertCircle, Loader2,
  X, Download, ExternalLink, Calendar, Tag, ChevronRight
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

// ─── Notice Detail Modal ────────────────────────────────────────
function NoticeModal({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-[#110408] shadow-2xl flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex-shrink-0 border-b border-white/8 p-6 pb-4">
            {/* Badges */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {notice.important && (
                <span className="flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
                  <AlertCircle size={11} />
                  Important
                </span>
              )}
              <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", CATEGORY_COLORS[notice.category] ?? "bg-white/10 text-white/60")}>
                <Tag size={10} />
                {notice.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-brand-slate">
                <Calendar size={11} />
                {formatDate(notice.publishedAt ?? notice.createdAt ?? "")}
              </span>
              {notice.expiresAt && (
                <span className="text-xs text-white/30">
                  · Expires {formatDate(notice.expiresAt)}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display text-xl font-bold leading-snug text-white sm:text-2xl">
              {notice.title}
            </h2>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body - scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {notice.description ? (
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed text-white/80">
                  {notice.description}
                </p>
              </div>
            ) : (
              <p className="italic text-white/40">No additional details provided.</p>
            )}
          </div>

          {/* Modal Footer - PDF / attachments */}
          {notice.pdfUrl && (
            <div className="flex-shrink-0 border-t border-white/8 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
                Attached Document
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={notice.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-brand-crimson px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-crimson/80"
                >
                  <ExternalLink size={14} />
                  Open in Browser
                </a>
                <a
                  href={notice.pdfUrl}
                  download
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <Download size={14} />
                  Download PDF
                </a>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-white/30">
                  <FileText size={12} />
                  PDF Document
                </span>
              </div>

              {/* Inline PDF preview (desktop) */}
              <div className="mt-4 hidden sm:block">
                <iframe
                  src={`${notice.pdfUrl}#toolbar=0&navpanes=0`}
                  className="h-72 w-full rounded-xl border border-white/10"
                  title={notice.title}
                />
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Notice Card ───────────────────────────────────────────────
function NoticeCard({ notice, index, onClick }: {
  notice: Notice;
  index: number;
  onClick: () => void;
}) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });

  return (
    <motion.button
      key={notice.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={cn(
        "group w-full cursor-pointer text-left rounded-2xl border p-5 transition-all",
        "hover:border-brand-crimson/50 hover:shadow-lg hover:shadow-brand-crimson/5 hover:-translate-y-0.5",
        notice.important
          ? "border-brand-gold/30 bg-brand-gold/5 hover:bg-brand-gold/8"
          : "border-white/8 bg-white/3 hover:bg-white/5"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          notice.important
            ? "bg-brand-gold/20 group-hover:bg-brand-gold/30"
            : "bg-brand-crimson/10 group-hover:bg-brand-crimson/20"
        )}>
          {notice.important
            ? <AlertCircle size={18} className="text-brand-gold" />
            : <Bell size={18} className="text-brand-crimson" />}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Meta row */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
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
              {formatDate(notice.publishedAt ?? notice.createdAt ?? "")}
            </span>
            {notice.pdfUrl && (
              <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                <FileText size={9} />
                PDF attached
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-bold text-white transition-colors group-hover:text-brand-crimson">
            {notice.title}
          </h3>

          {/* Description preview */}
          {notice.description && (
            <p className="mt-1 line-clamp-2 text-sm text-brand-slate">
              {notice.description}
            </p>
          )}

          {/* Read more hint */}
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-crimson/70 group-hover:text-brand-crimson transition-colors">
            Read full notice
            <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Chevron on desktop */}
        <div className="hidden shrink-0 items-center sm:flex">
          <ChevronRight size={18} className="text-white/20 transition-all group-hover:text-brand-crimson group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function NoticesPage() {
  const [notices,       setNotices]       = useState<Notice[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [category,      setCategory]      = useState("ALL");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    getPublishedNotices(0, 100).then(data => {
      setNotices(data);
      setLoading(false);
    });
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedNotice(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = notices.filter(n => {
    const matchCat = category === "ALL" || n.category === category;
    const matchQ   = !search || n.title.toLowerCase().includes(search.toLowerCase())
                              || (n.description ?? "").toLowerCase().includes(search.toLowerCase());
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
              <NoticeCard
                key={notice.id}
                notice={notice}
                index={i}
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-brand-slate">
          Showing {filtered.length} of {notices.length} notices · Click any notice to read in full
        </p>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <NoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </main>
  );
}
