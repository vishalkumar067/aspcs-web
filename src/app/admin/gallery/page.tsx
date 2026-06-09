"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images, Plus, Pencil, Trash2, Eye, EyeOff,
  X, Save, Loader2, Upload, ImagePlus, CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

type Category = "EVENTS" | "SPORTS" | "ACADEMICS" | "CULTURAL" | "INFRASTRUCTURE";

interface GalleryImage {
  id: string; url: string; thumbnailUrl: string; publicId: string;
}

interface Album {
  id: string; title: string; category: Category;
  imageCount: number; published: boolean; date: string;
  gradient: string; images: GalleryImage[];
}

const MOCK_ALBUMS: Album[] = [
  { id: "1", title: "Annual Sports Day 2024",   category: "SPORTS",         imageCount: 0, published: true,  date: "March 2024",    gradient: "from-sky-900 to-sky-700",         images: [] },
  { id: "2", title: "Science Exhibition 2024",  category: "ACADEMICS",      imageCount: 0, published: true,  date: "February 2024", gradient: "from-violet-900 to-violet-700",   images: [] },
  { id: "3", title: "Cultural Fest 2024",        category: "CULTURAL",       imageCount: 0, published: true,  date: "January 2024",  gradient: "from-rose-900 to-rose-700",       images: [] },
  { id: "4", title: "Graduation Ceremony 2024", category: "EVENTS",         imageCount: 0, published: false, date: "April 2024",    gradient: "from-amber-900 to-amber-700",     images: [] },
  { id: "5", title: "New School Building",       category: "INFRASTRUCTURE", imageCount: 0, published: true,  date: "2024",          gradient: "from-emerald-900 to-emerald-700", images: [] },
];

const categories: Category[] = ["EVENTS", "SPORTS", "ACADEMICS", "CULTURAL", "INFRASTRUCTURE"];

