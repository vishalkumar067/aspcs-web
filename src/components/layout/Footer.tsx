import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram, Twitter } from "lucide-react";
import { FOOTER_LINKS } from "@/config/navigation";

const socials = [
  { icon: Facebook,  href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube,   href: "#", label: "YouTube" },
  { icon: Twitter,   href: "#", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-black text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-crimson/50 to-transparent" />

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-crimson/5 blur-3xl" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-maroon/10 blur-3xl" />
      </div>

      {/* Admission Banner */}
      <div className="border-b border-brand-crimson/20 bg-brand-crimson/8">
        <div className="container-aspcs flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row sm:text-left">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-brand-gold">🎓 Admissions Open 2026–27</span>
            <p className="mt-0.5 text-sm font-semibold text-white">
              Nursery · Primary · Secondary · <strong className="text-brand-gold">Senior Secondary (Class XI–XII)</strong>
            </p>
          </div>
          <Link href="/admissions" className="shrink-0 rounded-xl bg-brand-crimson px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-brand-crimson/80">
            Apply Now →
          </Link>
        </div>
      </div>

      <div className="container-aspcs relative z-10 py-14">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* ── Brand ──────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                <Image src="/logo.png" alt="ASPCS Logo" width={44} height={44} className="object-contain" />
              </div>
              <div>
                <div className="font-display text-lg font-extrabold tracking-wide text-white">Acharya</div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-brand-crimson">
                  Shree Sudarshan Patna Central School
                </div>
              </div>
            </Link>

            {/* Tags */}
            <div className="mb-5 flex flex-wrap gap-2">
              {["CBSE Affiliated", "Nursery – XII", "Class XI–XII", "Science & Commerce"].map(t => (
                <span key={t} className="rounded-full border border-brand-crimson/25 bg-brand-crimson/8 px-2.5 py-0.5 text-[10px] font-semibold text-white/70">
                  {t}
                </span>
              ))}
            </div>

            <p className="mb-7 max-w-sm text-sm font-medium leading-relaxed text-white/55">
              Nurturing young minds from Nursery to Senior Secondary (Class XII)
              with world-class education, holistic development and CBSE-aligned
              curriculum since 1980. Building tomorrow's leaders today.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-crimson" />
                <span className="font-medium text-white/60">Sudarshan Vihar, New By-Pass, Jagganpura<br />Patna — 800027, Bihar</span>
              </li>
              <li>
                <a href="tel:+919102997549" className="flex items-center gap-3 font-medium text-white/60 transition-colors hover:text-white">
                  <Phone size={15} className="shrink-0 text-brand-crimson" />+91-91029 97549
                </a>
              </li>
              <li>
                <a href="mailto:info@aspcs.patna.ac.in" className="flex items-center gap-3 font-medium text-white/60 transition-colors hover:text-white">
                  <Mail size={15} className="shrink-0 text-brand-crimson" />info@aspcs.patna.ac.in
                </a>
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 transition-all duration-200 hover:border-brand-crimson/40 hover:bg-brand-crimson/10 hover:text-white">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ───────────────────────────────────── */}
          <div>
            <h4 className="mb-5 text-[10px] font-black uppercase tracking-widest text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm font-medium text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Academics ────────────────────────────────────── */}
          <div>
            <h4 className="mb-5 text-[10px] font-black uppercase tracking-widest text-white">Academics</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.academics.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm font-medium text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Policies + CTA ───────────────────────────────── */}
          <div>
            <h4 className="mb-5 text-[10px] font-black uppercase tracking-widest text-white">Information</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.policies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm font-medium text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Class XI admission CTA */}
            <div className="mt-8 rounded-2xl border border-brand-crimson/30 bg-brand-crimson/10 p-5">
              <p className="text-xs font-black uppercase tracking-wider text-brand-gold">🎓 Class XI Open</p>
              <p className="mb-1 mt-1 text-sm font-bold text-white">Senior Secondary</p>
              <p className="mb-4 text-xs font-medium text-white/55">Science & Commerce — 2026–27</p>
              <Link href="/admissions#class11" className="block w-full rounded-xl bg-brand-crimson py-2.5 text-center text-xs font-black text-white transition-all hover:bg-brand-crimson/80">
                Apply for Class XI
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-7 text-xs font-medium text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Acharya Shree Sudarshan Patna Central School. All rights reserved.</p>
          <p>CBSE Affiliated · Patna, Bihar · Session 2026–27</p>
        </div>
      </div>
    </footer>
  );
}
