"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface FacultyMember {
  name:    string;
  role:    string;
  qual?:   string;
  dept?:   string;
  photo?:  string;   // path to photo, e.g. /images/faculty/om-prakash.jpg
  initials?: string; // fallback if no photo
}

interface FacultyCardProps {
  member: FacultyMember;
}

export function FacultyCard({ member }: FacultyCardProps) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 });
  const [glare,   setGlare]   = useState({ x: 50, y: 50, opacity: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el   = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px   = (e.clientX - rect.left) / rect.width;   // 0→1 left→right
    const py   = (e.clientY - rect.top)  / rect.height;  // 0→1 top→bottom

    setTilt({
      x: (py - 0.5) * 18,   // tilt up/down
      y: (px - 0.5) * -18,  // tilt left/right
    });
    setGlare({ x: px * 100, y: py * 100, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "900px" }}
      className="cursor-pointer select-none"
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: hovered ? 1.04 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/4"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ── Photo ───────────────────────────────────────────────── */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-maroon/40 to-brand-black">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover object-top transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
            />
          ) : (
            /* Fallback: initials avatar */
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-5xl font-black text-brand-crimson/40 select-none">
                {member.initials ?? member.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Dark base overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to top, rgba(13,6,8,0.95) 0%, rgba(13,6,8,0.3) 45%, transparent 100%)",
              opacity: hovered ? 1 : 0.6,
            }}
          />

          {/* ── Glare effect — follows cursor ── */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
              transition: "background 0.1s",
            }}
          />
        </div>

        {/* ── Details panel — slides up on hover ─────────────────── */}
        <motion.div
          animate={{ y: hovered ? 0 : 48, opacity: hovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="absolute inset-x-0 bottom-0 p-4"
        >
          {/* Dept badge */}
          {member.dept && (
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
              transition={{ delay: 0.05 }}
              className="mb-2 inline-block rounded-full border border-brand-crimson/40 bg-brand-crimson/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-gold"
            >
              {member.dept}
            </motion.span>
          )}

          <motion.p
            animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 4 }}
            transition={{ delay: 0.07 }}
            className="font-display text-base font-black text-white"
          >
            {member.name}
          </motion.p>

          <motion.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-semibold text-brand-gold"
          >
            {member.role}
          </motion.p>

          {member.qual && (
            <motion.p
              animate={{ opacity: hovered ? 0.7 : 0, y: hovered ? 0 : 8 }}
              transition={{ delay: 0.13 }}
              className="mt-0.5 text-xs font-medium text-white/60"
            >
              {member.qual}
            </motion.p>
          )}
        </motion.div>

        {/* ── Name always visible at bottom when not hovered ── */}
        <motion.div
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-0 bottom-0 p-4"
        >
          <p className="font-display text-sm font-bold text-white">{member.name}</p>
          <p className="text-xs font-medium text-brand-gold/80">{member.role}</p>
        </motion.div>

        {/* ── Bottom border glow on hover ── */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-brand-crimson via-brand-gold to-brand-crimson"
        />
      </motion.div>
    </div>
  );
}

/* ─── USAGE EXAMPLE ────────────────────────────────────────────────────────
Replace your existing faculty array + render with:

const faculty: FacultyMember[] = [
  {
    name:    "Mr. Om Prakash Singh",
    role:    "Director",
    qual:    "M.Sc., B.Ed.",
    dept:    "Administration",
    photo:   "/images/faculty/om-prakash.jpg",  // place photo here
    initials: "OP",                              // fallback if no photo
  },
  // ... more
];

// In JSX:
<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
  {faculty.map((f) => (
    <FacultyCard key={f.name} member={f} />
  ))}
</div>
──────────────────────────────────────────────────────────────────────────── */
