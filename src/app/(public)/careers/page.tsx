"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Clock, Users, ChevronDown, Send, Loader2, X, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

// Mock data — replace with API call
const JOBS = [
  {
    id: "1", title: "PGT Mathematics", department: "Mathematics",
    type: "FULL_TIME", experience: "3-5 years", qualification: "M.Sc. Mathematics + B.Ed.",
    vacancies: 2, lastDate: "2025-06-30", active: true,
    description: "We are looking for an experienced PGT Mathematics teacher to join our secondary section. The candidate should have strong subject knowledge and the ability to prepare students for CBSE board examinations.",
    requirements: "M.Sc. Mathematics with B.Ed. degree\nMinimum 3 years teaching experience\nCBSE board teaching experience preferred\nStrong communication skills",
    responsibilities: "Teach Mathematics for Classes IX-X\nPrepare lesson plans and study material\nConduct regular assessments\nMentor students for board examinations",
  },
  {
    id: "2", title: "TGT English", department: "English",
    type: "FULL_TIME", experience: "2-4 years", qualification: "M.A. English + B.Ed.",
    vacancies: 1, lastDate: "2025-06-30", active: true,
    description: "Seeking a dynamic TGT English teacher for our middle school section. The ideal candidate should have excellent communication skills and a passion for literature.",
    requirements: "M.A. English with B.Ed.\nMinimum 2 years experience\nExcellent spoken and written English",
    responsibilities: "Teach English for Classes VI-VIII\nOrganize reading and writing activities\nPrepare students for olympiads",
  },
  {
    id: "3", title: "PRT Science", department: "Science",
    type: "FULL_TIME", experience: "1-3 years", qualification: "B.Sc. + B.Ed.",
    vacancies: 2, lastDate: "2025-07-15", active: true,
    description: "Looking for enthusiastic PRT Science teachers to join our primary section with a focus on hands-on learning and scientific curiosity.",
    requirements: "B.Sc. with B.Ed. degree\nPassion for teaching young children\nCreative teaching methods",
    responsibilities: "Teach EVS/Science for Classes III-V\nConduct science experiments\nOrganize science fair projects",
  },
  {
    id: "4", title: "Computer Science Teacher", department: "Computer Science",
    type: "FULL_TIME", experience: "2-5 years", qualification: "B.Tech/MCA + B.Ed.",
    vacancies: 1, lastDate: "2025-07-31", active: true,
    description: "Seeking a qualified Computer Science teacher to teach programming, web development basics, and digital literacy across multiple grades.",
    requirements: "B.Tech/MCA with B.Ed.\nProficiency in Python, HTML, MS Office\nExperience in teaching coding to students",
    responsibilities: "Teach Computer Science/IT for Classes VI-X\nMaintain computer lab\nTeach coding fundamentals",
  },
];

const applySchema = z.object({
  name:         z.string().min(2, "Name required"),
  email:        z.string().email("Valid email required"),
  phone:        z.string().min(10, "Phone required"),
  qualification:z.string().min(2, "Qualification required"),
  experience:   z.string().optional(),
  coverLetter:  z.string().optional(),
});
type ApplyForm = z.infer<typeof applySchema>;

