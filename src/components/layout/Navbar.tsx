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
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
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
        {/* Top bar */}
        <div className="hidden border-b border-brand-crimson/20 lg:block">
          <div className="container-aspcs flex h-9 items-center justify-between text-xs text-brand-slate">
            <span>Excellence in Education Since 1980</span>
            <div className="flex items-center gap-6">
              <a href="tel:+919102997549" className="flex items-center gap-1.5 transition-colors hover:text-brand-gold">
                <Phone size={11} />+91-91029 97549
              </a>
              <a href="mailto:info@aspcs.patna.ac.in" className="transition-colors hover:text-brand-gold">
                info@aspcs.patna.ac.in
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container-aspcs" ref={dropdownRef}>
          <div className="flex h-16 items-center justify-between lg:h-18">

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-10 w-10 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
                <Image src="/logo.png" alt="ASPCS Logo" width={40} height={40} className="object-contain" priority />
              </div>
              <div className="leading-tight">
                <div className="font-display text-lg font-bold tracking-wide text-white">Acharya Shree Sudarshan</div>
                <div className="hidden text-[9px] font-medium uppercase tracking-[0.15em] text-brand-gold sm:block">
                  Patna Central School
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                        pathname.startsWith(item.href) && item.href !== "/"
                          ? "text-brand-gold" : "text-white/80 hover:text-white"
                      )}
                    >
                      {item.label}
                      <ChevronDown size={13} className={cn("transition-transform duration-200", activeDropdown === item.href && "rotate-180")} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
                        pathname === item.href ? "text-brand-gold" : "text-white/80 hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-brand-crimson/20 bg-brand-black/98 p-1.5 shadow-glass-lg backdrop-blur-xl"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center rounded-xl px-4 py-2.5 text-sm text-white/75 transition-all duration-150 hover:bg-brand-crimson/10 hover:text-brand-gold"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link href="/admissions" className="btn-primary hidden py-2.5 text-xs sm:inline-flex">
                Apply Now
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition-colors hover:bg-brand-crimson/20 lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
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
                        onClick={() => setActiveDropdown(activeDropdown === item.href ? null : item.href)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-white/90"
                      >
                        {item.label}
                        <ChevronDown size={16} className={cn("transition-transform duration-200", activeDropdown === item.href && "rotate-180")} />
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
                              <Link key={child.href} href={child.href} className="block rounded-xl px-8 py-2.5 text-sm text-white/60 hover:text-brand-gold">
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
                      className={cn("mb-1 block rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                        pathname === item.href ? "text-brand-gold" : "text-white/90"
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
                Apply for Admissions
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