function UploadModal({ album, onClose, onUploaded }: {
  album: Album;
  onClose: () => void;
  onUploaded: (albumId: string, images: GalleryImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [uploaded, setUploaded]   = useState<GalleryImage[]>([]);
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const token                     = useAuthStore((s) => s.accessToken);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;
    setUploading(true);
    setProgress(0);
    const results: GalleryImage[] = [];
    let done = 0;

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");
      try {
        const res  = await fetch(`${API}/upload/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Upload failed");
        results.push({ id: json.data.publicId, url: json.data.url, thumbnailUrl: json.data.thumbnailUrl, publicId: json.data.publicId });
      } catch { toast.error(`Failed: ${file.name}`); }
      done++;
      setProgress(Math.round((done / fileArray.length) * 100));
    }

    setUploaded((prev) => [...prev, ...results]);
    setUploading(false);
    setProgress(0);
    if (results.length > 0) toast.success(`${results.length} image(s) uploaded!`);
  };

  const handleSave = () => {
    if (!uploaded.length) { toast.error("Upload at least one image"); return; }
    onUploaded(album.id, uploaded);
    toast.success(`${uploaded.length} images added to "${album.title}"`);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Add Images to Album</h3>
            <p className="text-xs text-brand-slate">{album.title}</p>
          </div>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "mb-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all",
            dragOver ? "border-brand-gold bg-brand-gold/10" : "border-white/15 bg-white/3 hover:border-brand-gold/40"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin text-brand-gold" />
              <p className="text-sm text-white">Uploading... {progress}%</p>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-brand-gold transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <Upload size={28} className="mb-3 text-brand-gold" />
              <p className="text-sm font-semibold text-white">Drop images here or click to browse</p>
              <p className="mt-1 text-xs text-brand-slate">JPEG, PNG, WebP — max 10MB — multiple files supported</p>
            </>
          )}
          <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
        </div>

        {uploaded.length > 0 && (
          <div className="mb-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
              {uploaded.length} image(s) ready to add
            </p>
            <div className="grid grid-cols-5 gap-2">
              {uploaded.map((img) => (
                <div key={img.publicId} className="group relative aspect-square overflow-hidden rounded-xl">
                  <Image src={img.thumbnailUrl || img.url} alt="" fill className="object-cover" />
                  <button onClick={() => setUploaded((p) => p.filter((i) => i.publicId !== img.publicId))}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={!uploaded.length || uploading} className="btn-primary flex-1 justify-center py-2.5 text-sm disabled:opacity-40">
            <CheckCircle2 size={15} /> Add {uploaded.length > 0 ? `${uploaded.length} ` : ""}to Album
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AlbumModal({ album, onClose, onSave }: { album?: Album | null; onClose: () => void; onSave: (data: Partial<Album>) => void; }) {
  const [title, setTitle]       = useState(album?.title ?? "");
  const [category, setCategory] = useState<Category>(album?.category ?? "EVENTS");
  const [date, setDate]         = useState(album?.date ?? "");
  const [saving, setSaving]     = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave({ title, category, date });
    setSaving(false);
    toast.success(album ? "Album updated!" : "Album created!");
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{album ? "Edit Album" : "Create Album"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Album Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Sports Day 2025"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-3 text-sm text-white outline-none">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Date</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. March 2025"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
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
  const [albums, setAlbums]           = useState<Album[]>(MOCK_ALBUMS);
  const [albumModal, setAlbumModal]   = useState(false);
  const [uploadModal, setUploadModal] = useState<Album | null>(null);
  const [editAlbum, setEditAlbum]     = useState<Album | null>(null);

  const handleSaveAlbum = (data: Partial<Album>) => {
    if (editAlbum) {
      setAlbums((prev) => prev.map((a) => a.id === editAlbum.id ? { ...a, ...data } : a));
    } else {
      setAlbums((prev) => [{ id: Date.now().toString(), imageCount: 0, published: false, images: [],
        gradient: "from-brand-maroon to-brand-crimson", title: data.title!, category: data.category!,
        date: data.date ?? new Date().getFullYear().toString() }, ...prev]);
    }
  };

  const handleUploaded = (albumId: string, images: GalleryImage[]) => {
    setAlbums((prev) => prev.map((a) =>
      a.id === albumId ? { ...a, images: [...a.images, ...images], imageCount: a.imageCount + images.length } : a
    ));
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
          <p className="mt-1 text-sm text-brand-slate">{albums.length} albums · {albums.reduce((s, a) => s + a.imageCount, 0)} total images</p>
        </div>
        <button onClick={() => { setEditAlbum(null); setAlbumModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> New Album
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album, i) => (
          <motion.div key={album.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
            className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
            <div className={`relative h-36 bg-gradient-to-br ${album.gradient}`}>
              {album.images.length > 0 ? (
                <Image src={album.images[0].thumbnailUrl || album.images[0].url} alt={album.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"><Images size={28} className="text-white/20" /></div>
              )}
              <div className="absolute right-2 top-2">
                <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm",
                  album.published ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300" : "border-amber-500/40 bg-amber-500/20 text-amber-300")}>
                  {album.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="absolute bottom-2 left-3">
                <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">{album.category}</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-white line-clamp-1">{album.title}</h3>
              <p className="mt-0.5 text-xs text-brand-slate">{album.date} · {album.imageCount} photos</p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setUploadModal(album)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-gold/30 bg-brand-gold/15 py-2 text-xs font-semibold text-brand-gold transition-all hover:bg-brand-gold hover:text-brand-black">
                  <ImagePlus size={13} /> Add Images
                </button>
                <button onClick={() => togglePublish(album.id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs font-medium text-brand-slate hover:text-white">
                  {album.published ? <EyeOff size={13} /> : <Eye size={13} />}
                  {album.published ? "Unpublish" : "Publish"}
                </button>
              </div>

              <div className="mt-2 flex gap-2">
                <button onClick={() => { setEditAlbum(album); setAlbumModal(true); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-brand-slate hover:border-brand-gold/30 hover:text-brand-gold">
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => deleteAlbum(album.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-brand-slate hover:border-red-500/30 hover:text-red-400">
                  <Trash2 size={13} /> Delete
                </button>
              </div>

              {album.images.length > 0 && (
                <div className="mt-3 flex gap-1.5">
                  {album.images.slice(0, 4).map((img) => (
                    <div key={img.id} className="relative h-10 w-10 overflow-hidden rounded-lg">
                      <Image src={img.thumbnailUrl || img.url} alt="" fill className="object-cover" />
                    </div>
                  ))}
                  {album.images.length > 4 && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[10px] font-bold text-white">+{album.images.length - 4}</div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {albumModal && <AlbumModal album={editAlbum} onClose={() => { setAlbumModal(false); setEditAlbum(null); }} onSave={handleSaveAlbum} />}
        {uploadModal && <UploadModal album={uploadModal} onClose={() => setUploadModal(null)} onUploaded={handleUploaded} />}
      </AnimatePresence>
    </div>
  );
}
