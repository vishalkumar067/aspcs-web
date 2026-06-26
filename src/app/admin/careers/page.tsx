"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray } from "@/lib/api";
import toast from "react-hot-toast";

interface Job {
  id: string; title: string; department: string; type: string;
  description: string; experience?: string; qualification?: string;
  salary?: string; lastDate?: string; vacancies: number; active: boolean; createdAt: string;
}
interface Application {
  id: string; jobId: string; jobTitle?: string; name: string; email: string;
  phone?: string; status: string; appliedAt: string;
}

const JOB_TYPES = ["FULL_TIME","PART_TIME","CONTRACT"];
const APP_STATUS_COLORS: Record<string,string> = {
  APPLIED:"bg-blue-50 text-blue-700 border-blue-200",
  SHORTLISTED:"bg-yellow-50 text-yellow-700 border-yellow-200",
  INTERVIEW:"bg-purple-50 text-purple-700 border-purple-200",
  SELECTED:"bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED:"bg-red-50 text-red-700 border-red-200",
};

function JobModal({ job, onClose, onSaved }: { job?: Job|null; onClose:()=>void; onSaved:()=>void }) {
  const [form, setForm] = useState({
    title: job?.title??"", department: job?.department??"", type: job?.type??"FULL_TIME",
    description: job?.description??"", experience: job?.experience??"",
    qualification: job?.qualification??"", salary: job?.salary??"",
    lastDate: job?.lastDate??"", vacancies: job?.vacancies??1, active: job?.active??true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title||!form.department||!form.description) { toast.error("Fill required fields"); return; }
    setSaving(true);
    try {
      job?.id
        ? await api.put(`/careers/admin/jobs/${job.id}`, form)
        : await api.post("/careers/admin/jobs", form);
      toast.success(job?.id?"Updated!":"Job posted!"); onSaved(); onClose();
    } catch (err: unknown) { toast.error(err instanceof Error?err.message:"Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}
        onClick={e=>e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{job?"Edit Job":"Post New Job"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18}/></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Job Title <span className="text-brand-gold">*</span></label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. PGT Mathematics"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Department <span className="text-brand-gold">*</span></label>
              <input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="e.g. Mathematics"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Type</label>
              <select data-theme="dark-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {JOB_TYPES.map(t=><option key={t} value={t}>{t.replace("_"," ")}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Description <span className="text-brand-gold">*</span></label>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Experience</label>
              <input value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} placeholder="e.g. 2+ years"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Salary</label>
              <input value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} placeholder="e.g. ₹30,000-40,000"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Vacancies</label>
              <input type="number" value={form.vacancies} onChange={e=>setForm({...form,vacancies:Number(e.target.value)})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Last Date</label>
              <input type="date" value={form.lastDate} onChange={e=>setForm({...form,lastDate:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white [color-scheme:dark] outline-none"/>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <div onClick={()=>setForm(f=>({...f,active:!f.active}))}
              className={cn("relative h-5 w-9 rounded-full transition-colors",form.active?"bg-brand-crimson":"bg-white/10")}>
              <div className={cn("absolute top-0 h-5 w-5 rounded-full bg-white shadow transition-transform",form.active?"translate-x-4":"translate-x-0")}/>
            </div>
            <span className="text-sm text-white/70">Active — visible on public careers page</span>
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>}
            {saving?"Saving...":job?"Update":"Post Job"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCareersPage() {
  const [jobs,  setJobs]  = useState<Job[]>([]);
  const [apps,  setApps]  = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [edit,    setEdit]    = useState<Job|null>(null);
  const [tab,     setTab]     = useState<"jobs"|"applications">("jobs");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobData, appData] = await Promise.allSettled([
        api.get<unknown>("/careers/admin/jobs?size=100"),
        api.get<unknown>("/careers/admin/applications?size=100"),
      ]);
      if (jobData.status==="fulfilled") setJobs(toArray<Job>(jobData.value));
      if (appData.status==="fulfilled") setApps(toArray<Application>(appData.value));
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchAll(); },[]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job listing?")) return;
    try { await api.delete(`/careers/admin/jobs/${id}`); toast.success("Deleted"); fetchAll(); }
    catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (job: Job) => {
    try { await api.patch(`/careers/admin/jobs/${job.id}/toggle`,{}); fetchAll(); toast.success(job.active?"Closed":"Reopened"); }
    catch { toast.error("Update failed"); }
  };

  const handleAppStatus = async (appId: string, status: string) => {
    try { await api.patch(`/careers/admin/applications/${appId}/status?status=${status}`,{}); fetchAll(); }
    catch { toast.error("Update failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Careers</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{jobs.filter(j=>j.active).length} active positions · {apps.length} applications</p>
        </div>
        <button onClick={()=>{setEdit(null);setModal(true);}} className="btn-primary py-2.5 text-sm">
          <Plus size={16}/> Post Job
        </button>
      </div>

      <div className="flex gap-2">
        {(["jobs","applications"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={cn("rounded-xl px-5 py-2 text-sm font-semibold transition-all capitalize",
              tab===t?"bg-brand-crimson text-white":"bg-white/5 text-brand-slate hover:text-white")}>
            {t} {t==="jobs"?`(${jobs.length})`:`(${apps.length})`}
          </button>
        ))}
      </div>

      {loading?(
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson"/></div>
      ) : tab==="jobs" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job,i)=>(
            <motion.div key={job.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              className="card p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/15">
                  <Briefcase size={18} className="text-brand-crimson"/>
                </div>
                <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                  job.active?"border-emerald-200 bg-emerald-50 text-emerald-700":"border-gray-200 bg-gray-50 text-gray-600")}>
                  {job.active?"Active":"Closed"}
                </span>
              </div>
              <h3 className="font-display font-bold text-[var(--text-primary)]">{job.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{job.department} · {job.type.replace("_"," ")}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><Users size={11}/>{job.vacancies} vacancies</span>
                {job.lastDate&&<span>Last: {new Date(job.lastDate).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={()=>handleToggle(job)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-brand-slate hover:text-white">
                  {job.active?<EyeOff size={12}/>:<Eye size={12}/>} {job.active?"Close":"Reopen"}
                </button>
                <button onClick={()=>{setEdit(job);setModal(true);}} className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-brand-gold"><Pencil size={14}/></button>
                <button onClick={()=>handleDelete(job.id)} className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-red-400"><Trash2 size={14}/></button>
              </div>
            </motion.div>
          ))}
          {jobs.length===0&&<div className="col-span-full rounded-2xl border border-white/8 py-16 text-center text-[var(--text-muted)]">No job listings yet.</div>}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Applicant","Position","Phone","Applied","Status","Action"].map(h=>(
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map((a,i)=>(
                <motion.tr key={a.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                  className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[var(--text-primary)]">{a.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{a.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--text-muted)]">{a.jobTitle??"-"}</td>
                  <td className="px-4 py-3.5 text-xs text-[var(--text-muted)]">{a.phone??"-"}</td>
                  <td className="px-4 py-3.5 text-xs text-[var(--text-muted)]">{new Date(a.appliedAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",APP_STATUS_COLORS[a.status]??"bg-gray-50 text-gray-600 border-gray-200")}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select data-theme="dark-select" value={a.status} onChange={e=>handleAppStatus(a.id,e.target.value)}
                      className="rounded-xl border border-white/10 bg-brand-black px-2 py-1.5 text-xs text-white outline-none">
                      {["APPLIED","SHORTLISTED","INTERVIEW","SELECTED","REJECTED"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {apps.length===0&&<div className="py-16 text-center text-[var(--text-muted)]">No applications yet.</div>}
        </div>
      )}

      <AnimatePresence>
        {modal&&<JobModal job={edit} onClose={()=>{setModal(false);setEdit(null);}} onSaved={fetchAll}/>}
      </AnimatePresence>
    </div>
  );
}
