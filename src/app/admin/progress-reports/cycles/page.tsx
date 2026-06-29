"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save, Loader2, CalendarDays, Lock, Unlock, Archive, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray } from "@/lib/api";
import toast from "react-hot-toast";

interface Cycle {
  id: string; name: string; startDate: string; endDate: string;
  status: "OPEN" | "CLOSED" | "ARCHIVED";
}

const STATUS_STYLES: Record<string, string> = {
  OPEN:     "border-emerald-200 bg-emerald-50 text-emerald-700",
  CLOSED:   "border-amber-200 bg-amber-50 text-amber-700",
  ARCHIVED: "border-gray-200 bg-gray-50 text-gray-600",
};

function CycleModal({ cycle, onClose, onSaved }: { cycle?: Cycle | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: cycle?.name ?? "",
    startDate: cycle?.startDate ?? "",
    endDate: cycle?.endDate ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.startDate || !form.endDate) { toast.error("Fill all fields"); return; }
    if (form.endDate < form.startDate) { toast.error("End date can't be before start date"); return; }
    setSaving(true);
    try {
      if (cycle?.id) {
        await api.put(`/progress-reports/cycles/${cycle.id}`, form);
      } else {
        await api.post("/progress-reports/cycles", form);
      }
      toast.success(cycle?.id ? "Cycle updated!" : "Cycle created!");
      onSaved(); onClose();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{cycle ? "Edit Cycle" : "Create Reporting Cycle"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Cycle Name <span className="text-brand-gold">*</span></label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Cycle 01 - July 2026"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Start Date <span className="text-brand-gold">*</span></label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-brand-crimson/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">End Date <span className="text-brand-gold">*</span></label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-brand-crimson/50" />
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : cycle ? "Update" : "Create Cycle"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ReportingCyclesPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<Cycle | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchCycles = async () => {
    setLoading(true);
    try { setCycles(toArray<Cycle>(await api.get("/progress-reports/cycles"))); }
    catch { toast.error("Failed to load cycles"); setCycles([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCycles(); }, []);

  const handleAction = async (id: string, action: "close" | "reopen" | "archive") => {
    setBusyId(id);
    try {
      await api.post(`/progress-reports/cycles/${id}/${action}`, {});
      toast.success(`Cycle ${action === "close" ? "closed" : action === "reopen" ? "reopened" : "archived"}`);
      fetchCycles();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Action failed"); }
    finally { setBusyId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Reporting Cycles</h1>
          <p className="mt-1 text-sm text-brand-slate">{cycles.filter(c => c.status === "OPEN").length} open · {cycles.length} total</p>
        </div>
        <button onClick={() => { setEdit(null); setModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Create Cycle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson" /></div>
      ) : cycles.length === 0 ? (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-brand-slate">
          <CalendarDays size={28} className="mx-auto mb-3 opacity-40" />
          No reporting cycles yet. Create one to start collecting assessments.
        </div>
      ) : (
        <div className="grid gap-3">
          {cycles.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-crimson/15 text-brand-crimson">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-brand-slate">
                    {new Date(c.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    {" – "}
                    {new Date(c.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", STATUS_STYLES[c.status])}>
                  {c.status}
                </span>
                {c.status === "OPEN" && (
                  <>
                    <button onClick={() => { setEdit(c); setModal(true); }}
                      className="rounded-lg p-1.5 text-brand-slate hover:text-brand-gold" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleAction(c.id, "close")} disabled={busyId === c.id}
                      className="rounded-lg p-1.5 text-brand-slate hover:text-amber-400" title="Close cycle">
                      {busyId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                    </button>
                  </>
                )}
                {c.status === "CLOSED" && (
                  <>
                    <button onClick={() => handleAction(c.id, "reopen")} disabled={busyId === c.id}
                      className="rounded-lg p-1.5 text-brand-slate hover:text-emerald-400" title="Reopen cycle">
                      {busyId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Unlock size={14} />}
                    </button>
                    <button onClick={() => handleAction(c.id, "archive")} disabled={busyId === c.id}
                      className="rounded-lg p-1.5 text-brand-slate hover:text-gray-300" title="Archive cycle">
                      {busyId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && <CycleModal cycle={edit} onClose={() => { setModal(false); setEdit(null); }} onSaved={fetchCycles} />}
      </AnimatePresence>
    </div>
  );
}
