"use client";

import { useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────────
   HoverImage — 3 visual variants:

   variant="spotlight"  (default)
     A circular light follows the cursor inside the image like a flashlight.
     Great for: gallery, campus photos.

   variant="curtain"
     On hover, a crimson curtain wipes across revealing a tinted view + details.
     Great for: event cards, notice banners.

   variant="zoom-reveal"
     Image zooms in, corners darken, overlay rises from bottom with details.
     Great for: faculty photos, about section images.
────────────────────────────────────────────────────────────────────────────── */

type Variant = "spotlight" | "curtain" | "zoom-reveal";

interface HoverImageProps {
  src:       string;
  alt:       string;
  title?:    string;
  subtitle?: string;
  badge?:    string;
  className?: string;
  aspectRatio?: string;     // e.g. "aspect-square" "aspect-video" "aspect-[4/3]"
  variant?:  Variant;
  children?: ReactNode;
  onClick?:  () => void;
  fill?: boolean;
}

export function HoverImage({
  src, alt, title, subtitle, badge,
  className   = "",
  aspectRatio = "aspect-[4/3]",
  variant     = "spotlight",
  children,
  onClick,
  fill = false,
}: HoverImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos,     setPos]     = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el   = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPos({ x: 50, y: 50 }); }}
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl ${
        fill ? "h-full w-full" : aspectRatio
      } ${className}`}
    >
      {/* ── Base image ── */}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-transform duration-500 ease-out ${
          variant === "curtain" ? "" : "group-hover:scale-[1.06]"
        }`}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SPOTLIGHT variant — flashlight that follows cursor
      ═══════════════════════════════════════════════════════════════ */}
      {variant === "spotlight" && (
        <>
          {/* Base dark vignette */}
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/60" />

          {/* Spotlight circle */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 130px at ${pos.x}% ${pos.y}%, 
                rgba(255,255,255,0.12) 0%, 
                transparent 70%)`,
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* Soft glow ring at cursor */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 60px at ${pos.x}% ${pos.y}%, 
                rgba(212,168,67,0.2) 0%, 
                transparent 100%)`,
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* Details */}
          {(title || subtitle || badge) && (
            <motion.div
              animate={{ y: hovered ? 0 : 16, opacity: hovered ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute inset-x-0 bottom-0 p-4"
            >
              {badge && (
                <span className="mb-1.5 inline-block rounded-full bg-brand-crimson/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {badge}
                </span>
              )}
              {title    && <p className="font-display text-sm font-black text-white drop-shadow">{title}</p>}
              {subtitle && <p className="text-xs font-medium text-white/70">{subtitle}</p>}
            </motion.div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          CURTAIN variant — crimson wipe reveals tinted view + text
      ═══════════════════════════════════════════════════════════════ */}
      {variant === "curtain" && (
        <>
          {/* Crimson tint overlay that wipes in */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 origin-left bg-brand-crimson/70 mix-blend-multiply"
          />

          {/* Dark overlay on top */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/30"
          />

          {/* Content */}
          {(title || subtitle || badge) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              {badge && (
                <motion.span
                  animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
                  transition={{ delay: 0.15 }}
                  className="mb-2 rounded-full border border-brand-gold/50 bg-brand-gold/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-brand-gold"
                >
                  {badge}
                </motion.span>
              )}
              <motion.p
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
                transition={{ delay: 0.2 }}
                className="font-display text-base font-black text-white"
              >
                {title}
              </motion.p>
              <motion.p
                animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
                transition={{ delay: 0.25 }}
                className="mt-1 text-xs font-medium text-white/80"
              >
                {subtitle}
              </motion.p>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ZOOM-REVEAL variant — zoom + bottom overlay
      ═══════════════════════════════════════════════════════════════ */}
      {variant === "zoom-reveal" && (
        <>
          {/* Gradient overlay that darkens on hover */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: hovered
                ? "linear-gradient(to top, rgba(13,6,8,0.92) 0%, rgba(13,6,8,0.5) 50%, rgba(13,6,8,0.15) 100%)"
                : "linear-gradient(to top, rgba(13,6,8,0.6) 0%, transparent 50%)",
            }}
          />

          {/* Corner darkening */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(13,6,8,0.5) 100%)",
            }}
          />

          {/* Details panel */}
          {(title || subtitle || badge) && (
            <div className="absolute inset-x-0 bottom-0 p-4">
              {badge && (
                <motion.span
                  animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -12 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className="mb-1.5 inline-block rounded-full bg-brand-gold/25 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-gold"
                >
                  {badge}
                </motion.span>
              )}
              <motion.p
                animate={{ opacity: hovered ? 1 : 0.85, y: hovered ? 0 : 8 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="font-display text-sm font-black text-white"
              >
                {title}
              </motion.p>
              <motion.p
                animate={{ opacity: hovered ? 0.75 : 0, y: hovered ? 0 : 8 }}
                transition={{ duration: 0.3, delay: 0.12 }}
                className="mt-0.5 text-xs font-medium text-white/70"
              >
                {subtitle}
              </motion.p>
            </div>
          )}
        </>
      )}

      {children}
    </div>
  );
}

/* ─── USAGE EXAMPLES ─────────────────────────────────────────────────────────

// Gallery album card:
<HoverImage
  src={album.coverImageUrl}
  alt={album.title}
  title={album.title}
  subtitle={album.category}
  badge="View Album"
  variant="spotlight"
  aspectRatio="aspect-[4/3]"
  onClick={() => openAlbum(album)}
/>

// Event card image:
<HoverImage
  src={event.imageUrl}
  alt={event.title}
  title={event.title}
  subtitle={new Date(event.startDate).toLocaleDateString("en-IN")}
  variant="curtain"
/>

// Faculty / about section photo:
<HoverImage
  src="/images/about-school.jpg"
  alt="ASPCS Campus"
  title="Our Campus"
  subtitle="Sudarshan Vihar, Patna"
  variant="zoom-reveal"
/>
────────────────────────────────────────────────────────────────────────────── */
