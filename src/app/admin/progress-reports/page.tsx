"use client";
import Link from "next/link";
import { CalendarDays, ClipboardCheck, FilePlus2, Mail, MessageCircle, History, BarChart3, UploadCloud } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const ALL_LINKS = [
  { label: "Import Students",        href: "/admin/students/import",              icon: UploadCloud,    roles: ["SUPER_ADMIN","ADMIN","EDITOR","TEACHER"], desc: "Bulk add or update students from a CSV/Excel file." },
  { label: "Reporting Cycles",       href: "/admin/progress-reports/cycles",      icon: CalendarDays,   roles: ["SUPER_ADMIN","ADMIN","EDITOR","TEACHER"], desc: "Create and manage 15-day reporting periods." },
  { label: "Student Assessments",    href: "/admin/progress-reports/assessments", icon: ClipboardCheck, roles: ["SUPER_ADMIN","ADMIN","TEACHER"],          desc: "Enter attendance, marks, and behaviour for a class." },
  { label: "Report Generation",      href: "/admin/progress-reports/generate",    icon: FilePlus2,      roles: ["SUPER_ADMIN","ADMIN","TEACHER"],          desc: "Generate PDFs and notify parents for a whole class." },
  { label: "Email Dispatch",         href: "/admin/progress-reports/email",       icon: Mail,           roles: ["SUPER_ADMIN","ADMIN"],                     desc: "Review email delivery for sent reports." },
  { label: "WhatsApp Notifications", href: "/admin/progress-reports/whatsapp",    icon: MessageCircle,  roles: ["SUPER_ADMIN","ADMIN"],                     desc: "Review WhatsApp notification delivery." },
  { label: "Communication Logs",     href: "/admin/progress-reports/logs",        icon: History,        roles: ["SUPER_ADMIN","ADMIN","EDITOR"],            desc: "Full send history across email and WhatsApp." },
  { label: "Analytics",              href: "/admin/progress-reports/analytics",   icon: BarChart3,      roles: ["SUPER_ADMIN","ADMIN","EDITOR"],            desc: "Attendance trends and performance overview." },
];

export default function ProgressReportsLandingPage() {
  const role = useAuthStore(s => s.user?.role) ?? "ADMIN";
  const links = ALL_LINKS.filter(l => l.roles.includes(role));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Progress Reports</h1>
        <p className="mt-1 text-sm text-brand-slate">
          {role === "TEACHER"
            ? "Enter assessments and generate reports for your assigned classes."
            : "Manage reporting cycles, assessments, and parent communication."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="group rounded-2xl border border-white/8 bg-white/3 p-5 transition-all hover:border-brand-crimson/30 hover:bg-brand-crimson/5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/15 text-brand-crimson group-hover:bg-brand-crimson group-hover:text-white transition-all">
              <l.icon size={18} />
            </div>
            <p className="font-semibold text-white">{l.label}</p>
            <p className="mt-1 text-xs text-brand-slate">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
