"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2,
  Loader2, MessageSquare, Facebook, Instagram, Youtube, Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Please enter a valid email"),
  phone:   z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactFormData = z.infer<typeof contactSchema>;

const subjects = [
  "General Inquiry",
  "Admission Query",
  "Fee Structure",
  "Transport",
  "Academic Query",
  "Other",
];

const infoCards = [
  {
    icon: MapPin,
    title: "Our Address",
    lines: ["Sudarshan Vihar, New ByPass,Jaganpura", "Patna, Bihar — 800027"],
    color: "text-amber-400",
    bg:    "bg-amber-400/10",
  },
  {
    icon: Phone,
    title: "Phone Numbers",
    lines: ["+91-91029-1029", "+91-9334486072"],
    color: "text-blue-400",
    bg:    "bg-blue-400/10",
  },
  {
    icon: Mail,
    title: "Email Addresses",
    lines: ["info@aspcspatna.ac.in", "info@aspcspatna.ac.in"],
    color: "text-violet-400",
    bg:    "bg-violet-400/10",
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: ["Mon – Sat: 9:00 AM – 4:00 PM", "Sunday: Closed"],
    color: "text-emerald-400",
    bg:    "bg-emerald-400/10",
  },
];

const socials = [
  { icon: Facebook,  href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube,   href: "#", label: "YouTube" },
  { icon: Twitter,   href: "#", label: "Twitter" },
];

function Field({
  label, error, required, children,
}: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">
        {label}{required && <span className="ml-0.5 text-brand-gold">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (_data: ContactFormData) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setSubmitting(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-black">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black pb-16 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(201,168,76,0.12),transparent)]" />
        <div className="container-aspcs relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-eyebrow mb-5 inline-flex"><MessageSquare size={11} />Get In Touch</span>
            <h1 className="font-display text-display-md font-bold text-white">
              Contact <span className="text-brand-gold">ASPCS</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-brand-slate">
              Have a question about admissions, academics, or anything else?
              We're here to help. Reach out and we'll respond within 30 minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Info Cards ───────────────────────────────────────────── */}
      <section className="relative z-10 -mt-8">
        <div className="container-aspcs">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 shadow-card"
                >
                  <div className={cn("mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl", card.bg)}>
                    <Icon size={18} className={card.color} />
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-[var(--text-primary)]">{card.title}</h3>
                  {card.lines.map((line) => (
                    <p key={line} className="text-xs text-[var(--text-muted)]">{line}</p>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Map ───────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-aspcs">
          <div className="grid gap-10 lg:grid-cols-2">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-2 font-display text-2xl font-bold text-[var(--text-primary)]">
                Send Us a Message
              </h2>
              <p className="mb-8 text-sm text-[var(--text-muted)]">
                Fill in the form and our team will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-10 text-center">
                  <CheckCircle2 size={40} className="mx-auto mb-4 text-brand-gold" />
                  <h3 className="mb-2 font-display text-xl font-bold text-[var(--text-primary)]">
                    Message Sent!
                  </h3>
                  <p className="mb-6 text-sm text-[var(--text-muted)]">
                    Thank you for reaching out. We'll respond within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your Name" error={errors.name?.message} required>
                      <input
                        {...register("name")}
                        placeholder="e.g. Rahul Sharma"
                        className={cn("input-field", errors.name && "border-red-400/50")}
                      />
                    </Field>
                    <Field label="Email Address" error={errors.email?.message} required>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="email@example.com"
                        className={cn("input-field", errors.email && "border-red-400/50")}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone Number" error={errors.phone?.message}>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="input-field"
                      />
                    </Field>
                    <Field label="Subject" error={errors.subject?.message} required>
                      <select
                        {...register("subject")}
                        className={cn("input-field", errors.subject && "border-red-400/50")}
                      >
                        <option value="">Select subject...</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Message" error={errors.message?.message} required>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Write your message here..."
                      className={cn("input-field resize-none", errors.message && "border-red-400/50")}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full justify-center py-4 shadow-glow-gold"
                  >
                    {submitting ? (
                      <><Loader2 size={17} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map + Social */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              {/* Map placeholder */}
              <div className="relative h-72 overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-brand-black lg:h-96">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "linear-gradient(rgba(201,168,76,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.15) 1px,transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <MapPin size={32} className="mb-3 text-brand-gold" />
                  <p className="text-sm font-semibold text-white">ASPCS School Campus</p>
                  <p className="mt-1 text-xs text-brand-slate">Sudarshan Vihar, New ByPass, Jaganpura, Patna, Bihar — 800027</p>
                  <a
                    href="https://maps.app.goo.gl/6ATX3hgqotnigGSU9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-4 py-2 text-xs"
                  >
                    Open in Google Maps
                  </a>
                </div>
                {/* Replace above div with actual Google Maps iframe */}
                {/* 
                <iframe
                  src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_URL"
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                />
                */}
              </div>

              {/* Quick contact card */}
              <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6">
                <h3 className="mb-4 font-display text-lg font-bold text-[var(--text-primary)]">
                  Quick Contact
                </h3>
                <div className="space-y-3">
                  <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-brand-gold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold/10">
                      <Phone size={15} className="text-brand-gold" />
                    </div>
                    +91-91029-1029
                  </a>
                  <a href="mailto:info@aspcs.edu.in" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-brand-gold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold/10">
                      <Mail size={15} className="text-brand-gold" />
                    </div>
                  info@aspcspatna.ac.in
                  </a>
                </div>

                <div className="mt-6 border-t border-[var(--surface-border)] pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    Follow Us
                  </p>
                  <div className="flex gap-2">
                    {socials.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] text-[var(--text-muted)] transition-all hover:border-brand-gold/40 hover:text-brand-gold"
                      >
                        <Icon size={15} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
