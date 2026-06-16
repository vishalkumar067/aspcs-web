"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/config/navigation";

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname    = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-brand-black/96 shadow-maroon backdrop-blur-xl"
          : "bg-transparent"
      )}>

        {/* ── Top info bar ───────────────────────────────────────────────── */}
        <div className="hidden border-b border-brand-crimson/20 lg:block">
          <div className="container-aspcs flex h-9 items-center justify-between text-xs text-white">
            <span className="font-medium">Excellence in Education Since 1980 · Session 2026–27</span>
            <div className="flex items-center gap-6">
              <a href="tel:+919102997549" className="flex items-center gap-1.5 font-medium transition-colors hover:text-brand-gold">
                <Phone size={11} />+91-91029 97549
              </a>
              <a href="mailto:info@aspcs.patna.ac.in" className="font-medium transition-colors hover:text-brand-gold">
                info@aspcs.patna.ac.in
              </a>
            </div>
          </div>
        </div>

        {/* ── Main nav ───────────────────────────────────────────────────── */}
        <div className="container-aspcs" ref={dropdownRef}>
          <div className="flex h-16 items-center justify-between gap-4 lg:h-[60px]">

            {/* ── School Logo + Full Name ── */}
            <Link href="/" className="group flex shrink-0 items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
                <Image src="/logo.png" alt="ASPCS Logo" width={40} height={40} className="object-contain" priority />
              </div>
              {/* Full school name — two lines */}
              <div className="leading-snug">
                <div className="font-display text-[15px] font-bold tracking-wide text-white">
                  Acharya Shree Sudarshan
                </div>
                <div className="hidden text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-gold sm:block">
                  Patna Central School
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden items-center xl:flex" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <>
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.href ? null : item.href)
                        }
                        className={cn(
                          "flex items-center gap-0.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-all duration-150",
                          pathname.startsWith(item.href) && item.href !== "/"
                            ? "text-brand-gold"
                            : "text-white hover:text-brand-gold"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          size={12}
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.href && "rotate-180"
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.href && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                            transition={{ duration: 0.16 }}
                            className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-brand-crimson/20 bg-brand-black/98 p-1.5 shadow-glass-lg backdrop-blur-xl"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center rounded-xl px-4 py-2.5 text-[13px] font-medium text-white transition-all duration-100 hover:bg-brand-crimson/15 hover:text-brand-gold"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-all duration-150",
                        pathname === item.href
                          ? "text-brand-gold"
                          : "text-white hover:text-brand-gold"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* ── Apply Now + Hamburger ── */}
            <div className="flex shrink-0 items-center gap-3">
              <Link href="/admissions" className="btn-primary hidden py-2.5 text-xs sm:inline-flex">
                Apply Now
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition-colors hover:bg-brand-crimson/20 xl:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-brand-black pt-20 lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,30,58,0.12),transparent_60%)]" />

            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {item.children ? (
                    <div className="mb-2">
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.href ? null : item.href)
                        }
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-white"
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.href && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.href && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block rounded-xl px-8 py-2.5 text-sm font-semibold text-white hover:text-brand-gold"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "mb-1 block rounded-xl px-4 py-3 text-base font-bold transition-colors",
                        pathname === item.href ? "text-brand-gold" : "text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-brand-crimson/20 px-6 py-6">
              <Link href="/admissions" className="btn-primary w-full justify-center">
                Apply for Admissions 2026–27
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
