"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, ArrowRight, Users, Calendar, ChevronRight, Loader2 } from "lucide-react";
import { getActiveJobs, type JobListing } from "@/lib/publicApi";
import { cn } from "@/lib/utils";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://aspcs-backend-production.up.railway.app/api/v1";

export default function CareersSection() {
  const [jobs,    setJobs]    = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveJobs(0, 4).then(data => { setJobs(data); setLoading(false); });
  }, []);

  if (!loading && jobs.length === 0) return null; // hide section if no openings

  return (
    <section className="section-pad relative overflow-hidden bg-brand-black">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(107,15,26,0.25),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-crimson/40 to-transparent" />

      <div className="container-aspcs relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="section-eyebrow mb-4 inline-flex"
            >
              <Briefcase size={11} /> Join Our Team
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-display-xs font-black text-white"
            >
              Career <span className="text-brand-gold">Opportunities</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-2 max-w-lg text-sm font-medium text-brand-slate"
            >
              Join the ASPCS family. We're looking for passionate educators and
              dedicated staff to shape the next generation.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/careers" className="btn-outline hidden sm:inline-flex">
              All openings <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-brand-slate">
            <Loader2 size={20} className="animate-spin text-brand-crimson" />
            <span className="text-sm font-medium">Loading openings...</span>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-6 transition-all duration-200 hover:border-brand-crimson/40 hover:bg-white/6"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top_left,rgba(196,30,58,0.08),transparent_70%)]" />

                <div className="relative">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-crimson/15 border border-brand-crimson/20">
                      <Briefcase size={19} className="text-brand-crimson" />
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Hiring Now
                    </span>
                  </div>

                  <h3 className="mb-1 font-display text-base font-black text-white group-hover:text-brand-gold transition-colors">
                    {job.title}
                  </h3>
                  <p className="mb-3 text-sm font-semibold text-brand-slate">{job.department}</p>

                  <div className="mb-4 flex flex-wrap gap-3 text-xs font-medium text-brand-slate">
                    <span className="flex items-center gap-1.5">
                      <Users size={12} className="text-brand-gold" />
                      {job.vacancies} position{job.vacancies > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={12} className="text-brand-gold" />
                      {job.type.replace("_", " ")}
                    </span>
                    {job.lastDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-brand-gold" />
                        Last: {new Date(job.lastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>

                  {job.experience && (
                    <p className="mb-4 text-xs font-medium text-brand-slate">
                      Exp: <span className="font-semibold text-white/80">{job.experience}</span>
                    </p>
                  )}

                  <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-2.5 text-xs font-bold text-brand-crimson transition-all hover:bg-brand-crimson hover:text-white"
                  >
                    Apply Now <ChevronRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-4 sm:hidden">
          <Link href="/careers" className="btn-outline w-full justify-center">
            View All Openings <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bottom note */}
        {!loading && jobs.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-8 text-center text-xs font-medium text-brand-slate"
          >
            ASPCS is an equal-opportunity employer · Session 2026–27
          </motion.p>
        )}
      </div>
    </section>
  );
}
