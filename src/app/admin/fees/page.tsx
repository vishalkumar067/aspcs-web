"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Loader2, IndianRupee, X, CheckCircle2, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray } from "@/lib/api";
import toast from "react-hot-toast";

interface FeePayment {
  id: string; receiptNo: string; amount: number; lateFine: number;
  totalAmount: number; paymentDate: string; paymentMethod: string;
  month?: string; remarks?: string; createdAt: string;
  // joined from student
  studentName?: string; admissionNo?: string;
}
interface FeeCategory { id: string; name: string; }

const METHODS = ["CASH","ONLINE","CHEQUE","DD"];
const MONTHS  = ["April","May","June","July","August","September","October","November","December","January","February","March"];
const CLASSES = ["Nursery","KG I","KG II","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X"];

function PaymentModal({ categories, onClose, onSaved }: { categories: FeeCategory[]; onClose:()=>void; onSaved:()=>void }) {
  const [form, setForm] = useState({
    admissionNo:"", studentName:"", class:"",
    categoryId: categories[0]?.id??"",
    amount:"", lateFine:"0", paymentMethod:"CASH", month: MONTHS[new Date().getMonth()>3?new Date().getMonth()-4:new Date().getMonth()+8],
    remarks:"",
  });
  const [saving,  setSaving]   = useState(false);
  const [receipt, setReceipt]  = useState("");
  const [success, setSuccess]  = useState(false);

  const total = Number(form.amount||0) + Number(form.lateFine||0);

  const handleSave = async () => {
    if (!form.admissionNo||!form.amount||!form.categoryId) { toast.error("Fill required fields"); return; }
    setSaving(true);
    try {
      // Find student by admission number first
      const studentData = await api.get<unknown>(`/students?search=${form.admissionNo}&size=1`);
      const students = toArray<{id:string}>(studentData);
      if (!students.length) throw new Error("Student not found with this admission number");

      const res = await api.post<{data:{receiptNo:string}}>("/fees/payments", {
        studentId: students[0].id,
        categoryId: form.categoryId,
        sessionId: null,
        amount: Number(form.amount),
        lateFine: Number(form.lateFine)||0,
        paymentMethod: form.paymentMethod,
        month: form.month,
        remarks: form.remarks,
      });
      setReceipt((res as any)?.data?.receiptNo ?? "Generated");
      setSuccess(true);
      onSaved();
    } catch (err: unknown) { toast.error(err instanceof Error?err.message:"Payment failed"); }
    finally { setSaving(false); }
  };

  if (success) return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div initial={{scale:0.95}} animate={{scale:1}}
        className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-8 text-center shadow-glass">
        <CheckCircle2 size={48} className="mx-auto mb-4 text-brand-gold"/>
        <h3 className="mb-2 font-display text-xl font-bold text-white">Payment Recorded!</h3>
        <p className="mb-1 text-sm text-brand-slate">Receipt No</p>
        <p className="mb-6 font-mono text-lg font-bold text-brand-gold">{receipt}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Close</button>
          <button onClick={()=>{toast.success("Print coming soon!"); onClose();}} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            <Receipt size={15}/> Print Receipt
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}
        onClick={e=>e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">Record Fee Payment</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18}/></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Admission No <span className="text-brand-gold">*</span></label>
              <input value={form.admissionNo} onChange={e=>setForm({...form,admissionNo:e.target.value})} placeholder="ASPCS/2020/001"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Class</label>
              <select data-theme="dark-select" value={form.class} onChange={e=>setForm({...form,class:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                <option value="">Select</option>
                {CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Fee Category <span className="text-brand-gold">*</span></label>
            <select data-theme="dark-select" value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}
              className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
              {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Amount (₹) <span className="text-brand-gold">*</span></label>
              <input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Late Fine (₹)</label>
              <input type="number" value={form.lateFine} onChange={e=>setForm({...form,lateFine:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"/>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Total (₹)</label>
              <input readOnly value={total} className="w-full rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-3 py-2.5 text-sm font-bold text-brand-gold outline-none"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Method</label>
              <select data-theme="dark-select" value={form.paymentMethod} onChange={e=>setForm({...form,paymentMethod:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {METHODS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Month</label>
              <select data-theme="dark-select" value={form.month} onChange={e=>setForm({...form,month:e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
                {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving?<Loader2 size={15} className="animate-spin"/>:<IndianRupee size={15}/>}
            {saving?"Recording...":"Record Payment"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminFeesPage() {
  const [payments,   setPayments]   = useState<FeePayment[]>([]);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [modal,      setModal]      = useState(false);
  const [todayAmt,   setTodayAmt]   = useState(0);
  const [monthAmt,   setMonthAmt]   = useState(0);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [payData, catData, statsData] = await Promise.allSettled([
        api.get<unknown>("/fees/payments?size=100"),
        api.get<unknown>("/fees/categories"),
        api.get<unknown>("/fees/dashboard"),
      ]);
      if (payData.status==="fulfilled")  setPayments(toArray<FeePayment>(payData.value));
      if (catData.status==="fulfilled")  setCategories(toArray<FeeCategory>(catData.value));
      if (statsData.status==="fulfilled") {
        const d = (statsData.value as any)?.data ?? (statsData.value as any);
        setTodayAmt(d?.totalAmountToday ?? 0);
        setMonthAmt(d?.totalAmountThisMonth ?? 0);
      }
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchAll(); },[]);

  const filtered = payments.filter(p=>
    !search || (p.receiptNo??'').toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Fee Management</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{payments.length} payments recorded</p>
        </div>
        <button onClick={()=>setModal(true)} className="btn-primary py-2.5 text-sm">
          <Plus size={16}/> Record Payment
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {label:"Today's Collection",   value:fmt(todayAmt), color:"text-brand-gold"},
          {label:"Month's Collection",   value:fmt(monthAmt), color:"text-emerald-400"},
          {label:"Total Records",        value:payments.length, color:"text-blue-400"},
        ].map(s=>(
          <div key={s.label} className="card p-5">
            <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
            <p className={`font-display text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by receipt number..."
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"/>
      </div>

      {loading?(
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson"/></div>
      ):(
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Receipt No","Amount","Month","Method","Date"].map(h=>(
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>(
                <motion.tr key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
                  className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3.5 font-mono text-xs text-[var(--text-muted)]">{p.receiptNo}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-brand-gold">{fmt(p.totalAmount)}</p>
                    {p.lateFine>0&&<p className="text-xs text-red-400">+{fmt(p.lateFine)} fine</p>}
                  </td>
                  <td className="px-4 py-3.5 text-[var(--text-muted)]">{p.month??"-"}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                      p.paymentMethod==="ONLINE"?"bg-blue-50 text-blue-700 border-blue-200":
                      p.paymentMethod==="CASH"?"bg-emerald-50 text-emerald-700 border-emerald-200":
                      "bg-gray-50 text-gray-600 border-gray-200")}>
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[var(--text-muted)]">{p.paymentDate}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div className="py-16 text-center text-[var(--text-muted)]">No payments yet.</div>}
        </div>
      )}

      <AnimatePresence>
        {modal&&<PaymentModal categories={categories} onClose={()=>setModal(false)} onSaved={fetchAll}/>}
      </AnimatePresence>
    </div>
  );
}