function JobCard({ job }: { job: typeof JOBS[0] }) {
  const [expanded, setExpanded]   = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<ApplyForm>({ resolver: zodResolver(applySchema) });

  const onSubmit = async (data: ApplyForm) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/careers/jobs/${job.id}/apply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Application failed");
      setSubmitted(true);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card overflow-hidden"
    >
      {/* Job header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-crimson/10">
              <Briefcase size={20} className="text-brand-crimson" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">{job.title}</h3>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">{job.department}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full border border-brand-crimson/20 bg-brand-crimson/8 px-3 py-0.5 text-xs font-medium text-brand-crimson">
                  <Clock size={11} /> {job.type.replace("_", " ")}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-[var(--surface-border)] bg-[var(--surface-bg)] px-3 py-0.5 text-xs text-[var(--text-muted)]">
                  <Users size={11} /> {job.vacancies} {job.vacancies === 1 ? "vacancy" : "vacancies"}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-[var(--surface-border)] bg-[var(--surface-bg)] px-3 py-0.5 text-xs text-[var(--text-muted)]">
                  <MapPin size={11} /> Patna, Bihar
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-[var(--text-muted)]">Last Date</p>
            <p className="text-sm font-bold text-brand-crimson">{job.lastDate}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--text-muted)]">Experience: </span>
            <span className="font-medium text-[var(--text-primary)]">{job.experience}</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Qualification: </span>
            <span className="font-medium text-[var(--text-primary)]">{job.qualification}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-ghost flex items-center gap-1.5 px-4 py-2 text-sm"
          >
            {expanded ? "Less" : "More"} Details
            <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary py-2 text-sm"
          >
            <Send size={14} /> Apply Now
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--surface-border)]"
          >
            <div className="grid gap-6 p-6 sm:grid-cols-3">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-crimson">Description</h4>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{job.description}</p>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-crimson">Requirements</h4>
                <ul className="space-y-1">
                  {job.requirements.split("\n").map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-crimson" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-crimson">Responsibilities</h4>
                <ul className="space-y-1">
                  {job.responsibilities.split("\n").map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-crimson" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => !loading && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 shadow-glass-lg max-h-[90vh] overflow-y-auto"
            >
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-brand-teal" />
                  <h3 className="mb-2 font-display text-xl font-bold text-[var(--text-primary)]">Application Sent!</h3>
                  <p className="mb-6 text-[var(--text-secondary)]">Thank you for applying. We will contact you within 7 working days.</p>
                  <button onClick={() => { setShowForm(false); setSubmitted(false); }} className="btn-primary">Close</button>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Apply for {job.title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{job.department}</p>
                    </div>
                    <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Full Name *</label>
                        <input {...register("name")} placeholder="Your full name"
                          className={cn("input-field", errors.name && "border-red-400")} />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Email *</label>
                        <input {...register("email")} type="email" placeholder="email@example.com"
                          className={cn("input-field", errors.email && "border-red-400")} />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Phone *</label>
                        <input {...register("phone")} type="tel" placeholder="+91 XXXXX XXXXX"
                          className={cn("input-field", errors.phone && "border-red-400")} />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Qualification *</label>
                        <input {...register("qualification")} placeholder="e.g. M.Sc. + B.Ed."
                          className={cn("input-field", errors.qualification && "border-red-400")} />
                        {errors.qualification && <p className="mt-1 text-xs text-red-500">{errors.qualification.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Years of Experience</label>
                      <input {...register("experience")} placeholder="e.g. 3 years" className="input-field" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Cover Letter</label>
                      <textarea {...register("coverLetter")} rows={4} placeholder="Why are you the right fit for this role?"
                        className="input-field resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={15} /> Submit Application</>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-black pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(107,15,26,0.8),transparent)]" />
        <div className="container-aspcs relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-eyebrow mb-5 inline-flex"><Briefcase size={11} />Careers</span>
            <h1 className="font-display text-display-md font-bold text-white">
              Join Our <span className="text-brand-gold">Team</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-brand-slate">
              Be part of a passionate team shaping the future of education at ASPCS.
              We value dedication, creativity, and a love for teaching.
            </p>
          </motion.div>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {["Competitive Salary", "Professional Development", "Supportive Environment", "CBSE Affiliated", "Health Benefits"].map((perk) => (
              <span key={perk} className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-brand-slate">
                ✓ {perk}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Job listings */}
      <section className="section-pad">
        <div className="container-aspcs">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-display-xs font-bold text-[var(--text-primary)]">
                Current <span className="text-brand-crimson">Openings</span>
              </h2>
              <p className="mt-1 text-[var(--text-muted)]">{JOBS.length} positions available</p>
            </div>
          </div>

          <div className="space-y-4">
            {JOBS.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {/* No suitable position */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-8 text-center"
          >
            <h3 className="mb-2 font-display text-xl font-bold text-[var(--text-primary)]">
              Don&apos;t see a suitable role?
            </h3>
            <p className="mb-6 text-[var(--text-secondary)]">
              Send us your resume and we&apos;ll keep it on file for future openings.
            </p>
            <a href="mailto:hr@aspcspatna.ac.in" className="btn-primary">
              Send Resume to hr@aspcspatna.ac.in
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
