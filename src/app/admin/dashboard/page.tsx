"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Bell, FileText, GraduationCap, IndianRupee,
  ClipboardList, TrendingUp, Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import { api, toArray, unwrapData } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecentNotice {
  id: string; title: string; category: string;
  published: boolean; createdAt: string;
}
interface RecentTc {
  id: string; studentName: string; admissionNo: string;
  status: string; requestedAt: string;
}
interface RecentAdmission {
  id: string; studentName: string; gradeApplying: string;
  status: string; submittedAt: string;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  PENDING:   <Clock      size={13} className="text-yellow-400" />,
  APPROVED:  <CheckCircle size={13} className="text-blue-400"  />,
  ISSUED:    <CheckCircle size={13} className="text-emerald-400" />,
  ADMITTED:  <CheckCircle size={13} className="text-emerald-400" />,
  CONTACTED: <Clock      size={13} className="text-blue-400"  />,
  REJECTED:  <AlertCircle size={13} className="text-red-400"  />,
};

const STATUS_COLOR: Record<string, string> = {
  PENDING:   "text-yellow-400",
  APPROVED:  "text-blue-400",
  ISSUED:    "text-emerald-400",
  ADMITTED:  "text-emerald-400",
  CONTACTED: "text-blue-400",
  REJECTED:  "text-red-400",
};

