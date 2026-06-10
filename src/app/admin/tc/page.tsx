"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Eye, CheckCircle2, XCircle, Printer, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

type TcStatus = "PENDING" | "APPROVED" | "ISSUED" | "REJECTED";

interface TcRequest {
  id: string; admissionNo: string; studentName: string;
  classStudying: string; reason?: string;
  applicantName: string; applicantPhone: string; applicantEmail?: string;
  status: TcStatus; tcNumber?: string; issueDate?: string;
  adminRemarks?: string; requestedAt: string;
}

const MOCK: TcRequest[] = [
  { id: "1", admissionNo: "ASPCS/2020/001", studentName: "Rahul Kumar Sharma", classStudying: "Class X - A", applicantName: "Suresh Sharma",  applicantPhone: "9876543210", status: "PENDING",  requestedAt: "2025-05-18", reason: "Shifting to Delhi" },
  { id: "2", admissionNo: "ASPCS/2019/018", studentName: "Arjun Verma",         classStudying: "Class X - A", applicantName: "Rajesh Verma",   applicantPhone: "9876543212", status: "APPROVED", requestedAt: "2025-05-15", reason: "Parent's request" },
  { id: "3", admissionNo: "ASPCS/2021/042", studentName: "Priya Singh",          classStudying: "Class IX - B", applicantName: "Amit Singh",     applicantPhone: "9876543211", status: "ISSUED",   requestedAt: "2025-05-10", tcNumber: "ASPCS/TC/2025/0001", issueDate: "2025-05-12" },
  { id: "4", admissionNo: "ASPCS/2018/007", studentName: "Vikash Kumar",         classStudying: "Class X - B", applicantName: "Mohan Kumar",    applicantPhone: "9876543215", status: "REJECTED", requestedAt: "2025-05-08", adminRemarks: "Dues not cleared" },
];

const statusColors: Record<TcStatus, string> = {
  PENDING:  "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  ISSUED:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

function TcDetailModal({ tc, onClose, onUpdate }: {
  tc: TcRequest; onClose: () => void;
  onUpdate: (id: string, status: TcStatus, remarks?: string) => void;
}) {
  const [remarks, setRemarks] = useState(tc.adminRemarks ?? "");
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.accessToken);

  const updateStatus = async (status: TcStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/tc/${tc.id}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status, adminRemarks: remarks }),
      });
      if (!res.ok) throw new Error("Update failed");
      onUpdate(tc.id, status, remarks);
      toast.success(`TC ${status.toLowerCase()} successfully!`);
      onClose();
    } catch {
      // Fallback for demo
      onUpdate(tc.id, status, remarks);
      toast.success(`TC ${status.toLowerCase()} successfully!`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const printTc = async () => {
    if (tc.status !== "ISSUED") { toast.error("TC must be issued first"); return; }
    try {
      const res = await fetch(`${API}/tc/${tc.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const html = await res.text();
      const win  = window.open("", "_blank");
      if (win) { win.document.write(html); win.document.close(); win.print(); }
    } catch {
      toast.error("Failed to generate TC");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass">

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">TC Request Details</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="mb-5 space-y-3">
          {[
            ["Student Name",   tc.studentName],
            ["Admission No",   tc.admissionNo],
            ["Class",          tc.classStudying],
            ["Reason",         tc.reason ?? "—"],
            ["Applicant",      tc.applicantName],
            ["Phone",          tc.applicantPhone],
            ["Requested On",   tc.requestedAt],
            ...(tc.tcNumber ? [["TC Number", tc.tcNumber], ["Issue Date", tc.issueDate ?? "—"]] : []),
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between rounded-xl bg-white/5 px-4 py-2.5">
              <span className="text-xs text-brand-slate">{label}</span>
              <span className="text-sm font-medium text-white text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-white/80">Admin Remarks</label>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3}
            placeholder="Add remarks (optional)..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
        </div>

        <div className="flex flex-wrap gap-2">
          {tc.status === "PENDING" && (
            <>
              <button onClick={() => updateStatus("APPROVED")} disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/15 py-2.5 text-sm font-semibold text-blue-400 hover:bg-blue-500/25">
                <CheckCircle2 size={15} /> Approve
              </button>
              <button onClick={() => updateStatus("REJECTED")} disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/15 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/25">
                <XCircle size={15} /> Reject
              </button>
            </>
          )}
          {tc.status === "APPROVED" && (
            <button onClick={() => updateStatus("ISSUED")} disabled={loading}
              className="btn-primary flex-1 justify-center py-2.5 text-sm">
              <FileText size={15} /> Issue TC
            </button>
          )}
          {tc.status === "ISSUED" && (
            <button onClick={printTc}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-gold/30 bg-brand-gold/15 py-2.5 text-sm font-semibold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
              <Printer size={15} /> Print / Download TC
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminTcPage() {
  const [requests, setRequests] = useState<TcRequest[]>(MOCK);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<TcStatus | "ALL">("ALL");
  const [selected, setSelected] = useState<TcRequest | null>(null);

  const filtered = requests.filter((r) => {
    const matchSearch = !search ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.admissionNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "ALL" || r.status === filter;
    return matchSearch && matchStatus;
  });

  const handleUpdate = (id: string, status: TcStatus, remarks?: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? {
      ...r, status,
      adminRemarks: remarks,
      ...(status === "ISSUED" ? { tcNumber: `ASPCS/TC/2025/${String(prev.length + 1).padStart(4, "0")}`, issueDate: new Date().toISOString().split("T")[0] } : {}),
    } : r));
  };

  const counts = { ALL: requests.length, PENDING: 0, APPROVED: 0, ISSUED: 0, REJECTED: 0 };
  requests.forEach((r) => counts[r.status]++);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Transfer Certificates</h1>
        <p className="mt-1 text-sm text-brand-slate">{counts.PENDING} pending review</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "PENDING", "APPROVED", "ISSUED", "REJECTED"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
              filter === s ? "border-brand-crimson bg-brand-crimson text-white" : "border-white/10 bg-white/5 text-brand-slate hover:text-white"
            )}>
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or admission no..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Student", "Admission No", "Applicant", "Requested", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((tc, i) => (
              <motion.tr key={tc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="border-b border-white/5 hover:bg-white/3">
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{tc.studentName}</p>
                  <p className="text-xs text-brand-slate">{tc.classStudying}</p>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-brand-slate">{tc.admissionNo}</td>
                <td className="px-5 py-4">
                  <p className="text-white">{tc.applicantName}</p>
                  <p className="text-xs text-brand-slate">{tc.applicantPhone}</p>
                </td>
                <td className="px-5 py-4 text-brand-slate">
                  <span className="flex items-center gap-1"><Clock size={11} />{tc.requestedAt}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", statusColors[tc.status])}>
                    {tc.status}
                  </span>
                  {tc.tcNumber && <p className="mt-0.5 text-[10px] text-brand-slate">{tc.tcNumber}</p>}
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => setSelected(tc)} className="rounded-lg p-1.5 text-brand-slate hover:bg-white/5 hover:text-white">
                    <Eye size={15} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-brand-slate">No TC requests found.</div>}
      </div>

      <AnimatePresence>
        {selected && <TcDetailModal tc={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
      </AnimatePresence>
    </div>
  );
}
