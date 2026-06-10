"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Search, Pencil, Trash2,
  X, Save, Loader2, GraduationCap, Phone, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Gender = "MALE" | "FEMALE" | "OTHER";
type Status = "ACTIVE" | "INACTIVE" | "TRANSFERRED" | "PASSED_OUT";

interface Student {
  id: string; admissionNo: string; rollNo?: string;
  fullName: string; currentClass: string; section?: string;
  fatherName?: string; motherName?: string;
  guardianPhone: string; guardianEmail?: string;
  gender?: Gender; status: Status;
  dateOfBirth?: string; address?: string;
  city?: string; admissionDate?: string;
}

const MOCK: Student[] = [
  { id: "1", admissionNo: "ASPCS/2020/001", fullName: "Rahul Kumar Sharma",   currentClass: "Class X",  section: "A", fatherName: "Suresh Sharma",  guardianPhone: "9876543210", status: "ACTIVE",     gender: "MALE",   rollNo: "01" },
  { id: "2", admissionNo: "ASPCS/2021/042", fullName: "Priya Singh",          currentClass: "Class IX", section: "B", fatherName: "Amit Singh",    guardianPhone: "9876543211", status: "ACTIVE",     gender: "FEMALE", rollNo: "42" },
  { id: "3", admissionNo: "ASPCS/2019/018", fullName: "Arjun Verma",          currentClass: "Class X",  section: "A", fatherName: "Rajesh Verma",  guardianPhone: "9876543212", status: "TRANSFERRED",gender: "MALE",   rollNo: "18" },
  { id: "4", admissionNo: "ASPCS/2022/005", fullName: "Sneha Gupta",          currentClass: "Class VIII",section:"A", fatherName: "Ramesh Gupta",  guardianPhone: "9876543213", status: "ACTIVE",     gender: "FEMALE", rollNo: "05" },
  { id: "5", admissionNo: "ASPCS/2023/031", fullName: "Mohammad Aariz Khan",  currentClass: "Class VII",section: "B", fatherName: "Imran Khan",    guardianPhone: "9876543214", status: "ACTIVE",     gender: "MALE",   rollNo: "31" },
];

const statusColors: Record<Status, string> = {
  ACTIVE:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  INACTIVE:    "bg-gray-50 text-gray-600 border-gray-200",
  TRANSFERRED: "bg-amber-50 text-amber-700 border-amber-200",
  PASSED_OUT:  "bg-blue-50 text-blue-700 border-blue-200",
};

function StudentModal({ student, onClose, onSave }: {
  student?: Student | null;
  onClose: () => void;
  onSave: (data: Partial<Student>) => void;
}) {
  const [form, setForm] = useState({
    admissionNo:   student?.admissionNo   ?? "",
    rollNo:        student?.rollNo        ?? "",
    fullName:      student?.fullName      ?? "",
    currentClass:  student?.currentClass  ?? "",
    section:       student?.section       ?? "",
    fatherName:    student?.fatherName    ?? "",
    motherName:    student?.motherName    ?? "",
    guardianPhone: student?.guardianPhone ?? "",
    guardianEmail: student?.guardianEmail ?? "",
    gender:        (student?.gender ?? "MALE") as Gender,
    dateOfBirth:   student?.dateOfBirth   ?? "",
    address:       student?.address       ?? "",
    city:          student?.city          ?? "",
    admissionDate: student?.admissionDate ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.admissionNo || !form.fullName || !form.currentClass || !form.guardianPhone) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave(form);
    setSaving(false);
    toast.success(student ? "Student updated!" : "Student added!");
    onClose();
  };

  const field = (key: keyof typeof form, label: string, required = false, type = "text") => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white/80">
        {label}{required && <span className="ml-0.5 text-brand-gold">*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{student ? "Edit Student" : "Add Student"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field("admissionNo",   "Admission No", true)}
            {field("rollNo",        "Roll No")}
          </div>
          {field("fullName", "Full Name", true)}
          <div className="grid grid-cols-3 gap-4">
            {field("currentClass",  "Class",   true)}
            {field("section",       "Section")}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          {field("dateOfBirth", "Date of Birth", false, "date")}
          <div className="grid grid-cols-2 gap-4">
            {field("fatherName",  "Father's Name")}
            {field("motherName",  "Mother's Name")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("guardianPhone", "Guardian Phone", true, "tel")}
            {field("guardianEmail", "Guardian Email", false, "email")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("address",      "Address")}
            {field("city",         "City")}
          </div>
          {field("admissionDate", "Admission Date", false, "date")}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : (student ? "Update Student" : "Add Student")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminStudentsPage() {
  const [students, setStudents]     = useState<Student[]>(MOCK);
  const [search, setSearch]         = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");
  const [modal, setModal]           = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const filtered = students.filter((s) => {
    const matchSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                        s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
                        s.guardianPhone.includes(search);
    const matchClass  = !filterClass || s.currentClass === filterClass;
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const classes = [...new Set(students.map((s) => s.currentClass))].sort();

  const handleSave = (data: Partial<Student>) => {
    if (editStudent) {
      setStudents((prev) => prev.map((s) => s.id === editStudent.id ? { ...s, ...data } : s));
    } else {
      setStudents((prev) => [{ id: Date.now().toString(), status: "ACTIVE" as Status, ...data } as Student, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Students</h1>
          <p className="mt-1 text-sm text-brand-slate">
            {students.filter((s) => s.status === "ACTIVE").length} active · {students.length} total
          </p>
        </div>
        <button onClick={() => { setEditStudent(null); setModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["ALL", "ACTIVE", "TRANSFERRED", "PASSED_OUT"] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s === "ALL" ? "ALL" : s as Status)}
            className={cn("rounded-xl border p-3 text-left transition-all",
              filterStatus === s ? "border-brand-crimson/40 bg-brand-crimson/10" : "border-white/8 bg-white/3 hover:bg-white/5"
            )}>
            <p className="text-xs text-brand-slate">{s}</p>
            <p className="font-display text-2xl font-bold text-white">
              {s === "ALL" ? students.length : students.filter((st) => st.status === s).length}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, admission no, phone..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
        </div>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          <option value="">All Classes</option>
          {classes.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Student", "Admission No", "Class", "Guardian", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((student, i) => (
              <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 transition-colors hover:bg-white/3">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-crimson/20 text-sm font-bold text-brand-crimson">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{student.fullName}</p>
                      <p className="text-xs text-brand-slate">{student.gender}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-brand-slate font-mono text-xs">{student.admissionNo}</td>
                <td className="px-5 py-4 text-white">{student.currentClass}{student.section ? ` - ${student.section}` : ""}</td>
                <td className="px-5 py-4">
                  <p className="text-white">{student.fatherName ?? "—"}</p>
                  <p className="flex items-center gap-1 text-xs text-brand-slate"><Phone size={10} />{student.guardianPhone}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", statusColors[student.status])}>
                    {student.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditStudent(student); setModal(true); }}
                      className="rounded-lg p-1.5 text-brand-slate hover:bg-white/5 hover:text-brand-gold">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => { setStudents((p) => p.filter((s) => s.id !== student.id)); toast.success("Student removed"); }}
                      className="rounded-lg p-1.5 text-brand-slate hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-brand-slate">No students found.</div>}
      </div>

      <AnimatePresence>
        {modal && <StudentModal student={editStudent} onClose={() => { setModal(false); setEditStudent(null); }} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}
