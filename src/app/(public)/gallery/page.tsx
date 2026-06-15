"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getPublicAlbums, getAlbumImages, type GalleryAlbum, type GalleryImage } from "@/lib/publicApi";

export default function GalleryPage() {
  const [albums,  setAlbums]  = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [images,  setImages]  = useState<GalleryImage[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    getPublicAlbums(0, 50).then(data => {
      setAlbums(data);
      setLoading(false);
    });
  }, []);

  const openAlbum = async (album: GalleryAlbum) => {
    setActiveAlbum(album);
    setImgLoading(true);
    const imgs = await getAlbumImages(album.id);
    setImages(imgs);
    setImgLoading(false);
  };

  const prev = () => setLightbox(l => (l !== null && l > 0 ? l - 1 : images.length - 1));
  const next = () => setLightbox(l => (l !== null ? (l + 1) % images.length : 0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  return (
    <main className="min-h-screen bg-brand-black">
      {/* Header */}
      <section className="border-b border-brand-crimson/20 bg-gradient-to-b from-brand-maroon/20 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-2">
            <Images size={14} className="text-brand-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Photo Gallery</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white md:text-5xl">Gallery</h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-slate">
            Cherished moments from school events, activities, and milestones.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={28} className="animate-spin text-brand-crimson" />
          </div>
        ) : activeAlbum ? (
          /* Album view */
          <div>
            <button onClick={() => { setActiveAlbum(null); setImages([]); }}
              className="mb-6 flex items-center gap-2 text-sm text-brand-slate hover:text-white transition-colors">
              <ChevronLeft size={16} /> Back to Albums
            </button>
            <h2 className="mb-2 font-display text-2xl font-bold text-white">{activeAlbum.title}</h2>
            {activeAlbum.description && <p className="mb-6 text-brand-slate">{activeAlbum.description}</p>}

            {imgLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-brand-crimson" />
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-3xl border border-white/8 py-20 text-center text-brand-slate">
                No images in this album yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img, i) => (
                  <motion.button key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setLightbox(i)}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-white/8">
                    <img src={img.url} alt={img.caption ?? "Gallery image"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    {img.caption && (
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-xs text-white">{img.caption}</p>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Album grid */
          albums.length === 0 ? (
            <div className="rounded-3xl border border-white/8 py-24 text-center text-brand-slate">
              No albums published yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <motion.button key={album.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openAlbum(album)}
                  className="group overflow-hidden rounded-3xl border border-white/8 bg-white/3 text-left transition-all hover:border-brand-crimson/30">

                  {album.coverImageUrl ? (
                    <img src={album.coverImageUrl} alt={album.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand-maroon/30 to-transparent">
                      <Images size={40} className="text-brand-crimson/40" />
                    </div>
                  )}

                  <div className="p-5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-crimson">
                      {album.category}
                    </span>
                    <h3 className="mt-1 font-display text-base font-bold text-white group-hover:text-brand-crimson transition-colors">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-brand-slate">{album.description}</p>
                    )}
                    {album.eventDate && (
                      <p className="mt-2 text-xs text-brand-slate">
                        {new Date(album.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightbox(null)}>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
              <ChevronLeft size={20} />
            </button>
            <img src={images[lightbox].url} alt=""
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain"
              onClick={e => e.stopPropagation()} />
            <button onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
              <ChevronRight size={20} />
            </button>
            <button onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <X size={18} />
            </button>
            <p className="absolute bottom-6 text-sm text-white/50">
              {lightbox + 1} / {images.length}
              {images[lightbox].caption && ` — ${images[lightbox].caption}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
