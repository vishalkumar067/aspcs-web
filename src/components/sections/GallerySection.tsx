"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Images, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPublicAlbums, type GalleryAlbum } from "@/lib/publicApi";

const SPAN_PATTERN = ["row-span-2","","","col-span-2","","row-span-2",""];

export default function GallerySection() {
  const [albums,  setAlbums]  = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicAlbums(0, 7).then(data => { setAlbums(data); setLoading(false); });
  }, []);

  return (
    <section className="section-pad relative overflow-hidden bg-brand-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,76,0.07),transparent)]" />

      <div className="container-aspcs relative z-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="section-eyebrow mb-4 inline-flex"
            >
              <Images size={11} /> Campus Gallery
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-display-xs font-black text-white"
            >
              Life at <span className="text-brand-gold">ASPCS</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-2 max-w-lg text-sm font-medium text-brand-slate"
            >
              Glimpses of the vibrant moments, achievements, and everyday
              joy that define the ASPCS experience.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/gallery" className="btn-outline hidden sm:inline-flex">
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-brand-slate">
            <Loader2 size={20} className="animate-spin text-brand-crimson" />
            <span className="text-sm font-medium">Loading gallery...</span>
          </div>
        ) : albums.length === 0 ? (
          <div className="rounded-3xl border border-white/8 bg-white/3 py-16 text-center text-brand-slate">
            <Images size={32} className="mx-auto mb-3 text-brand-crimson/30" />
            <p className="text-sm font-medium">Gallery coming soon.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
            style={{ gridAutoRows: "180px" }}
          >
            {albums.slice(0, 7).map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl cursor-pointer",
                  SPAN_PATTERN[i] ?? ""
                )}
              >
                {album.coverImageUrl ? (
                  <img
                    src={album.coverImageUrl}
                    alt={album.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-maroon/40 to-brand-black">
                    <Images size={32} className="text-brand-crimson/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/50" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-sm font-bold text-white drop-shadow">{album.title}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold/90">{album.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 sm:hidden">
          <Link href="/gallery" className="btn-outline w-full justify-center">
            View Full Gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
