"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Search, Pencil, Trash2, X, Save, Loader2, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Designation = "PGT" | "TGT" | "PRT" | "OTHER";

interface Teacher {
  id: string; employeeId: string; fullName: string;
  email?: string; phone: string; designation?: Designation;
  department?: string; qualification?: string;
  joiningDate?: string; active: boolean;
}

const MOCK: Teacher[] = [
  { id: "1", employeeId: "ASPCS/T/001", fullName: "Mr. Om Prakash Singh",   phone: "9876543210", designation: "PGT", department: "Administration", qualification: "M.Sc., B.Ed.", active: true },
  { id: "2", employeeId: "ASPCS/T/002", fullName: "Mrs. Sunita Sharma",     phone: "9876543211", designation: "TGT", department: "English",        qualification: "M.A., B.Ed.",  active: true },
  { id: "3", employeeId: "ASPCS/T/003", fullName: "Mr. Rajesh Kumar",       phone: "9876543212", designation: "PGT", department: "Science",        qualification: "M.Sc., B.Ed.", active: true },
  { id: "4", employeeId: "ASPCS/T/004", fullName: "Mrs. Priya Verma",       phone: "9876543213", designation: "TGT", department: "Mathematics",    qualification: "M.Sc., B.Ed.", active: true },
  { id: "5", employeeId: "ASPCS/T/005", fullName: "Mr. Amit Gupta",         phone: "9876543214", designation: "PRT", department: "Primary",        qualification: "B.Sc., B.Ed.", active: false },
];

const designations: Designation[] = ["PGT", "TGT", "PRT", "OTHER"];
const departments = ["Administration", "English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Science", "Physical Education", "Sanskrit", "Primary", "Arts"];

const desigColors: Record<Designation, string> = {
  PGT:   "bg-violet-50 text-violet-700 border-violet-200",
  TGT:   "bg-blue-50 text-blue-700 border-blue-200",
  PRT:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  OTHER: "bg-gray-50 text-gray-600 border-gray-200",
};

function TeacherModal({ teacher, onClose, onSave }: {
  teacher?: Teacher | null; onClose: () => void; onSave: (data: Partial<Teacher>) => void;
}) {
  const [form, setForm] = useState({
    employeeId:    teacher?.employeeId    ?? "",
    fullName:      teacher?.fullName      ?? "",
    email:         teacher?.email         ?? "",
    phone:         teacher?.phone         ?? "",
    designation:   (teacher?.designation  ?? "TGT") as Designation,
    department:    teacher?.department    ?? "",
    qualification: teacher?.qualification ?? "",
    joiningDate:   teacher?.joiningDate   ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.employeeId || !form.fullName || !form.phone) { toast.error("Fill required fields"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    onSave(form);
    setSaving(false);
    toast.success(teacher ? "Teacher updated!" : "Teacher added!");
    onClose();
  };

  const f = (key: keyof typeof form, label: string, req = false, type = "text") => (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/70">{label}{req && <span className="ml-0.5 text-brand-gold">*</span>}</label>
      <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{teacher ? "Edit Teacher" : "Add Teacher"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {f("employeeId", "Employee ID", true)}
            {f("phone",      "Phone",       true, "tel")}
          </div>
          {f("fullName", "Full Name", true)}
          {f("email", "Email", false, "email")}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Designation</label>
              <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value as Designation })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {designations.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Select...</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          {f("qualification", "Qualification")}
          {f("joiningDate",   "Joining Date", false, "date")}
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : (teacher ? "Update" : "Add Teacher")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers]     = useState<Teacher[]>(MOCK);
  const [search, setSearch]         = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [modal, setModal]           = useState(false);
  const [editTeacher, setEdit]      = useState<Teacher | null>(null);

  const filtered = teachers.filter((t) => {
    const matchS = !search || t.fullName.toLowerCase().includes(search.toLowerCase()) || t.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchD = !filterDept || t.department === filterDept;
    return matchS && matchD;
  });

  const handleSave = (data: Partial<Teacher>) => {
    if (editTeacher) {
      setTeachers((p) => p.map((t) => t.id === editTeacher.id ? { ...t, ...data } : t));
    } else {
      setTeachers((p) => [{ id: Date.now().toString(), active: true, ...data } as Teacher, ...p]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Teachers</h1>
          <p className="mt-1 text-sm text-brand-slate">{teachers.filter((t) => t.active).length} active · {teachers.length} total</p>
        </div>
        <button onClick={() => { setEdit(null); setModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {(["PGT", "TGT", "PRT", "OTHER"] as Designation[]).map((d) => (
          <div key={d} className={cn("rounded-xl border p-4 cursor-pointer transition-all", filterDept === d ? "border-brand-crimson/40 bg-brand-crimson/10" : "border-white/8 bg-white/3")}
            onClick={() => setFilterDept(filterDept === d ? "" : d)}>
            <p className="text-xs text-brand-slate">{d}</p>
            <p className="font-display text-2xl font-bold text-white">{teachers.filter((t) => t.designation === d).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
        </div>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Teacher", "Employee ID", "Designation", "Department", "Contact", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-crimson/20 text-sm font-bold text-brand-crimson">
                      {t.fullName.charAt(0)}
                    </div>
                    <p className="font-semibold text-white">{t.fullName}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-brand-slate">{t.employeeId}</td>
                <td className="px-4 py-3.5">
                  {t.designation && (
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", desigColors[t.designation])}>
                      {t.designation}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-brand-slate">{t.department ?? "—"}</td>
                <td className="px-4 py-3.5">
                  <p className="flex items-center gap-1 text-xs text-brand-slate"><Phone size={10} />{t.phone}</p>
                  {t.email && <p className="flex items-center gap-1 text-xs text-brand-slate"><Mail size={10} />{t.email}</p>}
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                    t.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200")}>
                    {t.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <button onClick={() => { setEdit(t); setModal(true); }} className="rounded-lg p-1.5 text-brand-slate hover:text-brand-gold"><Pencil size={14} /></button>
                    <button onClick={() => { setTeachers((p) => p.filter((x) => x.id !== t.id)); toast.success("Removed"); }} className="rounded-lg p-1.5 text-brand-slate hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-brand-slate">No teachers found.</div>}
      </div>

      <AnimatePresence>
        {modal && <TeacherModal teacher={editTeacher} onClose={() => { setModal(false); setEdit(null); }} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}
