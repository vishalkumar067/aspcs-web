"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getPublicAlbums, getAlbumImages, type GalleryAlbum, type GalleryImage } from "@/lib/publicApi";
import { HoverImage } from "@/components/ui/HoverImage";

export default function GalleryPage() {
  const [albums,     setAlbums]     = useState<GalleryAlbum[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [images,     setImages]     = useState<GalleryImage[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [lightbox,   setLightbox]   = useState<number | null>(null);

  useEffect(() => {
    getPublicAlbums(0, 50).then(data => { setAlbums(data); setLoading(false); });
  }, []);

  const openAlbum = async (album: GalleryAlbum) => {
    setActiveAlbum(album);
    setImgLoading(true);
    const imgs = await getAlbumImages(album.id);
    setImages(imgs);
    setImgLoading(false);
  };

  const prev = () => setLightbox(l => l !== null ? (l > 0 ? l - 1 : images.length - 1) : null);
  const next = () => setLightbox(l => l !== null ? (l + 1) % images.length : null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, images.length]);

  return (
    <main className="min-h-screen bg-brand-black">
      {/* Header */}
      <section className="border-b border-brand-crimson/20 bg-gradient-to-b from-brand-maroon/20 to-transparent py-16 pt-32">
        <div className="container-aspcs text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-2">
            <Images size={14} className="text-brand-gold" />
            <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Photo Gallery</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white md:text-5xl">Gallery</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-white/70">
            Hover over any album to explore — click to dive in.
          </p>
        </div>
      </section>

      <div className="container-aspcs py-12">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-32">
            <Loader2 size={24} className="animate-spin text-brand-crimson" />
          </div>
        ) : activeAlbum ? (
          /* ── Album image view ────────────────────────────────────── */
          <div>
            <button onClick={() => { setActiveAlbum(null); setImages([]); }}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-brand-slate transition-colors hover:text-white">
              <ChevronLeft size={16} /> Back to Albums
            </button>
            <h2 className="mb-6 font-display text-2xl font-black text-white">{activeAlbum.title}</h2>

            {imgLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={24} className="animate-spin text-brand-crimson" />
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-2xl border border-white/8 py-20 text-center text-white/40">No images in this album.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((img, i) => (
                  <motion.div key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}>
                    <HoverImage
                      src={img.url}
                      alt={img.caption ?? "Gallery image"}
                      title={img.caption}
                      variant="zoom-reveal"
                      aspectRatio="aspect-square"
                      onClick={() => setLightbox(i)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Album grid ──────────────────────────────────────────── */
          albums.length === 0 ? (
            <div className="rounded-2xl border border-white/8 py-24 text-center text-white/40">No albums published yet.</div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, i) => (
                <motion.div key={album.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <HoverImage
                    src={album.coverImageUrl ?? "/images/placeholder.jpg"}
                    alt={album.title}
                    title={album.title}
                    subtitle={album.category}
                    badge="View Album"
                    variant="spotlight"
                    aspectRatio="aspect-[4/3]"
                    onClick={() => openAlbum(album)}
                  />
                </motion.div>
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
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-brand-crimson/60">
              <ChevronLeft size={22} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[lightbox].url}
              alt=""
              className="max-h-[88vh] max-w-[88vw] rounded-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-brand-crimson/60">
              <ChevronRight size={22} />
            </button>
            <button onClick={() => setLightbox(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-brand-crimson/60">
              <X size={18} />
            </button>
            <p className="absolute bottom-5 text-sm text-white/40">
              {lightbox + 1} / {images.length}
              {images[lightbox].caption && ` — ${images[lightbox].caption}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
