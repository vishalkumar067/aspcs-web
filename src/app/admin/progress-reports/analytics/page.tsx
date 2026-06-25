"use client";
import { useEffect, useState } from "react";
import { Loader2, FileCheck2, Mail, MessageCircle, AlertTriangle, Trophy } from "lucide-react";
import { api, unwrapData, toArray } from "@/lib/api";
import toast from "react-hot-toast";

interface Cycle { id: string; name: string; status: string; }
interface CycleStats { total: number; draft: number; submitted: number; locked: number; }
interface CommStats {
  emailSent: number; emailFailed: number; emailTotal: number;
  whatsappSent: number; whatsappFailed: number; whatsappTotal: number;
}

function successRate(sent: number, total: number) {
  if (total === 0) return "—";
  return ((sent / total) * 100).toFixed(0) + "%";
}

export default function AnalyticsPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [cycleStats, setCycleStats] = useState<CycleStats | null>(null);
  const [commStats, setCommStats] = useState<CommStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/progress-reports/cycles").then(res => {
      const list = toArray<Cycle>(res);
      setCycles(list);
      const open = list.find(c => c.status === "OPEN");
      if (open) setCycleId(open.id);
    }).catch(() => toast.error("Failed to load cycles"));

    api.get("/progress-reports/communication-logs/stats")
      .then(res => setCommStats(unwrapData<CommStats>(res)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!cycleId) return;
    setLoading(true);
    api.get(`/progress-reports/assessments/cycle-stats?cycleId=${cycleId}`)
      .then(res => setCycleStats(unwrapData<CycleStats>(res)))
      .catch(() => toast.error("Failed to load cycle stats"))
      .finally(() => setLoading(false));
  }, [cycleId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Progress report completion and parent communication overview.</p>
        </div>
        <select value={cycleId} onChange={e => setCycleId(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson" /></div>
      ) : (
        <>
          {/* Cycle completion */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-white/80">This Cycle</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon={FileCheck2} label="Total Assessments" value={cycleStats?.total ?? 0} />
              <StatCard icon={AlertTriangle} label="Drafts (Incomplete)" value={cycleStats?.draft ?? 0} warn={!!cycleStats?.draft} />
              <StatCard icon={FileCheck2} label="Submitted" value={cycleStats?.submitted ?? 0} />
              <StatCard icon={Trophy} label="Reports Generated" value={cycleStats?.locked ?? 0} />
            </div>
          </div>

          {/* Communication success rates */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-white/80">Communication Success Rate (All Time)</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
                <div className="mb-2 flex items-center gap-2 text-brand-slate"><Mail size={15} /> <span className="text-sm">Email</span></div>
                <p className="font-display text-3xl font-bold text-[var(--text-primary)]">
                  {successRate(commStats?.emailSent ?? 0, commStats?.emailTotal ?? 0)}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{commStats?.emailSent ?? 0} sent · {commStats?.emailFailed ?? 0} failed</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
                <div className="mb-2 flex items-center gap-2 text-brand-slate"><MessageCircle size={15} /> <span className="text-sm">WhatsApp</span></div>
                <p className="font-display text-3xl font-bold text-[var(--text-primary)]">
                  {successRate(commStats?.whatsappSent ?? 0, commStats?.whatsappTotal ?? 0)}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{commStats?.whatsappSent ?? 0} sent · {commStats?.whatsappFailed ?? 0} failed</p>
              </div>
            </div>
          </div>

          {cycleStats && cycleStats.draft > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-xs text-white/70">
                <span className="font-semibold text-white">{cycleStats.draft} assessment{cycleStats.draft === 1 ? "" : "s"}</span> still in draft for this cycle.
                Reports can&apos;t be generated for these until they&apos;re submitted.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, warn }: { icon: typeof FileCheck2; label: string; value: number; warn?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${warn && value > 0 ? "border-amber-400/30 bg-amber-400/5" : "border-white/8 bg-white/3"}`}>
      <Icon size={14} className={`mb-2 ${warn && value > 0 ? "text-amber-400" : "text-brand-slate"}`} />
      <p className="font-display text-xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
