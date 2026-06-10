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

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-crimson/5 blur-3xl" />
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-maroon/10 blur-3xl" />
      </div>

      <div className="container-aspcs relative z-10 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="relative flex h-11 w-11 overflow-hidden rounded-xl">
                <Image src="/logo.png" alt="ASPCS Logo" width={44} height={44} className="object-contain" />
              </div>
              <div>
                <div className="font-display text-xl font-bold tracking-wide">Acharya Shree Sudarshan</div>
                <div className="text-[9px] font-medium uppercase tracking-[0.15em] text-brand-gold">
                  Patna Central School
                </div>
              </div>
            </Link>

            <p className="mb-8 max-w-sm text-sm leading-relaxed text-brand-slate">
              Nurturing young minds with world-class education, creative thinking,
              and holistic development since 1980. Building tomorrow's leaders today.
            </p>

            <ul className="space-y-3 text-sm text-brand-slate">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-gold" />
                <span>Sudarshan Vihar,New By-Pass,Jagganpura<br />Patna — 800027</span>
              </li>
              <li>
                <a href="tel:+919102997549" className="flex items-center gap-3 transition-colors hover:text-brand-gold">
                  <Phone size={15} className="shrink-0 text-brand-gold" />+91-91029 97549
                </a>
              </li>
              <li>
                <a href="mailto:info@aspcs.patna.ac.in" className="flex items-center gap-3 transition-colors hover:text-brand-gold">
                  <Mail size={15} className="shrink-0 text-brand-gold" />info@aspcs.patna.ac.in
                </a>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label} href={href} aria-label={label}
                  target="_blank" rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-crimson/20 text-brand-slate transition-all duration-200 hover:border-brand-gold/40 hover:bg-brand-gold/10 hover:text-brand-gold"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-brand-gold">Quick Links</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-slate transition-colors hover:text-brand-gold">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-brand-gold">Academics</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.academics.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-slate transition-colors hover:text-brand-gold">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies + CTA */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-brand-gold">Policies</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.policies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-slate transition-colors hover:text-brand-gold">{link.label}</Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-brand-crimson/30 bg-brand-crimson/10 p-5">
              <p className="mb-1 text-sm font-semibold text-white">Admissions Open</p>
              <p className="mb-4 text-xs text-brand-slate">Session 2026–27</p>
              <Link href="/admissions" className="btn-primary w-full justify-center py-2.5 text-xs">Apply Now</Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-brand-crimson/15 pt-8 text-xs text-brand-slate sm:flex-row">
          <p>© {new Date().getFullYear()} ASPCS. All rights reserved.</p>
          <p>Designed with care for future innovators</p>
        </div>
      </div>
    </footer>
  );
}
