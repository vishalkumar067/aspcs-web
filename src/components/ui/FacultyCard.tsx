"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users } from "lucide-react";

// ─── Faculty Data ─────────────────────────────────────────────────────────────
// Add photo paths once you have the images placed in public/images/faculty/
// If photo is missing, the card shows the initials avatar automatically.

const FACULTY = [
  {
    name:     "Mr. Om Prakash Singh",
    role:     "Director",
    qual:     "M.Sc., B.Ed.",
    dept:     "Administration",
    initials: "OP",
    photo:    "/images/faculty/OP.jpg",
  },
  {
    name:     "Mr Vinay Ojha",
    role:     "Principal",
    qual:     "M.A., B.Ed.",
    dept:     "Administration",
    initials: "VO",
    photo:    "/images/faculty/VO.jpg",
  },
  {
    name:     "Dr.. Prabhat Kumar Singh",
    role:     "Vice Principal",
    qual:     "M.A. (English), B.Ed, Ph.D.",
    dept:     "English",
    initials: "PK",
    photo:    "/images/faculty/PK.jpg",
  },
  {
    name:     "Mrs. Shweta Ojha",
    role:     "Incharge - Senior Secondary",
    qual:     "M.Sc., B.Ed.",
    dept:     "Chemistry",
    initials: "SO",
    photo:    "/images/faculty/SO.jpg",
  },
  {
    name:     "Mr. Sanjeev Kumar Singh",
    role:     "Incharge -  Secondary",
    qual:     "M.Sc., B.Ed.",
    dept:     "Mathematics",
    initials: "SS",
    photo:    "/images/faculty/SS.jpg",
  },
  {
    name:     "Mr. Ashok Kumar",
    role:     "Incharge - Upper Primary",
    qual:     "M.A., B.Ed.",
    dept:     "Social Science",
    initials: "AK",
    photo:    "/images/faculty/AK.jpg",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FacultyMember {
  name:     string;
  role:     string;
  qual?:    string;
  dept?:    string;
  photo?:   string;
  initials?: string;
}

// ─── Individual Card ──────────────────────────────────────────────────────────
export function FacultyCard({ member }: { member: FacultyMember }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 });
  const [glare,   setGlare]   = useState({ x: 50, y: 50, opacity: 0 });
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;
    setTilt({ x: (py - 0.5) * 18, y: (px - 0.5) * -18 });
    setGlare({ x: px * 100, y: py * 100, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setHovered(false);
  };

  const showPhoto = member.photo && !imgError;

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
        {/* ── Photo / Initials ── */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-brand-maroon/40 to-brand-black">
          {showPhoto ? (
            <Image
              src={member.photo!}
              alt={member.name}
              fill
              className="object-cover object-top transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-36 w-36 rounded-full border border-brand-crimson/10" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-28 w-28 rounded-full border border-brand-crimson/15" />
              </div>
              {/* Initials */}
              <span className="relative z-10 font-display text-6xl font-black text-brand-crimson/50 select-none">
                {member.initials ?? member.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
              </span>
              <span className="relative z-10 text-xs font-semibold uppercase tracking-widest text-white/20">
                Photo coming soon
              </span>
            </div>
          )}

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to top, rgba(13,6,8,0.95) 0%, rgba(13,6,8,0.3) 45%, transparent 100%)",
              opacity: hovered ? 1 : 0.6,
            }}
          />

          {/* Glare — follows cursor */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
              transition: "background 0.08s",
            }}
          />
        </div>

        {/* ── Hover: details slide up ── */}
        <motion.div
          animate={{ y: hovered ? 0 : 44, opacity: hovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="absolute inset-x-0 bottom-0 p-4"
        >
          {member.dept && (
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
              transition={{ delay: 0.04 }}
              className="mb-2 inline-block rounded-full border border-brand-crimson/40 bg-brand-crimson/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-gold"
            >
              {member.dept}
            </motion.span>
          )}

          <motion.p
            animate={{ opacity: hovered ? 1 : 0.8, y: hovered ? 0 : 4 }}
            transition={{ delay: 0.06 }}
            className="font-display text-base font-black text-white"
          >
            {member.name}
          </motion.p>

          <motion.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ delay: 0.09 }}
            className="text-sm font-semibold text-brand-gold"
          >
            {member.role}
          </motion.p>

          {member.qual && (
            <motion.p
              animate={{ opacity: hovered ? 0.65 : 0, y: hovered ? 0 : 8 }}
              transition={{ delay: 0.12 }}
              className="mt-0.5 text-xs font-medium text-white/60"
            >
              {member.qual}
            </motion.p>
          )}
        </motion.div>

        {/* ── Default (not hovered): name always visible ── */}
        <motion.div
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-x-0 bottom-0 p-4"
        >
          <p className="font-display text-sm font-bold text-white">{member.name}</p>
          <p className="text-xs font-medium text-brand-gold/80">{member.role}</p>
        </motion.div>

        {/* ── Bottom glow bar on hover ── */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-brand-crimson via-brand-gold to-brand-crimson"
        />
      </motion.div>
    </div>
  );
}

// ─── Full Grid Section (drop-in replacement for the section in about/page.tsx) ──
export default function FacultyGrid() {
  return (
    <section className="section-pad">
      <div className="container-aspcs">
        <div className="mb-14 text-center">
          <span className="section-eyebrow mb-5 inline-flex">
            <Users size={11} /> Our Team
          </span>
          <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
            Meet Our <span className="text-brand-crimson">Leadership</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
            Hover over each card to learn more about our dedicated team.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FACULTY.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <FacultyCard member={f} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
