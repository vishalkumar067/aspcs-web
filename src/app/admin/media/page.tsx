"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Trash2, X, Image as ImageIcon,
  Loader2, CheckCircle2, FolderOpen, Plus
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const FOLDERS = [
  { value: "gallery",        label: "Gallery" },
  { value: "about",          label: "About / School" },
  { value: "events",         label: "Events" },
  { value: "general",        label: "General" },
];

interface UploadedImage {
  publicId:     string;
  url:          string;
  thumbnailUrl: string;
  width:        number;
  height:       number;
  bytes:        number;
  folder:       string;
  uploadedAt:   string;
}

export default function AdminMediaPage() {
  const [images, setImages]           = useState<UploadedImage[]>([]);
  const [uploading, setUploading]     = useState(false);
  const [dragOver, setDragOver]       = useState(false);
  const [selectedFolder, setFolder]   = useState("gallery");
  const [preview, setPreview]         = useState<UploadedImage | null>(null);
  const [progress, setProgress]       = useState(0);
  const fileInputRef                  = useRef<HTMLInputElement>(null);
  const token                         = useAuthStore((s) => s.accessToken);

  // ─── Upload files ──────────────────────────────────────────────────────
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    setProgress(0);

    const uploaded: UploadedImage[] = [];
    let done = 0;

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", selectedFolder);

      try {
        const res = await fetch(`${API}/upload/image`, {
          method:  "POST",
          headers: { Authorization: `Bearer ${token}` },
          body:    formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Upload failed");

        uploaded.push({
          ...json.data,
          folder:     selectedFolder,
          uploadedAt: new Date().toISOString(),
        });
        done++;
        setProgress(Math.round((done / fileArray.length) * 100));
      } catch (err) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setImages((prev) => [...uploaded, ...prev]);
    if (uploaded.length > 0) {
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded!`);
    }
    setUploading(false);
    setProgress(0);
  }, [selectedFolder, token]);

  // ─── Delete image ──────────────────────────────────────────────────────
  const deleteImage = async (img: UploadedImage) => {
    try {
      const res = await fetch(
        `${API}/upload/image?publicId=${encodeURIComponent(img.publicId)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((i) => i.publicId !== img.publicId));
      if (preview?.publicId === img.publicId) setPreview(null);
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // ─── Drag & Drop ──────────────────────────────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  // ─── Copy URL ─────────────────────────────────────────────────────────
  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Media Manager</h1>
          <p className="mt-1 text-sm text-brand-slate">
            Upload and manage images for gallery, about page, and events
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary py-2.5 text-sm"
        >
          <Plus size={16} /> Upload Images
        </button>
      </div>

      {/* Folder selector */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-xs text-brand-slate">
          <FolderOpen size={13} /> Upload to:
        </span>
        {FOLDERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFolder(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
              selectedFolder === f.value
                ? "border-brand-gold bg-brand-gold text-brand-black"
                : "border-white/10 bg-white/5 text-brand-slate hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300",
          dragOver
            ? "border-brand-gold bg-brand-gold/10 scale-[1.01]"
            : "border-white/15 bg-white/3 hover:border-brand-gold/40 hover:bg-white/5"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={36} className="animate-spin text-brand-gold" />
            <p className="text-sm font-medium text-white">Uploading... {progress}%</p>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brand-gold transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold/10">
              <Upload size={24} className="text-brand-gold" />
            </div>
            <p className="text-base font-semibold text-white">
              Drop images here or click to browse
            </p>
            <p className="mt-2 text-sm text-brand-slate">
              Supports JPEG, PNG, WebP — max 10MB per file
            </p>
            <p className="mt-1 text-xs text-brand-slate/60">
              Multiple files supported
            </p>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Uploaded Images ({images.length})
            </h2>
            <p className="text-xs text-brand-slate">
              Click image to preview & copy URL
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <AnimatePresence>
              {images.map((img, i) => (
                <motion.div
                  key={img.publicId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-white/8 bg-white/5 cursor-pointer"
                  onClick={() => setPreview(img)}
                >
                  <Image
                    src={img.thumbnailUrl || img.url}
                    alt="Uploaded"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/40" />

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteImage(img); }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                  >
                    <Trash2 size={13} />
                  </button>

                  {/* Folder badge */}
                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                    {img.folder}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="py-16 text-center">
          <ImageIcon size={36} className="mx-auto mb-3 text-white/10" />
          <p className="text-brand-slate">No images uploaded yet</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-brand-black shadow-glass"
            >
              {/* Image */}
              <div className="relative aspect-video bg-black">
                <Image
                  src={preview.url}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => setPreview(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-brand-slate">Dimensions</p>
                    <p className="text-sm font-semibold text-white">{preview.width} × {preview.height}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-brand-slate">Size</p>
                    <p className="text-sm font-semibold text-white">{formatBytes(preview.bytes)}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-brand-slate">Folder</p>
                    <p className="text-sm font-semibold text-white capitalize">{preview.folder}</p>
                  </div>
                </div>

                {/* URL */}
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-xs text-brand-slate">Image URL</p>
                  <p className="truncate text-xs text-white/70">{preview.url}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => copyUrl(preview.url)}
                    className="btn-gold flex-1 justify-center py-2.5 text-sm"
                  >
                    <CheckCircle2 size={15} /> Copy URL
                  </button>
                  <button
                    onClick={() => deleteImage(preview)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
