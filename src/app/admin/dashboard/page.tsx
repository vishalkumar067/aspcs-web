"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Bell, FileText, GraduationCap,
  TrendingUp, Clock, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";
import { api, toArray } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  students:    number;
  teachers:    number;
  notices:     number;
  pendingTc:   number;
  pendingAdmissions: number;
  todayFees:   string;
  monthFees:   string;
}

interface RecentNotice {
  id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
}

interface RecentTc {
  id: string;
  studentName: string;
  admissionNo: string;
  status: string;
  requestedAt: string;
}

interface RecentAdmission {
  id: string;
  studentName: string;
  gradeApplying: string;
  status: string;
  submittedAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING:   "text-yellow-500",
  APPROVED:  "text-blue-400",
  ISSUED:    "text-emerald-400",
  REJECTED:  "text-red-400",
  CONTACTED: "text-blue-400",
  ADMITTED:  "text-emerald-400",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, loading }: {
  label: string; value: string | number; icon: React.ElementType;
  color: string; loading: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="card flex items-center gap-4 p-5">
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", color)}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-brand-slate">{label}</p>
        {loading
          ? <div className="mt-1 h-7 w-16 animate-pulse rounded-lg bg-white/10" />
          : <p className="font-display text-2xl font-black text-white">{value}</p>}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats,      setStats]      = useState<Stats | null>(null);
  const [notices,    setNotices]    = useState<RecentNotice[]>([]);
  const [tcList,     setTcList]     = useState<RecentTc[]>([]);
  const [admissions, setAdmissions] = useState<RecentAdmission[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Fire all requests in parallel
        const [teacherStats, feeStats, noticeData, tcData, admissionData, admissionStats] =
          await Promise.allSettled([
            api.get<{ data: { total: number; active: number } }>("/teachers/stats"),
            api.get<{ data: { totalAmountToday: number; totalAmountThisMonth: number } }>("/fees/dashboard"),
            api.get<unknown>("/notices?size=5&sort=createdAt,desc"),
            api.get<unknown>("/tc?size=5"),
            api.get<unknown>("/admissions?size=5&sort=submittedAt,desc"),
            api.get<{ data: { total: number; pending: number } }>("/admissions/stats"),
          ]);

        const teachers   = teacherStats.status   === "fulfilled" ? teacherStats.value   : null;
        const fees       = feeStats.status       === "fulfilled" ? feeStats.value       : null;
        const admStats   = admissionStats.status === "fulfilled" ? admissionStats.value : null;

        const recentNotices = noticeData.status === "fulfilled"
          ? toArray<RecentNotice>(noticeData.value) : [];
        const recentTc = tcData.status === "fulfilled"
          ? toArray<RecentTc>(tcData.value) : [];
        const recentAdm = admissionData.status === "fulfilled"
          ? toArray<RecentAdmission>(admissionData.value) : [];

        const fmt = (n: number) =>
          n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
          : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K`
          : `₹${n}`;

        setStats({
          students:  0,                                               // add students endpoint later
          teachers:  (teachers as any)?.data?.total ?? (teachers as any)?.total ?? 0,
          notices:   recentNotices.length,
          pendingTc: recentTc.filter(t => t.status === "PENDING").length,
          pendingAdmissions: (admStats as any)?.data?.pending ?? (admStats as any)?.pending ?? 0,
          todayFees: fmt((fees as any)?.data?.totalAmountToday  ?? (fees as any)?.totalAmountToday  ?? 0),
          monthFees: fmt((fees as any)?.data?.totalAmountThisMonth ?? (fees as any)?.totalAmountThisMonth ?? 0),
        });

        setNotices(recentNotices.slice(0, 5));
        setTcList(recentTc.slice(0, 5));
        setAdmissions(recentAdm.slice(0, 5));
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: "Teachers",          value: stats?.teachers          ?? 0,  icon: Users,         color: "bg-blue-500" },
    { label: "Active Notices",    value: stats?.notices           ?? 0,  icon: Bell,          color: "bg-brand-crimson" },
    { label: "Pending TC",        value: stats?.pendingTc         ?? 0,  icon: FileText,      color: "bg-orange-500" },
    { label: "Pending Admissions",value: stats?.pendingAdmissions ?? 0,  icon: GraduationCap, color: "bg-purple-500" },
    { label: "Today's Fees",      value: stats?.todayFees         ?? "₹0", icon: TrendingUp,  color: "bg-emerald-500" },
    { label: "Month's Fees",      value: stats?.monthFees         ?? "₹0", icon: TrendingUp,  color: "bg-teal-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-brand-slate">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}>
            <StatCard {...s} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Three columns */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Notices */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-white">Recent Notices</h2>
            <a href="/admin/notices" className="text-xs text-brand-crimson hover:underline">View all</a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-white/5" />)}
            </div>
          ) : notices.length === 0 ? (
            <p className="text-sm text-brand-slate">No notices yet.</p>
          ) : (
            <div className="space-y-3">
              {notices.map(n => (
                <div key={n.id} className="flex items-start gap-3 rounded-xl bg-white/3 p-3">
                  <Bell size={14} className={cn("mt-0.5 shrink-0", n.published ? "text-emerald-400" : "text-brand-slate")} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{n.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-brand-slate">{n.category}</span>
                      <span className={cn("text-[10px] font-semibold", n.published ? "text-emerald-400" : "text-brand-slate")}>
                        {n.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent TC Requests */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-white">TC Requests</h2>
            <a href="/admin/tc" className="text-xs text-brand-crimson hover:underline">View all</a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-white/5" />)}
            </div>
          ) : tcList.length === 0 ? (
            <p className="text-sm text-brand-slate">No TC requests yet.</p>
          ) : (
            <div className="space-y-3">
              {tcList.map(tc => (
                <div key={tc.id} className="flex items-center gap-3 rounded-xl bg-white/3 p-3">
                  {tc.status === "PENDING"  && <Clock size={14} className="shrink-0 text-yellow-500" />}
                  {tc.status === "ISSUED"   && <CheckCircle size={14} className="shrink-0 text-emerald-400" />}
                  {tc.status === "REJECTED" && <AlertCircle size={14} className="shrink-0 text-red-400" />}
                  {!["PENDING","ISSUED","REJECTED"].includes(tc.status) && <FileText size={14} className="shrink-0 text-brand-slate" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{tc.studentName}</p>
                    <p className="text-[10px] text-brand-slate">{tc.admissionNo}</p>
                  </div>
                  <span className={cn("shrink-0 text-[10px] font-semibold", STATUS_COLOR[tc.status] ?? "text-brand-slate")}>
                    {tc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Admissions */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-white">Admissions</h2>
            <a href="/admin/admissions" className="text-xs text-brand-crimson hover:underline">View all</a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-white/5" />)}
            </div>
          ) : admissions.length === 0 ? (
            <p className="text-sm text-brand-slate">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {admissions.map(a => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl bg-white/3 p-3">
                  <GraduationCap size={14} className="shrink-0 text-brand-slate" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{a.studentName}</p>
                    <p className="text-[10px] text-brand-slate">Grade {a.gradeApplying}</p>
                  </div>
                  <span className={cn("shrink-0 text-[10px] font-semibold", STATUS_COLOR[a.status] ?? "text-brand-slate")}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
