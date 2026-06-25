"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Images,
  Users,
  LogOut,
  GraduationCap,
  Settings,
  X,
  ImagePlus,
  UserSquare2,
  Briefcase,
  CalendarDays,
  IndianRupee,
  ClipboardList,
  FileText,
  ChevronDown,
  ClipboardCheck,
  FilePlus2,
  Mail,
  MessageCircle,
  History,
  BarChart3,
  KeyRound,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard",   href: "/admin/dashboard",  icon: LayoutDashboard, roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Students",    href: "/admin/students",    icon: UserSquare2,    roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "TC Requests", href: "/admin/tc",          icon: ClipboardList,  roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Teachers",    href: "/admin/teachers",    icon: Users,          roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Fees",        href: "/admin/fees",        icon: IndianRupee,    roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Notices",     href: "/admin/notices",     icon: Bell,           roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Gallery",     href: "/admin/gallery",     icon: Images,         roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Admissions",  href: "/admin/admissions",  icon: GraduationCap,  roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Events",      href: "/admin/events",      icon: CalendarDays,   roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Careers",     href: "/admin/careers",     icon: Briefcase,      roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Media",       href: "/admin/media",       icon: ImagePlus,      roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Settings",    href: "/admin/settings",    icon: Settings,       roles: ["SUPER_ADMIN","ADMIN"] },
];

const progressReportItems = [
  { label: "Reporting Cycles",      href: "/admin/progress-reports/cycles",       icon: CalendarDays,    roles: ["SUPER_ADMIN","ADMIN","EDITOR","TEACHER"] },
  { label: "Student Assessments",   href: "/admin/progress-reports/assessments",  icon: ClipboardCheck,  roles: ["SUPER_ADMIN","ADMIN","TEACHER"] },
  { label: "Report Generation",     href: "/admin/progress-reports/generate",     icon: FilePlus2,       roles: ["SUPER_ADMIN","ADMIN","TEACHER"] },
  { label: "Email Dispatch",        href: "/admin/progress-reports/logs?channel=EMAIL",     icon: Mail,          roles: ["SUPER_ADMIN","ADMIN"] },
  { label: "WhatsApp Notifications",href: "/admin/progress-reports/logs?channel=WHATSAPP",  icon: MessageCircle, roles: ["SUPER_ADMIN","ADMIN"] },
  { label: "Communication Logs",    href: "/admin/progress-reports/logs",         icon: History,         roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
  { label: "Analytics",             href: "/admin/progress-reports/analytics",    icon: BarChart3,       roles: ["SUPER_ADMIN","ADMIN","EDITOR"] },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();
  const role = user?.role ?? "ADMIN";
  const [reportsOpen, setReportsOpen] = useState(pathname.startsWith("/admin/progress-reports"));

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));
  const visibleReportItems = progressReportItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/admin/login");
  };

  return (
    <div className="flex h-full flex-col bg-brand-black border-r border-brand-crimson/15">

      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-brand-crimson/15">
        <Link href={role === "TEACHER" ? "/admin/progress-reports" : "/admin/dashboard"} className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-crimson">
            <GraduationCap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-bold text-white">ASPCS Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-brand-slate hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleNavItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-brand-crimson text-white"
                  : "text-brand-slate hover:bg-brand-crimson/10 hover:text-white"
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}

        {/* Progress Reports — expandable section */}
        {visibleReportItems.length > 0 && (
          <div className="pt-1">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                pathname.startsWith("/admin/progress-reports")
                  ? "bg-brand-crimson/15 text-white"
                  : "text-brand-slate hover:bg-brand-crimson/10 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <FileText size={17} strokeWidth={pathname.startsWith("/admin/progress-reports") ? 2.5 : 2} />
                Progress Reports
              </span>
              <ChevronDown size={14} className={cn("transition-transform", reportsOpen && "rotate-180")} />
            </button>
            {reportsOpen && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/8 pl-3">
                {visibleReportItems.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
                        active
                          ? "bg-brand-crimson text-white"
                          : "text-brand-slate hover:bg-brand-crimson/10 hover:text-white"
                      )}
                    >
                      <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-brand-crimson/15 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-crimson/20 text-xs font-bold text-brand-crimson">
            {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{user?.name ?? "Admin"}</p>
            <p className="truncate text-[10px] text-brand-slate">{user?.role ?? "ADMIN"}</p>
          </div>
        </div>
        <Link
          href="/admin/change-password"
          onClick={onClose}
          className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-slate hover:bg-white/5 hover:text-white transition-all"
        >
          <KeyRound size={16} />
          Change Password
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-slate hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
