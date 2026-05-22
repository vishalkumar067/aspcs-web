"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Bell, Images, Users,
  LogOut, GraduationCap, Settings, X, FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard",  href: "/admin/dashboard",   icon: LayoutDashboard },
  { label: "Notices",    href: "/admin/notices",      icon: Bell },
  { label: "Gallery",    href: "/admin/gallery",      icon: Images },
  { label: "Admissions", href: "/admin/admissions",   icon: Users },
  { label: "Events",     href: "/admin/events",       icon: FileText },
  { label: "Settings",   href: "/admin/settings",     icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <div className="flex h-full flex-col bg-brand-black border-r border-brand-crimson/15">

      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-brand-crimson/15">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon    = item.icon;
          const active  = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-crimson text-white shadow-glow-crimson"
                  : "text-brand-slate hover:bg-brand-crimson/10 hover:text-white"
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-brand-crimson/15 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-crimson/20 text-xs font-bold text-brand-crimson">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">{user?.name ?? "Admin"}</p>
            <p className="truncate text-[10px] text-brand-slate">{user?.role ?? "ADMIN"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-slate transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
