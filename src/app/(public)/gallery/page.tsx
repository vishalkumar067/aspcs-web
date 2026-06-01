"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["ALL", "EVENTS", "SPORTS", "ACADEMICS", "CULTURAL", "INFRASTRUCTURE"];

const albums = [
  {
    id: "1",
    title: "Annual Sports Day",
    category: "SPORTS",
    imageCount: 42,
    date: "March 2024",
    gradient: "from-sky-900 to-sky-700",
    images: ["/images/gallery/image_1.jpg","/images/gallery/image_2.jpg","/images/gallery/image_3.jpg"],
  },
  {
    id: "2",
    title: "Science Exhibition 2024",
    category: "ACADEMICS",
    imageCount: 28,
    date: "February 2024",
    gradient: "from-violet-900 to-violet-700",
    images: ["/images/gallery/image_4.jpg","/images/gallery/image_5.jpg","/images/gallery/image_6.jpg"],
  },
  {
    id: "3",
    title: "Cultural Fest 2024",
    category: "CULTURAL",
    imageCount: 65,
    date: "January 2024",
    gradient: "from-rose-900 to-rose-700",
    images: ["/images/gallery/image_7.jpg","/images/gallery/image_8.jpg","/images/gallery/image_9.jpg"],
  },
  {
    id: "4",
    title: "Graduation Ceremony 2024",
    category: "EVENTS",
    imageCount: 34,
    date: "April 2024",
    gradient: "from-amber-900 to-amber-700",
    images: ["/images/gallery/image_10.jpg","/images/gallery/image_11.jpg","/images/gallery/image_12.jpg"],
  },
  {
    id: "5",
    title: "New School Building",
    category: "INFRASTRUCTURE",
    imageCount: 18,
    date: "2024",
    gradient: "from-emerald-900 to-emerald-700",
    images: ["/images/gallery/image_13.jpg","/images/gallery/image_14.jpg","/images/gallery/image_15.jpg"],
  },
  {
    id: "6",
    title: "Inter-School Cricket Tournament",
    category: "SPORTS",
    imageCount: 31,
    date: "March 2024",
    gradient: "from-cyan-900 to-cyan-700",
    images: ["/images/gallery/image_2.jpg","/images/gallery/image_8.jpg","/images/gallery/image_14.jpg"],
  },
  {
    id: "7",
    title: "Annual Prize Distribution",
    category: "EVENTS",
    imageCount: 22,
    date: "April 2024",
    gradient: "from-pink-900 to-pink-700",
    images: ["/images/gallery/image_5.jpg","/images/gallery/image_9.jpg","/images/gallery/image_15.jpg"],
  },
  {
    id: "8",
    title: "Art & Craft Exhibition",
    category: "ACADEMICS",
    imageCount: 45,
    date: "February 2024",
    gradient: "from-orange-900 to-orange-700",
    images: ["/images/gallery/image_3.jpg","/images/gallery/image_10.jpg","/images/gallery/image_13.jpg"],
  },
  {
    id: "9",
    title: "Independence Day Celebration",
    category: "CULTURAL",
    imageCount: 27,
    date: "August 2024",
    gradient: "from-indigo-900 to-indigo-700",
    images: ["/images/gallery/image_6.jpg","/images/gallery/image_11.jpg","/images/gallery/image_12.jpg"],
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [lightboxAlbum, setLightboxAlbum]   = useState<typeof albums[0] | null>(null);
  const [lightboxIndex, setLightboxIndex]   = useState(0);

  const filtered = albums.filter(
    (a) => activeCategory === "ALL" || a.category === activeCategory
  );

  const openLightbox = (album: typeof albums[0]) => {
    if (album.images.length > 0) {
      setLightboxAlbum(album);
      setLightboxIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(201,168,76,0.12),transparent)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container-aspcs relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-eyebrow mb-5 inline-flex"><Images size={11} />Photo Gallery</span>
            <h1 className="font-display text-display-md font-bold text-white">
              Life at <span className="text-brand-gold">ASPCS</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-brand-slate">
              Explore memories from sports days, cultural fests, academics, and everyday
              moments that make ASPCS truly special.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Albums ───────────────────────────────────────────────── */}
      <section className="section-pad pt-0">
        <div className="container-aspcs">

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  activeCategory === cat
                    ? "border-brand-gold bg-brand-gold text-brand-navy shadow-gold"
                    : "border-white/10 bg-white/5 text-brand-slate hover:border-brand-gold/40 hover:text-brand-gold"
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Albums grid */}
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((album, i) => (
                <motion.div
                  key={album.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => openLightbox(album)}
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl"
                >
                  {/* Background gradient placeholder */}
                <img
  src={album.images[0]}
  alt={album.title}
  className="absolute inset-0 h-full w-full object-cover"
/>

                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />

                  {/* Zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                      <ZoomIn size={22} className="text-white" />
                    </div>
                  </div>

                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                    <p className="font-display text-base font-bold text-white">{album.title}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-white/60">{album.date}</span>
                      <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs text-white/80">
                        {album.imageCount} photos
                      </span>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      {album.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-brand-slate">No albums in this category.</div>
          )}
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxAlbum && lightboxAlbum.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxAlbum(null)}
          >
            <button
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
              onClick={() => setLightboxAlbum(null)}
            >
              <X size={18} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => Math.max(0, i - 1)); }}
            >
              <ChevronLeft size={18} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            <img
  src={lightboxAlbum.images[lightboxIndex]}
  alt={lightboxAlbum.title}
  className="h-[60vh] w-full object-cover"
/>
              <div className="bg-black/80 p-4 text-center text-sm text-white/70">
                {lightboxAlbum.title} — {lightboxIndex + 1} / {lightboxAlbum.images.length}
              </div>
            </motion.div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => Math.min(lightboxAlbum.images.length - 1, i + 1)); }}
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
