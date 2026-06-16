"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show once per session
    const seen = sessionStorage.getItem("aspcs-welcome-seen");
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("aspcs-welcome-seen", "1");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{    scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-brand-crimson/30 bg-brand-black shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-brand-crimson"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Banner image — replace /images/welcome-banner.jpg with your actual image */}
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-brand-maroon to-brand-black">
              {/* Try to load a welcome banner image; falls back to gradient */}
              <Image
                src="/images/welcome-banner.jpg"
                alt="ASPCS Welcome"
                fill
                className="object-cover opacity-80"
                onError={() => {}} // graceful fallback to gradient bg
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />

              {/* Badge */}
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-brand-gold/40 bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
                  Admissions Open
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="px-7 pb-7 pt-5">
              {/* School logo row */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-crimson/15 border border-brand-crimson/20">
                  <GraduationCap size={20} className="text-brand-crimson" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-crimson">ASPCS — Patna</p>
                  <p className="text-xs font-semibold text-white/70">Acharya Shree Sudarshan Patna Central School</p>
                </div>
              </div>

              <h2 className="mb-2 font-display text-2xl font-black text-white">
                Welcome to ASPCS!<br />
                <span className="text-brand-gold">Session 2026–27</span>
              </h2>

              <p className="mb-1 text-sm font-semibold text-white">
                🎓 Admissions Now Open — Classes Nursery to XII
              </p>
              <p className="mb-5 text-sm font-medium text-white/65">
                Including <strong className="text-white">Class XI (Science & Commerce)</strong> — Senior Secondary admissions are now open. Limited seats available.
              </p>

              {/* Highlights */}
              <div className="mb-6 grid grid-cols-3 gap-2 text-center">
                {[
                  { value: "CBSE",    label: "Affiliated" },
                  { value: "2,000+",  label: "Students" },
                  { value: "98%",     label: "Pass Rate" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/8 bg-white/4 py-3">
                    <p className="font-display text-lg font-black text-brand-gold">{s.value}</p>
                    <p className="text-[10px] font-semibold text-white/50">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Link
                  href="/admissions"
                  onClick={close}
                  className="btn-primary flex-1 justify-center py-3 text-sm font-bold"
                >
                  Apply Now <ArrowRight size={15} />
                </Link>
                <button
                  onClick={close}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  Explore Site
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
