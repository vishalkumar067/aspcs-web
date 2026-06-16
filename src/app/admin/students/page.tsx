"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Save, Loader2, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray } from "@/lib/api";
import toast from "react-hot-toast";

interface Student {
  id: string; admissionNo: string; fullName: string; currentClass: string;
  section?: string; gender?: string; fatherName?: string; motherName?: string;
  guardianPhone: string; status: string; photoUrl?: string; createdAt: string;
}

const CLASSES   = ["Nursery","KG I","KG II","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X"];
const GENDERS   = ["Male","Female","Other"];
const CATEGORIES= ["GEN","OBC","SC","ST"];
const SECTIONS  = ["A","B","C","D"];

function StudentModal({ student, onClose, onSaved }: { student?: Student|null; onClose:()=>void; onSaved:()=>void }) {
  const [form, setForm] = useState({
    admissionNo: student?.admissionNo??"", fullName: student?.fullName??"",
    currentClass: student?.currentClass??"", section: student?.section??"A",
    gender: student?.gender??"Male", fatherName: student?.fatherName??"",
    motherName: student?.motherName??"", guardianPhone: student?.guardianPhone??"",
    category:"GEN", address:"",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.admissionNo||!form.fullName||!form.currentClass||!form.guardianPhone) {
      toast.error("Fill all required fields"); return;
    }
    setSaving(true);
    try {
      student?.id ? await api.put(`/students/${student.id}`,form) : await api.post("/students",form);
      toast.success(student?.id?"Updated!":"Student enrolled!"); onSaved(); onClose();
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
          <h3 className="font-display text-lg font-bold text-white">{student?"Edit Student":"Enroll Student"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18}/></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Admission No <span className="text-brand-gold">*</span></label>
              <input value={form.admissionNo} onChange={e=>setForm({...form,admissionNo:e.target.value})} disabled={!!student}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50 disabled:opacity-50"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Guardian Phone <span className="text-brand-gold">*</span></label>
              <input type="tel" value={form.guardianPhone} onChange={e=>setForm({...form,guardianPhone:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Full Name <span className="text-brand-gold">*</span></label>
            <input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Class <span className="text-brand-gold">*</span></label>
              <select value={form.currentClass} onChange={e=>setForm({...form,currentClass:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Select</option>
                {CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Section</label>
              <select value={form.section} onChange={e=>setForm({...form,section:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {SECTIONS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Gender</label>
              <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {GENDERS.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Father's Name</label>
              <input value={form.fatherName} onChange={e=>setForm({...form,fatherName:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Mother's Name</label>
              <input value={form.motherName} onChange={e=>setForm({...form,motherName:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Address</label>
              <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>}
            {saving?"Saving...":student?"Update":"Enroll"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [cls,      setCls]      = useState("");
  const [modal,    setModal]    = useState(false);
  const [edit,     setEdit]     = useState<Student|null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({size:"100"});
      if (search) q.set("search",search);
      if (cls)    q.set("cls",cls);
      setStudents(toArray<Student>(await api.get(`/students?${q}`)));
    } catch { toast.error("Failed to load students"); setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchStudents(); },[search,cls]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this student?")) return;
    try { await api.delete(`/students/${id}`); toast.success("Removed"); fetchStudents(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Students</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{students.length} enrolled</p>
        </div>
        <button onClick={()=>{setEdit(null);setModal(true);}} className="btn-primary py-2.5 text-sm">
          <Plus size={16}/> Enroll Student
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or admission no..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"/>
        </div>
        <select value={cls} onChange={e=>setCls(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          <option value="">All Classes</option>
          {CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading?(
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson"/></div>
      ):(
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Student","Admission No","Class","Guardian","Status",""].map(h=>(
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s,i)=>(
                <motion.tr key={s.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}
                  className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-crimson/20 text-sm font-bold text-brand-crimson">
                        {s.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{s.fullName}</p>
                        {s.fatherName&&<p className="text-xs text-[var(--text-muted)]">S/D of {s.fatherName}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-[var(--text-muted)]">{s.admissionNo}</td>
                  <td className="px-4 py-3.5 text-[var(--text-primary)]">
                    {s.currentClass}{s.section?` - ${s.section}`:""}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="flex items-center gap-1 text-xs text-[var(--text-muted)]"><Phone size={10}/>{s.guardianPhone}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                      s.status==="ACTIVE"?"border-emerald-200 bg-emerald-50 text-emerald-700":"border-gray-200 bg-gray-50 text-gray-600")}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={()=>{setEdit(s);setModal(true);}} className="rounded-lg p-1.5 text-brand-slate hover:text-brand-gold"><Pencil size={14}/></button>
                      <button onClick={()=>handleDelete(s.id)} className="rounded-lg p-1.5 text-brand-slate hover:text-red-400"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {students.length===0&&!loading&&<div className="py-16 text-center text-[var(--text-muted)]">No students enrolled yet.</div>}
        </div>
      )}

      <AnimatePresence>
        {modal&&<StudentModal student={edit} onClose={()=>{setModal(false);setEdit(null);}} onSaved={fetchStudents}/>}
      </AnimatePresence>
    </div>
  );
}
