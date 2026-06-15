"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, Eye, X, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray } from "@/lib/api";
import toast from "react-hot-toast";

interface TcRequest {
  id: string;
  admissionNo: string;
  studentName: string;
  classStudying?: string;
  reason?: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ISSUED";
  tcNumber?: string;
  issueDate?: string;
  adminRemarks?: string;
  requestedAt: string;
}

const STATUS_CONFIG = {
  PENDING:  { label: "Pending",  color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  APPROVED: { label: "Approved", color: "bg-blue-50 text-blue-700 border-blue-200" },
  ISSUED:   { label: "Issued",   color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
};

// ─── Detail / Update Modal ────────────────────────────────────────────────────
function TcModal({ tc, onClose, onSaved }: {
  tc: TcRequest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status,   setStatus]   = useState<TcRequest["status"]>(tc.status);
  const [remarks,  setRemarks]  = useState(tc.adminRemarks ?? "");
  const [tcNumber, setTcNumber] = useState(tc.tcNumber ?? "");
  const [saving,   setSaving]   = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.patch(`/tc/${tc.id}/status`, {
        status,
        adminRemarks: remarks,
        tcNumber:     tcNumber || undefined,
        issueDate:    status === "ISSUED" ? new Date().toISOString().split("T")[0] : undefined,
      });
      toast.success("TC request updated!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">TC Request Details</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        {/* Student Info */}
        <div className="mb-4 rounded-2xl bg-white/5 p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-slate">Student</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-white/50">Name</span><p className="text-white font-medium">{tc.studentName}</p></div>
            <div><span className="text-white/50">Adm. No</span><p className="text-white font-medium">{tc.admissionNo}</p></div>
            <div><span className="text-white/50">Class</span><p className="text-white">{tc.classStudying ?? "—"}</p></div>
            <div><span className="text-white/50">Requested</span><p className="text-white">{new Date(tc.requestedAt).toLocaleDateString("en-IN")}</p></div>
          </div>
          {tc.reason && <div><span className="text-xs text-white/50">Reason</span><p className="text-sm text-white">{tc.reason}</p></div>}
        </div>

        {/* Applicant Info */}
        <div className="mb-4 rounded-2xl bg-white/5 p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-slate">Applicant</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-white/50">Name</span><p className="text-white">{tc.applicantName}</p></div>
            <div><span className="text-white/50">Phone</span><p className="text-white">{tc.applicantPhone}</p></div>
            {tc.applicantEmail && <div className="col-span-2"><span className="text-white/50">Email</span><p className="text-white">{tc.applicantEmail}</p></div>}
          </div>
        </div>

        {/* Update Status */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Update Status</label>
            <div className="grid grid-cols-2 gap-2">
              {(["PENDING","APPROVED","ISSUED","REJECTED"] as const).map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={cn("rounded-xl border py-2 text-xs font-semibold transition-all",
                    status === s ? "border-brand-crimson bg-brand-crimson text-white" : "border-white/10 text-brand-slate hover:border-white/20")}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {status === "ISSUED" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">TC Number</label>
              <input value={tcNumber} onChange={e => setTcNumber(e.target.value)}
                placeholder="e.g. TC-2025-001"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Admin Remarks</label>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
              rows={2} placeholder="Optional remarks..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleUpdate} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : null}
            {saving ? "Saving..." : "Update Status"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminTcPage() {
  const [requests,  setRequests]  = useState<TcRequest[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<TcRequest | null>(null);
  const [filter,    setFilter]    = useState<string>("ALL");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const raw = await api.get<unknown>("/tc?size=100");
      setRequests(toArray<TcRequest>(raw));
    } catch {
      toast.error("Failed to load TC requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const counts = {
    ALL:      requests.length,
    PENDING:  requests.filter(r => r.status === "PENDING").length,
    APPROVED: requests.filter(r => r.status === "APPROVED").length,
    ISSUED:   requests.filter(r => r.status === "ISSUED").length,
    REJECTED: requests.filter(r => r.status === "REJECTED").length,
  };

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">TC Requests</h1>
        <p className="mt-1 text-sm text-brand-slate">{counts.PENDING} pending · {counts.ISSUED} issued</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["ALL","PENDING","APPROVED","ISSUED","REJECTED"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              filter === s ? "bg-brand-crimson text-white" : "bg-white/5 text-brand-slate hover:bg-white/10")}>
            {s === "ALL" ? "All" : STATUS_CONFIG[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Student", "Adm. No", "Applicant", "Date", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-white">{r.studentName}</p>
                    {r.classStudying && <p className="text-xs text-brand-slate">{r.classStudying}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-brand-slate">{r.admissionNo}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-white">{r.applicantName}</p>
                    <p className="text-xs text-brand-slate">{r.applicantPhone}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-brand-slate">
                    {new Date(r.requestedAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", STATUS_CONFIG[r.status].color)}>
                      {STATUS_CONFIG[r.status].label}
                    </span>
                    {r.tcNumber && <p className="mt-0.5 text-[10px] text-brand-gold">{r.tcNumber}</p>}
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setSelected(r)}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-brand-slate hover:text-white">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-brand-slate">
              {filter === "ALL" ? "No TC requests yet." : `No ${filter.toLowerCase()} requests.`}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selected && <TcModal tc={selected} onClose={() => setSelected(null)} onSaved={fetchRequests} />}
      </AnimatePresence>
    </div>
  );
}
