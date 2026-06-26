"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Eye, X, ChevronDown, Phone, Mail, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Status = "PENDING" | "CONTACTED" | "SHORTLISTED" | "ADMITTED" | "REJECTED";
type Inquiry = {
  id: string; studentName: string; gradeApplying: string;
  parentName: string; parentEmail: string; parentPhone: string;
  status: Status; submittedAt: string; message?: string; address?: string;
};

const MOCK: Inquiry[] = [
  { id: "1", studentName: "Rohit Sharma",   gradeApplying: "Grade VI",  parentName: "Suresh Sharma",  parentEmail: "suresh@email.com",  parentPhone: "9876543210", status: "PENDING",     submittedAt: "2025-05-18" },
  { id: "2", studentName: "Priya Singh",    gradeApplying: "Nursery",   parentName: "Amit Singh",     parentEmail: "amit@email.com",    parentPhone: "9876543211", status: "CONTACTED",   submittedAt: "2025-05-17" },
  { id: "3", studentName: "Arjun Verma",    gradeApplying: "Grade IX",  parentName: "Rajesh Verma",   parentEmail: "rajesh@email.com",  parentPhone: "9876543212", status: "PENDING",     submittedAt: "2025-05-16" },
  { id: "4", studentName: "Sneha Gupta",    gradeApplying: "Grade I",   parentName: "Ramesh Gupta",   parentEmail: "ramesh@email.com",  parentPhone: "9876543213", status: "SHORTLISTED", submittedAt: "2025-05-15" },
  { id: "5", studentName: "Rahul Kumar",    gradeApplying: "Grade III", parentName: "Vijay Kumar",    parentEmail: "vijay@email.com",   parentPhone: "9876543214", status: "ADMITTED",    submittedAt: "2025-05-14" },
  { id: "6", studentName: "Anita Joshi",    gradeApplying: "Grade VII", parentName: "Mohan Joshi",    parentEmail: "mohan@email.com",   parentPhone: "9876543215", status: "REJECTED",    submittedAt: "2025-05-13" },
];

const statusColors: Record<Status, string> = {
  PENDING:     "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CONTACTED:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  SHORTLISTED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  ADMITTED:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  REJECTED:    "bg-red-500/15 text-red-400 border-red-500/30",
};

const statuses: Status[] = ["PENDING", "CONTACTED", "SHORTLISTED", "ADMITTED", "REJECTED"];

function DetailModal({ inquiry, onClose, onUpdateStatus }: {
  inquiry: Inquiry;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Status) => void;
}) {
  const [status, setStatus] = useState<Status>(inquiry.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">Inquiry Details</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          {/* Student */}
          <div className="rounded-xl bg-white/5 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">Student</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-crimson/20 font-bold text-brand-crimson">
                {inquiry.studentName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{inquiry.studentName}</p>
                <p className="flex items-center gap-1 text-xs text-brand-slate">
                  <GraduationCap size={11} />{inquiry.gradeApplying}
                </p>
              </div>
            </div>
          </div>

          {/* Parent */}
          <div className="rounded-xl bg-white/5 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">Parent / Guardian</p>
            <p className="mb-2 font-semibold text-white">{inquiry.parentName}</p>
            <a href={`tel:${inquiry.parentPhone}`} className="flex items-center gap-2 text-sm text-brand-slate hover:text-brand-gold">
              <Phone size={13} />{inquiry.parentPhone}
            </a>
            <a href={`mailto:${inquiry.parentEmail}`} className="flex items-center gap-2 text-sm text-brand-slate hover:text-brand-gold mt-1">
              <Mail size={13} />{inquiry.parentEmail}
            </a>
          </div>

          {/* Status update */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-slate">Update Status</p>
            <div className="relative">
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-slate" />
              <select
                data-theme="dark-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-brand-black px-4 py-3 text-sm text-white outline-none focus:border-brand-crimson/50"
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">
            Cancel
          </button>
          <button
            onClick={() => { onUpdateStatus(inquiry.id, status); onClose(); }}
            className="btn-primary flex-1 justify-center py-2.5 text-sm"
          >
            Update Status
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminAdmissionsPage() {
  const [inquiries, setInquiries]     = useState<Inquiry[]>(MOCK);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilter]     = useState<Status | "ALL">("ALL");
  const [selected, setSelected]       = useState<Inquiry | null>(null);

  const filtered = inquiries.filter((inq) => {
    const matchSearch = inq.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        inq.parentName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || inq.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: Status) => {
    setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, status } : inq));
    toast.success("Status updated successfully");
  };

  const counts = statuses.reduce((acc, s) => {
    acc[s] = inquiries.filter((inq) => inq.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-white">Admissions</h1>
        <p className="mt-1 text-sm text-brand-slate">{inquiries.length} total inquiries</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filterStatus === s ? "ALL" : s)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all",
              filterStatus === s ? statusColors[s] : "border-white/8 bg-white/3 hover:bg-white/5"
            )}
          >
            <p className="text-xs text-brand-slate">{s}</p>
            <p className="font-display text-2xl font-bold text-white">{counts[s]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Student", "Grade", "Parent", "Date", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((inq, i) => (
              <motion.tr
                key={inq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/5 transition-colors hover:bg-white/3"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-crimson/20 text-xs font-bold text-brand-crimson">
                      {inq.studentName.charAt(0)}
                    </div>
                    <span className="font-medium text-white">{inq.studentName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-brand-slate">{inq.gradeApplying}</td>
                <td className="px-5 py-4 text-brand-slate">{inq.parentName}</td>
                <td className="px-5 py-4 text-brand-slate">{inq.submittedAt}</td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", statusColors[inq.status])}>
                    {inq.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setSelected(inq)}
                    className="rounded-lg p-1.5 text-brand-slate transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-brand-slate">No inquiries found.</div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal
            inquiry={selected}
            onClose={() => setSelected(null)}
            onUpdateStatus={updateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
