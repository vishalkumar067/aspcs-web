"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Category = "EVENTS" | "SPORTS" | "ACADEMICS" | "CULTURAL" | "INFRASTRUCTURE";
type Album = {
  id: string; title: string; category: Category;
  imageCount: number; published: boolean; date: string;
  gradient: string;
};

const MOCK_ALBUMS: Album[] = [
  { id: "1", title: "Annual Sports Day 2024",      category: "SPORTS",         imageCount: 42, published: true,  date: "March 2024",    gradient: "from-sky-900 to-sky-700" },
  { id: "2", title: "Science Exhibition 2024",      category: "ACADEMICS",      imageCount: 28, published: true,  date: "February 2024", gradient: "from-violet-900 to-violet-700" },
  { id: "3", title: "Cultural Fest 2024",           category: "CULTURAL",       imageCount: 65, published: true,  date: "January 2024",  gradient: "from-rose-900 to-rose-700" },
  { id: "4", title: "Graduation Ceremony 2024",     category: "EVENTS",         imageCount: 34, published: false, date: "April 2024",    gradient: "from-amber-900 to-amber-700" },
  { id: "5", title: "New School Building",          category: "INFRASTRUCTURE", imageCount: 18, published: true,  date: "2024",          gradient: "from-emerald-900 to-emerald-700" },
  { id: "6", title: "Inter-School Cricket",         category: "SPORTS",         imageCount: 31, published: false, date: "March 2024",    gradient: "from-cyan-900 to-cyan-700" },
];

const categories: Category[] = ["EVENTS", "SPORTS", "ACADEMICS", "CULTURAL", "INFRASTRUCTURE"];

function AlbumModal({ album, onClose, onSave }: {
  album?: Album | null;
  onClose: () => void;
  onSave: (data: Partial<Album>) => void;
}) {
  const [title, setTitle]       = useState(album?.title ?? "");
  const [category, setCategory] = useState<Category>(album?.category ?? "EVENTS");
  const [date, setDate]         = useState(album?.date ?? "");
  const [saving, setSaving]     = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave({ title, category, date });
    setSaving(false);
    toast.success(album ? "Album updated!" : "Album created!");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">
            {album ? "Edit Album" : "Create Album"}
          </h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Album Title *</label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sports Day 2025"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50 focus:ring-2 focus:ring-brand-crimson/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Category</label>
              <select
                value={category} onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-3 text-sm text-white outline-none focus:border-brand-crimson/50"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Event Date</label>
              <input
                value={date} onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. March 2025"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Album"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminGalleryPage() {
  const [albums, setAlbums]         = useState<Album[]>(MOCK_ALBUMS);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editAlbum, setEditAlbum]   = useState<Album | null>(null);

  const handleSave = (data: Partial<Album>) => {
    if (editAlbum) {
      setAlbums((prev) => prev.map((a) => a.id === editAlbum.id ? { ...a, ...data } : a));
    } else {
      const newAlbum: Album = {
        id: Date.now().toString(), imageCount: 0, published: false,
        gradient: "from-brand-maroon to-brand-crimson",
        title: data.title!, category: data.category!,
        date: data.date ?? new Date().getFullYear().toString(),
      };
      setAlbums((prev) => [newAlbum, ...prev]);
    }
  };

  const togglePublish = (id: string) => {
    setAlbums((prev) => prev.map((a) => a.id === id ? { ...a, published: !a.published } : a));
    toast.success("Album status updated");
  };

  const deleteAlbum = (id: string) => {
    setAlbums((prev) => prev.filter((a) => a.id !== id));
    toast.success("Album deleted");
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Gallery</h1>
          <p className="mt-1 text-sm text-brand-slate">{albums.length} albums total</p>
        </div>
        <button onClick={() => { setEditAlbum(null); setModalOpen(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> New Album
        </button>
      </div>

      {/* Albums grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album, i) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="overflow-hidden rounded-2xl border border-white/8 bg-white/3"
          >
            {/* Cover */}
            <div className={`relative h-36 bg-gradient-to-br ${album.gradient}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Images size={28} className="text-white/20" />
              </div>
              <div className="absolute right-2 top-2 flex gap-1.5">
                <span className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm",
                  album.published
                    ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                    : "border-amber-500/40 bg-amber-500/20 text-amber-300"
                )}>
                  {album.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="absolute bottom-2 left-3">
                <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {album.category}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-white line-clamp-1">{album.title}</h3>
              <p className="mt-0.5 text-xs text-brand-slate">{album.date} · {album.imageCount} photos</p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => togglePublish(album.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs font-medium text-brand-slate hover:border-white/20 hover:text-white"
                >
                  {album.published ? <EyeOff size={13} /> : <Eye size={13} />}
                  {album.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => { setEditAlbum(album); setModalOpen(true); }}
                  className="rounded-xl border border-white/10 p-2 text-brand-slate hover:border-brand-gold/30 hover:text-brand-gold"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteAlbum(album.id)}
                  className="rounded-xl border border-white/10 p-2 text-brand-slate hover:border-red-500/30 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <AlbumModal
            album={editAlbum}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
