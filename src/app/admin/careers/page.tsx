"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Job {
  id: string; title: string; department: string;
  type: string; vacancies: number; lastDate: string;
  active: boolean; applications: number;
}

const MOCK: Job[] = [
  { id: "1", title: "PGT Mathematics",      department: "Mathematics",    type: "FULL_TIME", vacancies: 2, lastDate: "2025-06-30", active: true,  applications: 5 },
  { id: "2", title: "TGT English",          department: "English",        type: "FULL_TIME", vacancies: 1, lastDate: "2025-06-30", active: true,  applications: 3 },
  { id: "3", title: "PRT Science",          department: "Science",        type: "FULL_TIME", vacancies: 2, lastDate: "2025-07-15", active: true,  applications: 7 },
  { id: "4", title: "Computer Science",     department: "Computer Science",type: "FULL_TIME", vacancies: 1, lastDate: "2025-07-31", active: false, applications: 2 },
];

function JobModal({ job, onClose, onSave }: {
  job?: Job | null; onClose: () => void; onSave: (data: Partial<Job>) => void;
}) {
  const [form, setForm] = useState({
    title:       job?.title       ?? "",
    department:  job?.department  ?? "",
    type:        job?.type        ?? "FULL_TIME",
    vacancies:   job?.vacancies   ?? 1,
    lastDate:    job?.lastDate    ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.department) { toast.error("Fill required fields"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    onSave(form);
    setSaving(false);
    toast.success(job ? "Job updated!" : "Job posted!");
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{job ? "Edit Job" : "Post New Job"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Job Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. PGT Mathematics"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Department *</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Science"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
                {["FULL_TIME", "PART_TIME", "CONTRACT"].map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Vacancies</label>
              <input type="number" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Last Date</label>
              <input type="date" value={form.lastDate} onChange={(e) => setForm({ ...form, lastDate: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : (job ? "Update" : "Post Job")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCareersPage() {
  const [jobs, setJobs]       = useState<Job[]>(MOCK);
  const [modal, setModal]     = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);

  const handleSave = (data: Partial<Job>) => {
    if (editJob) {
      setJobs((p) => p.map((j) => j.id === editJob.id ? { ...j, ...data } : j));
    } else {
      setJobs((p) => [{ id: Date.now().toString(), active: true, applications: 0, ...data } as Job, ...p]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Careers</h1>
          <p className="mt-1 text-sm text-brand-slate">{jobs.filter((j) => j.active).length} active positions</p>
        </div>
        <button onClick={() => { setEditJob(null); setModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Post Job
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, i) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card p-5">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/15">
                <Briefcase size={18} className="text-brand-crimson" />
              </div>
              <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                job.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-600")}>
                {job.active ? "Active" : "Closed"}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{job.title}</h3>
            <p className="text-sm text-[var(--text-muted)]">{job.department} · {job.type.replace("_", " ")}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <span>{job.vacancies} {job.vacancies === 1 ? "vacancy" : "vacancies"}</span>
              <span className="flex items-center gap-1"><Users size={11} />{job.applications} applications</span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Last date: {job.lastDate}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setJobs((p) => p.map((j) => j.id === job.id ? { ...j, active: !j.active } : j)); toast.success("Status updated"); }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-brand-slate hover:text-white">
                {job.active ? <EyeOff size={13} /> : <Eye size={13} />}
                {job.active ? "Close" : "Reopen"}
              </button>
              <button onClick={() => { setEditJob(job); setModal(true); }}
                className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-brand-gold"><Pencil size={14} /></button>
              <button onClick={() => { setJobs((p) => p.filter((j) => j.id !== job.id)); toast.success("Deleted"); }}
                className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal && <JobModal job={editJob} onClose={() => { setModal(false); setEditJob(null); }} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}
