"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Plus, Search, Pencil, Trash2, Eye, EyeOff,
  FileText, X, Save, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Category = "ACADEMIC" | "EXAM" | "HOLIDAY" | "ADMISSION" | "GENERAL" | "URGENT";
type Notice = {
  id: string; title: string; category: Category;
  isImportant: boolean; published: boolean;
  publishedAt: string; description?: string; pdfUrl?: string;
};

const MOCK_NOTICES: Notice[] = [
  { id: "1", title: "Annual Sports Day 2025",           category: "GENERAL",  isImportant: true,  published: true,  publishedAt: "2025-05-10" },
  { id: "2", title: "Board Exam Timetable",             category: "EXAM",     isImportant: true,  published: true,  publishedAt: "2025-05-08" },
  { id: "3", title: "Summer Holiday Announcement",      category: "HOLIDAY",  isImportant: false, published: false, publishedAt: "2025-05-06" },
  { id: "4", title: "Parent Teacher Meeting",           category: "ACADEMIC", isImportant: false, published: true,  publishedAt: "2025-05-04" },
  { id: "5", title: "Admissions Open 2025-26",          category: "ADMISSION",isImportant: true,  published: true,  publishedAt: "2025-05-01" },
  { id: "6", title: "Science Exhibition Results",       category: "ACADEMIC", isImportant: false, published: true,  publishedAt: "2025-04-28" },
];

const categoryColors: Record<string, string> = {
  ACADEMIC:  "bg-blue-500/15 text-blue-300 border-blue-500/30",
  EXAM:      "bg-rose-500/15 text-rose-300 border-rose-500/30",
  HOLIDAY:   "bg-green-500/15 text-green-300 border-green-500/30",
  ADMISSION: "bg-brand-gold/15 text-brand-gold border-brand-gold/30",
  GENERAL:   "bg-violet-500/15 text-violet-300 border-violet-500/30",
  URGENT:    "bg-red-500/20 text-red-300 border-red-500/40",
};

const categories: Category[] = ["ACADEMIC", "EXAM", "HOLIDAY", "ADMISSION", "GENERAL", "URGENT"];

function NoticeModal({
  notice, onClose, onSave,
}: {
  notice?: Notice | null;
  onClose: () => void;
  onSave: (data: Partial<Notice>) => void;
}) {
  const [title, setTitle]         = useState(notice?.title ?? "");
  const [category, setCategory]   = useState<Category>(notice?.category ?? "GENERAL");
  const [important, setImportant] = useState(notice?.isImportant ?? false);
  const [description, setDesc]    = useState(notice?.description ?? "");
  const [saving, setSaving]       = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave({ title, category, isImportant: important, description });
    setSaving(false);
    toast.success(notice ? "Notice updated!" : "Notice created!");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">
            {notice ? "Edit Notice" : "Create Notice"}
          </h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notice title..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50 focus:ring-2 focus:ring-brand-crimson/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-3 text-sm text-white outline-none focus:border-brand-crimson/50"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setImportant(!important)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    important ? "bg-brand-crimson" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
                    important ? "translate-x-6" : "translate-x-1"
                  )} />
                </div>
                <span className="text-sm text-white/80">Important</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Optional description..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:border-white/20 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex-1 justify-center py-2.5 text-sm"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Notice"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminNoticesPage() {
  const [notices, setNotices]       = useState<Notice[]>(MOCK_NOTICES);
  const [search, setSearch]         = useState("");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editNotice, setEditNotice] = useState<Notice | null>(null);

  const filtered = notices.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Partial<Notice>) => {
    if (editNotice) {
      setNotices((prev) => prev.map((n) => n.id === editNotice.id ? { ...n, ...data } : n));
    } else {
      const newNotice: Notice = {
        id: Date.now().toString(), published: false,
        publishedAt: new Date().toISOString().split("T")[0],
        ...data, title: data.title!, category: data.category!,
        isImportant: data.isImportant ?? false,
      };
      setNotices((prev) => [newNotice, ...prev]);
    }
  };

  const togglePublish = (id: string) => {
    setNotices((prev) => prev.map((n) => n.id === id ? { ...n, published: !n.published } : n));
    toast.success("Status updated");
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notice deleted");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Notices</h1>
          <p className="mt-1 text-sm text-brand-slate">{notices.length} total notices</p>
        </div>
        <button
          onClick={() => { setEditNotice(null); setModalOpen(true); }}
          className="btn-primary py-2.5 text-sm"
        >
          <Plus size={16} /> New Notice
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notices..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">Title</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate sm:table-cell">Category</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate md:table-cell">Date</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">Status</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-brand-slate">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((notice, i) => (
              <motion.tr
                key={notice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/5 transition-colors hover:bg-white/3"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="shrink-0 text-brand-gold" />
                    <span className="font-medium text-white line-clamp-1">{notice.title}</span>
                    {notice.isImportant && (
                      <span className="hidden shrink-0 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2 py-0.5 text-[10px] font-bold text-brand-gold sm:inline">
                        Important
                      </span>
                    )}
                  </div>
                </td>
                <td className="hidden px-5 py-4 sm:table-cell">
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase", categoryColors[notice.category])}>
                    {notice.category}
                  </span>
                </td>
                <td className="hidden px-5 py-4 text-brand-slate md:table-cell">{notice.publishedAt}</td>
                <td className="px-5 py-4">
                  <span className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                    notice.published
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/15 text-amber-400"
                  )}>
                    {notice.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => togglePublish(notice.id)}
                      title={notice.published ? "Unpublish" : "Publish"}
                      className="rounded-lg p-1.5 text-brand-slate transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {notice.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => { setEditNotice(notice); setModalOpen(true); }}
                      className="rounded-lg p-1.5 text-brand-slate transition-colors hover:bg-white/5 hover:text-brand-gold"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="rounded-lg p-1.5 text-brand-slate transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-brand-slate">No notices found.</div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <NoticeModal
            notice={editNotice}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
