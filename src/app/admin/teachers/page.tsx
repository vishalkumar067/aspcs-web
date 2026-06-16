"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Save, Loader2, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray } from "@/lib/api";
import toast from "react-hot-toast";

interface Teacher {
  id: string; employeeId: string; fullName: string; email?: string;
  phone: string; designation?: string; department?: string;
  qualification?: string; joiningDate?: string; active: boolean;
}

const DESIGNATIONS = ["PGT","TGT","PRT","OTHER"];
const DEPARTMENTS  = ["Administration","English","Hindi","Mathematics","Science","Social Science","Computer Science","Physical Education","Sanskrit","Primary","Arts"];
const DESIG_COLORS: Record<string,string> = {
  PGT:"bg-violet-50 text-violet-700 border-violet-200",
  TGT:"bg-blue-50 text-blue-700 border-blue-200",
  PRT:"bg-emerald-50 text-emerald-700 border-emerald-200",
  OTHER:"bg-gray-50 text-gray-600 border-gray-200",
};

function TeacherModal({ teacher, onClose, onSaved }: { teacher?: Teacher|null; onClose:()=>void; onSaved:()=>void }) {
  const [form, setForm] = useState({
    employeeId: teacher?.employeeId??"", fullName: teacher?.fullName??"",
    email: teacher?.email??"", phone: teacher?.phone??"",
    designation: teacher?.designation??"TGT", department: teacher?.department??"",
    qualification: teacher?.qualification??"", joiningDate: teacher?.joiningDate??"",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.employeeId||!form.fullName||!form.phone) { toast.error("Fill required fields"); return; }
    setSaving(true);
    try {
      teacher?.id ? await api.put(`/teachers/${teacher.id}`,form) : await api.post("/teachers",form);
      toast.success(teacher?.id?"Updated!":"Teacher added!"); onSaved(); onClose();
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
          <h3 className="font-display text-lg font-bold text-white">{teacher?"Edit Teacher":"Add Teacher"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18}/></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Employee ID <span className="text-brand-gold">*</span></label>
              <input value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Phone <span className="text-brand-gold">*</span></label>
              <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Full Name <span className="text-brand-gold">*</span></label>
            <input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Email</label>
            <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Designation</label>
              <select value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {DESIGNATIONS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Department</label>
              <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Select...</option>
                {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Qualification</label>
            <input value={form.qualification} onChange={e=>setForm({...form,qualification:e.target.value})}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Joining Date</label>
            <input type="date" value={form.joiningDate} onChange={e=>setForm({...form,joiningDate:e.target.value})}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white [color-scheme:dark] outline-none"/>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>}
            {saving?"Saving...":teacher?"Update":"Add Teacher"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [dept,     setDept]     = useState("");
  const [modal,    setModal]    = useState(false);
  const [edit,     setEdit]     = useState<Teacher|null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({size:"100"});
      if (search) q.set("search",search);
      if (dept)   q.set("department",dept);
      setTeachers(toArray<Teacher>(await api.get(`/teachers?${q}`)));
    } catch { toast.error("Failed to load teachers"); setTeachers([]); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchTeachers(); },[search,dept]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this teacher?")) return;
    try { await api.delete(`/teachers/${id}`); toast.success("Deleted"); fetchTeachers(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Teachers</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{teachers.filter(t=>t.active).length} active · {teachers.length} total</p>
        </div>
        <button onClick={()=>{setEdit(null);setModal(true);}} className="btn-primary py-2.5 text-sm">
          <Plus size={16}/> Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {DESIGNATIONS.map(d=>(
          <div key={d} onClick={()=>setDept(dept===d?"":d)}
            className={cn("cursor-pointer rounded-xl border p-4 transition-all",
              dept===d?"border-brand-crimson/40 bg-brand-crimson/10":"border-white/8 bg-white/3")}>
            <p className="text-xs text-[var(--text-muted)]">{d}</p>
            <p className="font-display text-2xl font-bold text-[var(--text-primary)]">{teachers.filter(t=>t.designation===d).length}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or ID..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"/>
        </div>
        <select value={dept} onChange={e=>setDept(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading?(
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson"/></div>
      ):(
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Teacher","Employee ID","Designation","Department","Contact","Status",""].map(h=>(
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map((t,i)=>(
                <motion.tr key={t.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                  className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-crimson/20 text-sm font-bold text-brand-crimson">
                        {t.fullName.charAt(0)}
                      </div>
                      <p className="font-semibold text-[var(--text-primary)]">{t.fullName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-[var(--text-muted)]">{t.employeeId}</td>
                  <td className="px-4 py-3.5">
                    {t.designation&&<span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",DESIG_COLORS[t.designation]??"bg-gray-50 text-gray-600 border-gray-200")}>{t.designation}</span>}
                  </td>
                  <td className="px-4 py-3.5 text-[var(--text-muted)]">{t.department??"-"}</td>
                  <td className="px-4 py-3.5">
                    <p className="flex items-center gap-1 text-xs text-[var(--text-muted)]"><Phone size={10}/>{t.phone}</p>
                    {t.email&&<p className="flex items-center gap-1 text-xs text-[var(--text-muted)]"><Mail size={10}/>{t.email}</p>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                      t.active?"border-emerald-200 bg-emerald-50 text-emerald-700":"border-gray-200 bg-gray-50 text-gray-600")}>
                      {t.active?"Active":"Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={()=>{setEdit(t);setModal(true);}} className="rounded-lg p-1.5 text-brand-slate hover:text-brand-gold"><Pencil size={14}/></button>
                      <button onClick={()=>handleDelete(t.id)} className="rounded-lg p-1.5 text-brand-slate hover:text-red-400"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {teachers.length===0&&!loading&&<div className="py-16 text-center text-[var(--text-muted)]">No teachers yet.</div>}
        </div>
      )}

      <AnimatePresence>
        {modal&&<TeacherModal teacher={edit} onClose={()=>{setModal(false);setEdit(null);}} onSaved={fetchTeachers}/>}
      </AnimatePresence>
    </div>
  );
}
