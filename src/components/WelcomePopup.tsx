"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("aspcs-welcome-seen");

    if (!seen) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("aspcs-welcome-seen", "1");
  };

  const whatsappMessage = encodeURIComponent(
    "Thank you for your interest in Patna Central School's Day Boarding Programme. Please share your child's name, class, and contact number. Our admissions team will assist you shortly."
  );

  const whatsappUrl = `https://wa.me/919102997549?text=${whatsappMessage}`;

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
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-brand-crimson/30 bg-brand-black shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Close Button */}
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-brand-crimson"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Banner */}
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-brand-maroon to-brand-black">
              <Image
                src="/images/welcome-banner.jpg"
                alt="Patna Central School"
                fill
                priority
                className="object-cover opacity-80"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />

              {/* Admissions Badge */}
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-brand-gold/40 bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-gold" />

                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
                  Day Boarding Admissions Open
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="px-7 pb-7 pt-5">
              {/* School Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-crimson/20 bg-brand-crimson/15">
                  <GraduationCap
                    size={20}
                    className="text-brand-crimson"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-crimson">
                    Patna Central School
                  </p>

                  <p className="text-xs font-semibold text-white/70">
                    Excellence in Education & Day Boarding
                  </p>
                </div>
              </div>

              {/* Heading */}
              <h2 className="mb-2 font-display text-2xl font-black text-white">
                Welcome to
                <br />
                <span className="text-brand-gold">
                  Patna Central School
                </span>
              </h2>

              {/* Admissions Text */}
              <p className="mb-2 text-sm font-semibold text-white">
                🌟 Admissions Open for XI
              </p>

              <p className="mb-5 text-sm font-medium leading-relaxed text-white/65">
               Excel in CBSE academics with FREE after-school JEE & NEET preparation, access to world-class STEAM, Robotics & AI Labs, experienced faculty, and a future-focused learning environment that nurtures innovation, leadership, and academic excellence.
              </p>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-2 text-center">
                {[
                  {
                    value: "CBSE",
                    label: "Affiliated",
                  },
                  {
                    value: "2,000+",
                    label: "Students",
                  },
                  {
                    value: "98%",
                    label: "Pass Rate",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] py-3"
                  >
                    <p className="font-display text-lg font-black text-brand-gold">
                      {item.value}
                    </p>

                    <p className="text-[10px] font-semibold text-white/50">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold"
                >
                  Apply Now
                  <ArrowRight size={15} />
                </a>

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