"use client";

import { motion } from "framer-motion";
import { Bell, Users, Images, TrendingUp, Eye, FileText, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

const stats = [
  { label: "Total Notices",      value: "24",  change: "+3 this week",  icon: Bell,        color: "bg-blue-500/15 text-blue-400",    border: "border-blue-500/20" },
  { label: "Admission Inquiries",value: "18",  change: "+5 this week",  icon: Users,       color: "bg-brand-crimson/15 text-brand-crimson", border: "border-brand-crimson/20" },
  { label: "Gallery Albums",     value: "9",   change: "2 unpublished", icon: Images,      color: "bg-violet-500/15 text-violet-400", border: "border-violet-500/20" },
  { label: "Page Views (Today)", value: "342", change: "+12% vs yesterday", icon: Eye,     color: "bg-emerald-500/15 text-emerald-400", border: "border-emerald-500/20" },
];

const recentInquiries = [
  { name: "Rohit Sharma",  grade: "Grade VI",   status: "PENDING",    time: "2 hrs ago" },
  { name: "Priya Singh",   grade: "Nursery",    status: "CONTACTED",  time: "5 hrs ago" },
  { name: "Arjun Verma",   grade: "Grade IX",   status: "PENDING",    time: "1 day ago" },
  { name: "Sneha Gupta",   grade: "Grade I",    status: "SHORTLISTED",time: "1 day ago" },
  { name: "Rahul Kumar",   grade: "Grade III",  status: "PENDING",    time: "2 days ago" },
];

const recentNotices = [
  { title: "Annual Sports Day 2025",          category: "GENERAL", published: true },
  { title: "Board Exam Timetable",            category: "EXAM",    published: true },
  { title: "Summer Holiday Announcement",     category: "HOLIDAY", published: false },
  { title: "Parent Teacher Meeting",          category: "ACADEMIC",published: true },
];

const statusColors: Record<string, string> = {
  PENDING:     "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CONTACTED:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  SHORTLISTED: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  ADMITTED:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  REJECTED:    "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0] ?? "Admin"} 👋
        </h1>
        <p className="mt-1 text-sm text-brand-slate">
          Here&apos;s what&apos;s happening with your school website today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border ${stat.border} bg-white/3 p-5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-brand-slate">{stat.label}</p>
                  <p className="mt-1 font-display text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-brand-slate/70">{stat.change}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent activity grid */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/8 bg-white/3 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Recent Inquiries</h2>
            <Link href="/admin/admissions" className="text-xs text-brand-crimson hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentInquiries.map((inq, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-crimson/20 text-xs font-bold text-brand-crimson">
                    {inq.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{inq.name}</p>
                    <p className="text-xs text-brand-slate">{inq.grade}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColors[inq.status]}`}>
                    {inq.status}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-brand-slate">
                    <Clock size={9} />{inq.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Notices */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/8 bg-white/3 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Recent Notices</h2>
            <Link href="/admin/notices" className="text-xs text-brand-crimson hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotices.map((notice, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white/3 px-4 py-3">
                <FileText size={15} className="mt-0.5 shrink-0 text-brand-gold" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">{notice.title}</p>
                  <p className="text-xs text-brand-slate">{notice.category}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {notice.published ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 size={10} />Live
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-400">Draft</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/admin/notices/new"
              className="flex items-center justify-center gap-2 rounded-xl border border-brand-crimson/30 bg-brand-crimson/10 py-2.5 text-xs font-semibold text-brand-crimson transition-all hover:bg-brand-crimson hover:text-white"
            >
              <Bell size={13} /> New Notice
            </Link>
            <Link
              href="/admin/gallery/new"
              className="flex items-center justify-center gap-2 rounded-xl border border-brand-gold/30 bg-brand-gold/10 py-2.5 text-xs font-semibold text-brand-gold transition-all hover:bg-brand-gold hover:text-brand-black"
            >
              <Images size={13} /> New Album
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick navigation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid gap-3 sm:grid-cols-3"
      >
        {[
          { label: "Manage Notices",    href: "/admin/notices",    icon: Bell,    desc: "Create, edit, publish notices" },
          { label: "Manage Gallery",    href: "/admin/gallery",    icon: Images,  desc: "Upload and organise albums" },
          { label: "View Admissions",   href: "/admin/admissions", icon: Users,   desc: "Review and update inquiries" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 p-5 transition-all hover:border-brand-crimson/30 hover:bg-brand-crimson/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/15">
                <Icon size={18} className="text-brand-crimson" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-brand-slate">{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
