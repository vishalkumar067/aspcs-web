"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X, Loader2, Calendar, Users, ChevronRight } from "lucide-react";
import { getActiveJobs, type JobListing } from "@/lib/publicApi";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL
  ?? "https://aspcs-backend-production.up.railway.app/api/v1";

// ─── Apply Modal ─────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: JobListing; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", qualification: "",
    experience: "", coverLetter: "", resumeUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Name, email and phone are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/careers/jobs/${job.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Application submitted successfully!");
      onClose();
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", required = false) => (
    <div key={key}>
      <label className="mb-1 block text-xs font-medium text-white/70">
        {label} {required && <span className="text-brand-gold">*</span>}
      </label>
      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Apply for {job.title}</h3>
            <p className="text-sm text-brand-slate">{job.department}</p>
          </div>
          <button onClick={onClose} className="shrink-0 text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-3">
          {field("name",          "Full Name",       "text",  true)}
          {field("email",         "Email",           "email", true)}
          {field("phone",         "Phone",           "tel",   true)}
          {field("qualification", "Qualification")}
          {field("experience",    "Experience")}
          {field("resumeUrl",     "Resume Link (Google Drive / Dropbox)")}
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Cover Letter</label>
            <textarea value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })}
              rows={4} placeholder="Why are you a good fit for this role?"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CareersPage() {
  const [jobs,      setJobs]      = useState<JobListing[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<JobListing | null>(null);
  const [applying,  setApplying]  = useState<JobListing | null>(null);
  const [dept,      setDept]      = useState("ALL");

  useEffect(() => {
    getActiveJobs(0, 50).then(data => { setJobs(data); setLoading(false); });
  }, []);

  const depts = ["ALL", ...Array.from(new Set(jobs.map(j => j.department)))];
  const filtered = dept === "ALL" ? jobs : jobs.filter(j => j.department === dept);

  return (
    <main className="min-h-screen bg-brand-black">
      {/* Header */}
      <section className="border-b border-brand-crimson/20 bg-gradient-to-b from-brand-maroon/20 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-2">
            <Briefcase size={14} className="text-brand-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Join Our Team</span>
          </div>
          <h1 className="font-display text-4xl font-black text-white md:text-5xl">Careers</h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-slate">
            Become part of the ASPCS family. We're looking for passionate educators and staff.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={28} className="animate-spin text-brand-crimson" />
          </div>
        ) : (
          <>
            {/* Department filter */}
            {depts.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {depts.map(d => (
                  <button key={d} onClick={() => setDept(d)}
                    className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                      dept === d ? "bg-brand-crimson text-white" : "bg-white/5 text-brand-slate hover:bg-white/10")}>
                    {d}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-white/8 py-24 text-center">
                <Briefcase size={40} className="mx-auto mb-4 text-brand-slate/30" />
                <p className="text-brand-slate">No open positions at the moment. Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((job, i) => (
                  <motion.div key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group rounded-2xl border border-white/8 bg-white/3 p-6 transition-all hover:border-brand-crimson/30">

                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-1 flex flex-wrap gap-2">
                          <span className="rounded-full bg-brand-crimson/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-crimson">
                            {job.type.replace("_", " ")}
                          </span>
                          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-brand-slate">
                            {job.department}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-crimson transition-colors">
                          {job.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-brand-slate">
                          {job.vacancies > 0 && (
                            <span className="flex items-center gap-1"><Users size={12} />{job.vacancies} position{job.vacancies > 1 ? "s" : ""}</span>
                          )}
                          {job.lastDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Last date: {new Date(job.lastDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                          {job.experience && <span>Exp: {job.experience}</span>}
                          {job.salary && <span>Salary: {job.salary}</span>}
                        </div>
                        {selected?.id === job.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 space-y-3 text-sm text-brand-slate">
                            <p className="whitespace-pre-line">{job.description}</p>
                            {job.requirements && (
                              <div>
                                <p className="font-semibold text-white">Requirements</p>
                                <p className="whitespace-pre-line">{job.requirements}</p>
                              </div>
                            )}
                            {job.qualification && (
                              <div>
                                <p className="font-semibold text-white">Qualification</p>
                                <p>{job.qualification}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button onClick={() => setSelected(selected?.id === job.id ? null : job)}
                          className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs text-brand-slate hover:text-white transition-all">
                          {selected?.id === job.id ? "Less" : "Details"}
                          <ChevronRight size={12} className={cn("transition-transform", selected?.id === job.id && "rotate-90")} />
                        </button>
                        <button onClick={() => setApplying(job)}
                          className="btn-primary px-4 py-2 text-xs">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {applying && <ApplyModal job={applying} onClose={() => setApplying(null)} />}
      </AnimatePresence>
    </main>
  );
}