// ─── Stat Card — matches .card pattern from other admin pages ─────────────────
function StatCard({
  label, value, icon: Icon, iconBg, delay, loading,
}: {
  label: string; value: string | number;
  icon: React.ElementType; iconBg: string;
  delay: number; loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card flex items-center gap-4 p-5"
    >
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconBg)}>
        <Icon size={19} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
        {loading
          ? <div className="mt-1.5 h-6 w-14 animate-pulse rounded-lg bg-white/10" />
          : <p className="font-display text-xl font-black text-[var(--text-primary)]">{value}</p>
        }
      </div>
    </motion.div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, href, children, loading }: {
  title: string; href: string;
  children: React.ReactNode; loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col"
    >
      <div className="mb-4 flex items-center justify-between px-5 pt-5">
        <h2 className="font-display text-sm font-bold text-[var(--text-primary)]">{title}</h2>
        <a href={href} className="text-[10px] font-semibold uppercase tracking-wider text-brand-crimson hover:underline">
          View all →
        </a>
      </div>

      <div className="flex-1 px-5 pb-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : children}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [loading,    setLoading]    = useState(true);
  const [teachers,   setTeachers]   = useState(0);
  const [notices,    setNotices]    = useState<RecentNotice[]>([]);
  const [tcList,     setTcList]     = useState<RecentTc[]>([]);
  const [admissions, setAdmissions] = useState<RecentAdmission[]>([]);
  const [pendingTc,  setPendingTc]  = useState(0);
  const [pendingAdm, setPendingAdm] = useState(0);
  const [todayFees,  setTodayFees]  = useState("₹0");
  const [monthFees,  setMonthFees]  = useState("₹0");

  useEffect(() => {
    const fmt = (n: number) =>
      n >= 100000 ? `₹${(n / 100000).toFixed(1)}L`
      : n >= 1000  ? `₹${(n / 1000).toFixed(1)}K`
      : `₹${n ?? 0}`;

    const load = async () => {
      const [tStats, fStats, nData, tcData, admData, admStats] =
        await Promise.allSettled([
          api.get("/teachers/stats"),
          api.get("/fees/dashboard"),
          api.get("/notices?size=5&sort=createdAt,desc"),
          api.get("/tc?size=5"),
          api.get("/admissions?size=5&sort=submittedAt,desc"),
          api.get("/admissions/stats"),
        ]);

      if (tStats.status   === "fulfilled") {
        const d = (tStats.value as any)?.data ?? tStats.value as any;
        setTeachers(d?.total ?? 0);
      }
      if (fStats.status   === "fulfilled") {
        const d = (fStats.value as any)?.data ?? fStats.value as any;
        setTodayFees(fmt(d?.totalAmountToday     ?? 0));
        setMonthFees(fmt(d?.totalAmountThisMonth ?? 0));
      }
      if (nData.status    === "fulfilled") setNotices(toArray<RecentNotice>(nData.value).slice(0, 5));
      if (tcData.status   === "fulfilled") {
        const list = toArray<RecentTc>(tcData.value).slice(0, 5);
        setTcList(list);
        setPendingTc(list.filter(t => t.status === "PENDING").length);
      }
      if (admData.status  === "fulfilled") setAdmissions(toArray<RecentAdmission>(admData.value).slice(0, 5));
      if (admStats.status === "fulfilled") {
        const d = (admStats.value as any)?.data ?? admStats.value as any;
        setPendingAdm(d?.pending ?? 0);
      }

      setLoading(false);
    };
    load();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const statCards = [
    { label: "Teachers",           value: teachers,  icon: Users,         iconBg: "bg-brand-crimson/80",  delay: 0.05 },
    { label: "Notices Published",  value: notices.filter(n => n.published).length, icon: Bell, iconBg: "bg-brand-maroon",  delay: 0.10 },
    { label: "Pending TC Requests",value: pendingTc, icon: ClipboardList, iconBg: "bg-orange-500/80",     delay: 0.15 },
    { label: "Pending Admissions", value: pendingAdm,icon: GraduationCap, iconBg: "bg-purple-500/80",     delay: 0.20 },
    { label: "Today's Collections",value: todayFees, icon: IndianRupee,   iconBg: "bg-emerald-600/80",    delay: 0.25 },
    { label: "Monthly Collections",value: monthFees, icon: TrendingUp,    iconBg: "bg-teal-600/80",       delay: 0.30 },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{today}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(s => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Three sections */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Recent Notices */}
        <SectionCard title="Recent Notices" href="/admin/notices" loading={loading}>
          {notices.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No notices yet.</p>
          ) : (
            <div className="space-y-2">
              {notices.map(n => (
                <div key={n.id} className="flex items-start gap-3 rounded-xl bg-white/3 p-3 hover:bg-white/5 transition-colors">
                  <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                    n.published ? "bg-emerald-500/20" : "bg-white/5")}>
                    <Bell size={11} className={n.published ? "text-emerald-400" : "text-brand-slate"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[var(--text-muted)]">{n.category}</span>
                      <span className={cn("text-[10px] font-semibold",
                        n.published ? "text-emerald-400" : "text-brand-slate")}>
                        {n.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* TC Requests */}
        <SectionCard title="TC Requests" href="/admin/tc" loading={loading}>
          {tcList.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No TC requests yet.</p>
          ) : (
            <div className="space-y-2">
              {tcList.map(tc => (
                <div key={tc.id} className="flex items-center gap-3 rounded-xl bg-white/3 p-3 hover:bg-white/5 transition-colors">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    {STATUS_ICON[tc.status] ?? <FileText size={11} className="text-brand-slate" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{tc.studentName}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{tc.admissionNo}</p>
                  </div>
                  <span className={cn("shrink-0 text-[10px] font-semibold", STATUS_COLOR[tc.status] ?? "text-brand-slate")}>
                    {tc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Admissions */}
        <SectionCard title="Admissions" href="/admin/admissions" loading={loading}>
          {admissions.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No inquiries yet.</p>
          ) : (
            <div className="space-y-2">
              {admissions.map(a => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl bg-white/3 p-3 hover:bg-white/5 transition-colors">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-crimson/15">
                    <GraduationCap size={11} className="text-brand-crimson" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{a.studentName}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Grade {a.gradeApplying}</p>
                  </div>
                  <span className={cn("shrink-0 text-[10px] font-semibold", STATUS_COLOR[a.status] ?? "text-brand-slate")}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

      </div>
    </div>
  );
}
