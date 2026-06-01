"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tiles = [
  { id: 1, label: "Sports Day 2024", span: "row-span-2", image: "/images/gallery/image_1.jpg" },
  { id: 2, label: "Science Fair", span: "", image: "/images/gallery/image_2.jpg" },
  { id: 3, label: "Cultural Fest", span: "", image: "/images/gallery/image_3.jpg" },
  { id: 4, label: "Graduation Ceremony", span: "col-span-2", image: "/images/gallery/image_4.jpg" },
  { id: 5, label: "Art Exhibition", span: "", image: "/images/gallery/image_5.jpg" },
  { id: 6, label: "Campus Infrastructure", span: "row-span-2", image: "/images/gallery/image_6.jpg" },
  { id: 7, label: "Annual Day 2024", span: "", image: "/images/gallery/image_7.jpg" },
];

export default function GallerySection() {
  return (
    <section className="section-pad relative overflow-hidden bg-brand-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,76,0.07),transparent)]" />

      <div className="container-aspcs relative z-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-eyebrow mb-4 inline-flex"
            >
              <ImageIcon size={11} />
              Campus Gallery
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-display-xs font-bold text-white"
            >
              Life at <span className="text-brand-gold">ASPCS</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-2 max-w-lg text-sm text-brand-slate"
            >
              A glimpse into the vibrant moments, achievements, and everyday
              joy that define the ASPCS experience.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/gallery" className="btn-outline hidden sm:inline-flex">
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div
          className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
          style={{ gridAutoRows: "180px" }}
        >
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl cursor-pointer",
                tile.span
              )}
            >
              <img
                src={tile.image}
                alt={tile.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/30 transition-all duration-300 group-hover:bg-black/50" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-semibold text-white">
                  {tile.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link href="/gallery" className="btn-outline w-full justify-center">
            View Full Gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
