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

  useEffect(() => { setMobileOpen(false); setActiveDropdown(null); }, [pathname]);

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
          ? "bg-brand-black/97 shadow-[0_2px_20px_rgba(196,30,58,0.15)] backdrop-blur-xl"
          : "bg-transparent"
      )}>
        {/* ── Top info bar ─────────────────────────────────────────────────── */}
        <div className="hidden border-b border-brand-crimson/20 bg-brand-black/90 lg:block">
          <div className="container-aspcs flex h-8 items-center justify-between text-[11px] font-medium text-white/60">
            <span>Excellence in Education Since 1980 · Session 2026–27 · CBSE Affiliated</span>
            <div className="flex items-center gap-5">
              <a href="tel:+919102997549" className="flex items-center gap-1.5 transition-colors hover:text-white">
                <Phone size={10} />+91-91029 97549
              </a>
              <a href="mailto:info@aspcs.patna.ac.in" className="transition-colors hover:text-white">
                info@aspcs.patna.ac.in
              </a>
            </div>
          </div>
        </div>

        {/* ── Main nav ─────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "border-b transition-all duration-300",
            scrolled ? "border-brand-crimson/15" : "border-transparent"
          )}
        >
          <div className="container-aspcs" ref={dropdownRef}>
            <div className="flex h-14 items-center justify-between gap-2">

              {/* ── Logo ── */}
              <Link href="/" className="group flex shrink-0 items-center gap-2.5">
                <div className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-105">
                  <Image src="/logo.png" alt="ASPCS" width={36} height={36} className="object-contain" priority />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-display text-[15px] font-extrabold leading-none tracking-wide text-white">
                    ASPCS
                  </span>
                  <span className="hidden text-[8.5px] font-semibold uppercase leading-none tracking-[0.1em] text-brand-crimson lg:block">
                    Acharya Shree Sudarshan · Patna
                  </span>
                </div>
              </Link>

              {/* ── Desktop Nav ── */}
              <nav className="hidden items-center xl:flex" aria-label="Main navigation">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href} className="relative">
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                          className={cn(
                            "flex items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-150",
                            pathname.startsWith(item.href) && item.href !== "/"
                              ? "text-brand-crimson"
                              : "text-white hover:text-brand-crimson"
                          )}
                        >
                          {item.label}
                          <ChevronDown size={12} className={cn("transition-transform duration-200", activeDropdown === item.href && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.href && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.97 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-brand-crimson/20 bg-brand-black/98 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center px-4 py-2.5 text-[13px] font-medium text-white/75 transition-all duration-100 hover:bg-brand-crimson/10 hover:text-white"
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
                          "block rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-150",
                          pathname === item.href ? "text-brand-crimson" : "text-white hover:text-brand-crimson"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* ── Right CTA ── */}
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href="/admissions"
                  className="hidden items-center gap-1.5 rounded-lg bg-brand-crimson px-3.5 py-2 text-[12px] font-bold text-white transition-all duration-200 hover:bg-brand-crimson/80 sm:inline-flex"
                >
                  Admissions Open
                </Link>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:bg-brand-crimson/20 xl:hidden"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                </button>
              </div>
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
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-brand-black/98 pt-[88px] xl:hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,30,58,0.1),transparent_60%)]" />

            <nav className="flex-1 overflow-y-auto px-5 py-4">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {item.children ? (
                    <div className="mb-1">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-bold text-white"
                      >
                        {item.label}
                        <ChevronDown size={15} className={cn("transition-transform", activeDropdown === item.href && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.href && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <Link key={child.href} href={child.href}
                                className="block rounded-xl px-8 py-2.5 text-[13px] font-medium text-white/60 hover:text-brand-crimson">
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link href={item.href}
                      className={cn("mb-1 block rounded-xl px-4 py-3 text-[15px] font-bold transition-colors",
                        pathname === item.href ? "text-brand-crimson" : "text-white")}>
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-brand-crimson/20 px-5 py-5 space-y-3">
              <Link href="/admissions" className="btn-primary w-full justify-center text-sm">
                Apply for Admissions 2026–27
              </Link>
              <Link href="/admissions#class11" className="block w-full rounded-xl border border-brand-crimson/30 py-2.5 text-center text-sm font-semibold text-brand-crimson hover:bg-brand-crimson/10">
                Class XI Admissions Open
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
