"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Save, Loader2, GraduationCap } from "lucide-react";
import { api, toArray, unwrapData } from "@/lib/api";
import toast from "react-hot-toast";

const CLASSES = ["Nursery","KG I","KG II","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X"];
const SECTIONS = ["A","B","C","D"];

interface Assignment { id: string; teacherId: string; teacherName: string; teacherEmployeeId: string; className: string; section: string; academicYear: string; }
interface Teacher { id: string; fullName: string; employeeId: string; }

export default function ClassTeacherPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ teacherId: "", className: "", section: "", academicYear: "2026-27" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [aRes, tRes] = await Promise.all([
        api.get("/class-teachers"),
        api.get("/teachers?size=200"),
      ]);
      setAssignments(toArray(aRes));
      const tData = unwrapData<{ content?: Teacher[] }>(tRes);
      setTeachers(tData?.content ?? toArray(tRes));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async () => {
    if (!form.teacherId || !form.className || !form.section) {
      toast.error("Please select teacher, class, and section");
      return;
    }
    setSaving(true);
    try {
      await api.post("/class-teachers", form);
      toast.success("Class teacher assigned");
      setModal(false);
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Assignment failed");
    } finally { setSaving(false); }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this class teacher assignment?")) return;
    try {
      await api.delete(`/class-teachers/${id}`);
      toast.success("Assignment removed");
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Remove failed");
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-brand-crimson" size={28} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Class Teachers</h1>
          <p className="mt-1 text-sm text-brand-slate">{assignments.length} assignments</p>
        </div>
        <button onClick={() => { setForm({ teacherId: "", className: "", section: "", academicYear: "2026-27" }); setModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Assign Class Teacher
        </button>
      </div>

      {/* Assignments table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Teacher", "Employee ID", "Class", "Section", "Year", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id} className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-white">{a.teacherName ?? "-"}</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-slate">{a.teacherEmployeeId ?? "-"}</td>
                <td className="px-4 py-3 text-white">{a.className}</td>
                <td className="px-4 py-3 text-white">{a.section}</td>
                <td className="px-4 py-3 text-brand-slate">{a.academicYear}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleRemove(a.id)} title="Remove"
                    className="rounded-lg p-1.5 text-brand-slate hover:bg-white/10 hover:text-red-400"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-brand-slate">No class teachers assigned yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass"
              onClick={e => e.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">Assign Class Teacher</h2>
                <button onClick={() => setModal(false)} className="text-brand-slate hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Teacher</label>
                  <select data-theme="dark-select" value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                    <option value="">Select teacher...</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.employeeId})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">Class</label>
                    <select data-theme="dark-select" value={form.className} onChange={e => setForm({ ...form, className: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                      <option value="">Select...</option>
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">Section</label>
                    <select data-theme="dark-select" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                      <option value="">Select...</option>
                      {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button onClick={() => setModal(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white hover:bg-white/5">Cancel</button>
                <button onClick={handleAssign} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <GraduationCap size={14} />}
                  Assign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
