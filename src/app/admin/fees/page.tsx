"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, Plus, Search, Receipt, X, Save, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Payment {
  id: string; studentName: string; admissionNo: string;
  class: string; category: string; amount: number;
  lateFine: number; totalAmount: number; receiptNo: string;
  paymentDate: string; paymentMethod: string; month?: string;
}

const MOCK: Payment[] = [
  { id: "1", studentName: "Rahul Kumar Sharma",  admissionNo: "ASPCS/2020/001", class: "Class X",   category: "Tuition Fee",  amount: 2500, lateFine: 0,   totalAmount: 2500, receiptNo: "ASPCS/FEE/2025/000001", paymentDate: "2025-05-10", paymentMethod: "CASH",   month: "May" },
  { id: "2", studentName: "Priya Singh",          admissionNo: "ASPCS/2021/042", class: "Class IX",  category: "Transport Fee",amount: 1200, lateFine: 100, totalAmount: 1300, receiptNo: "ASPCS/FEE/2025/000002", paymentDate: "2025-05-12", paymentMethod: "ONLINE", month: "May" },
  { id: "3", studentName: "Sneha Gupta",          admissionNo: "ASPCS/2022/005", class: "Class VIII",category: "Tuition Fee",  amount: 2200, lateFine: 0,   totalAmount: 2200, receiptNo: "ASPCS/FEE/2025/000003", paymentDate: "2025-05-08", paymentMethod: "CASH",   month: "May" },
  { id: "4", studentName: "Mohammad Aariz Khan",  admissionNo: "ASPCS/2023/031", class: "Class VII", category: "Tuition Fee",  amount: 2000, lateFine: 0,   totalAmount: 2000, receiptNo: "ASPCS/FEE/2025/000004", paymentDate: "2025-05-05", paymentMethod: "CHEQUE", month: "May" },
];

const CATEGORIES = ["Tuition Fee", "Transport Fee", "Lab Fee", "Sports Fee", "Library Fee", "Examination Fee", "Annual Fund"];
const CLASSES     = ["Nursery", "KG I", "KG II", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII", "Class VIII", "Class IX", "Class X"];
const METHODS     = ["CASH", "ONLINE", "CHEQUE", "DD"];
const MONTHS      = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

function PaymentModal({ onClose, onSave }: { onClose: () => void; onSave: (data: Partial<Payment>) => void }) {
  const [form, setForm] = useState({
    admissionNo: "", studentName: "", class: "", category: CATEGORIES[0],
    amount: "", lateFine: "0", paymentMethod: "CASH", month: MONTHS[0],
  });
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [receiptNo, setReceiptNo] = useState("");

  const handleSave = async () => {
    if (!form.admissionNo || !form.studentName || !form.amount) { toast.error("Fill required fields"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const receipt = `ASPCS/FEE/2025/${String(Math.floor(Math.random() * 9999) + 1).padStart(6, "0")}`;
    setReceiptNo(receipt);
    onSave({ ...form, amount: Number(form.amount), lateFine: Number(form.lateFine),
             totalAmount: Number(form.amount) + Number(form.lateFine),
             receiptNo: receipt, paymentDate: new Date().toISOString().split("T")[0] });
    setSaving(false);
    setSuccess(true);
  };

  if (success) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-8 text-center shadow-glass">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-brand-gold" />
        <h3 className="mb-2 font-display text-xl font-bold text-white">Payment Recorded!</h3>
        <p className="mb-1 text-brand-slate">Receipt No:</p>
        <p className="mb-6 font-mono text-lg font-bold text-brand-gold">{receiptNo}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Close</button>
          <button onClick={() => { toast.success("Print feature coming soon!"); onClose(); }}
            className="btn-primary flex-1 justify-center py-2.5 text-sm">
            <Receipt size={15} /> Print Receipt
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">Record Fee Payment</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Admission No <span className="text-brand-gold">*</span></label>
              <input value={form.admissionNo} onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} placeholder="ASPCS/2020/001"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Student Name <span className="text-brand-gold">*</span></label>
              <input value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="Student name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Class</label>
              <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Select class</option>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Fee Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Amount (₹) <span className="text-brand-gold">*</span></label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Late Fine (₹)</label>
              <input type="number" value={form.lateFine} onChange={(e) => setForm({ ...form, lateFine: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Total (₹)</label>
              <input readOnly value={Number(form.amount || 0) + Number(form.lateFine || 0)}
                className="w-full rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-3 py-2.5 text-sm font-bold text-brand-gold outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Month</label>
              <select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <IndianRupee size={15} />}
            {saving ? "Recording..." : "Record Payment"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminFeesPage() {
  const [payments, setPayments]   = useState<Payment[]>(MOCK);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(false);

  const filtered = payments.filter((p) =>
    !search || p.studentName.toLowerCase().includes(search.toLowerCase()) ||
    p.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalToday = payments
    .filter((p) => p.paymentDate === new Date().toISOString().split("T")[0])
    .reduce((s, p) => s + p.totalAmount, 0);

  const totalMonth = payments.reduce((s, p) => s + p.totalAmount, 0);

  const handleSave = (data: Partial<Payment>) => {
    setPayments((prev) => [{ id: Date.now().toString(), ...data } as Payment, ...prev]);
    toast.success("Payment recorded!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Fee Management</h1>
          <p className="mt-1 text-sm text-brand-slate">{payments.length} payments recorded</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Today's Collection",       value: `₹${totalToday.toLocaleString("en-IN")}`,  color: "text-brand-gold" },
          { label: "This Month's Collection",  value: `₹${totalMonth.toLocaleString("en-IN")}`,  color: "text-emerald-400" },
          { label: "Total Records",            value: payments.length.toString(),                 color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <p className="text-xs text-brand-slate">{stat.label}</p>
            <p className={`font-display text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, admission no, receipt..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Student", "Receipt No", "Category", "Amount", "Month", "Method", "Date"].map((h) => (
                <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-white">{p.studentName}</p>
                  <p className="text-xs text-brand-slate">{p.admissionNo} · {p.class}</p>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-brand-slate">{p.receiptNo}</td>
                <td className="px-4 py-3.5 text-brand-slate">{p.category}</td>
                <td className="px-4 py-3.5">
                  <p className="font-bold text-brand-gold">₹{p.totalAmount.toLocaleString("en-IN")}</p>
                  {p.lateFine > 0 && <p className="text-xs text-red-400">+₹{p.lateFine} fine</p>}
                </td>
                <td className="px-4 py-3.5 text-brand-slate">{p.month ?? "—"}</td>
                <td className="px-4 py-3.5">
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                    p.paymentMethod === "ONLINE" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    p.paymentMethod === "CASH"   ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    "bg-gray-50 text-gray-600 border-gray-200")}>
                    {p.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-brand-slate">{p.paymentDate}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-brand-slate">No payments found.</div>}
      </div>

      <AnimatePresence>
        {modal && <PaymentModal onClose={() => setModal(false)} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}
