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

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-brand-black/96 shadow-maroon backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        {/* ── Top info bar ─────────────────────────────────────────────────── */}
        <div className="hidden border-b border-brand-crimson/20 lg:block">
          <div className="container-aspcs flex h-9 items-center justify-between text-xs font-medium text-white">
            <span>Excellence in Education Since 1980 · Session 2026–27 · CBSE Affiliated</span>
            <div className="flex items-center gap-6">
              <a
                href="tel:+919102997549"
                className="flex items-center gap-1.5 transition-colors hover:text-brand-gold"
              >
                <Phone size={11} />
                +91-91029 97549
              </a>
              <a
                href="mailto:info@aspcs.patna.ac.in"
                className="transition-colors hover:text-brand-gold"
              >
                info@aspcs.patna.ac.in
              </a>
            </div>
          </div>
        </div>

        {/* ── Main navbar ──────────────────────────────────────────────────── */}
        <div className="container-aspcs" ref={dropdownRef}>
          {/* NOTE: h-16 on mobile, h-14 on desktop so it fits more items */}
          <div className="flex h-16 items-center justify-between gap-3 lg:h-14">

            {/* ── Logo + Full School Name ── */}
            <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="ASPCS Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="font-display text-[14px] font-bold text-white">
                  Acharya Shree Sudarshan
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-gold">
                  Patna Central School
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav — lg:flex (1024px+) ── */}
            <nav
              className="hidden items-center lg:flex"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <>
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.href ? null : item.href
                          )
                        }
                        className={cn(
                          "flex items-center gap-0.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold transition-colors duration-150",
                          pathname.startsWith(item.href) && item.href !== "/"
                            ? "text-brand-gold"
                            : "text-white hover:text-brand-gold"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          size={11}
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.href && "rotate-180"
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.href && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-brand-crimson/20 bg-brand-black/98 py-1.5 shadow-glass-lg backdrop-blur-xl"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-brand-crimson/10 hover:text-brand-gold"
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
                        "block rounded-lg px-2 py-1.5 text-[12px] font-semibold transition-colors duration-150",
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

            {/* ── Right side: Apply Now + Hamburger ── */}
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/admissions"
                className="hidden rounded-lg bg-brand-crimson px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-brand-crimson/80 sm:block"
              >
                Apply Now
              </Link>

              {/* Hamburger — lg:hidden means visible below 1024px */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition-colors hover:bg-brand-crimson/20 lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-brand-black shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-brand-crimson/20 px-5 py-4">
                <span className="font-display text-sm font-bold text-white">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="mb-1"
                  >
                    {item.children ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.href ? null : item.href
                            )
                          }
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white"
                        >
                          {item.label}
                          <ChevronDown
                            size={14}
                            className={cn(
                              "transition-transform",
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
                              className="overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block rounded-xl px-8 py-2.5 text-sm font-medium text-white hover:text-brand-gold"
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
                          "block rounded-xl px-4 py-3 text-sm font-bold transition-colors",
                          pathname === item.href ? "text-brand-gold" : "text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-brand-crimson/20 px-4 py-4">
                <Link
                  href="/admissions"
                  className="btn-primary w-full justify-center py-3 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Apply Now — Session 2026–27
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
