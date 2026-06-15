"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ScrollText,
  IndianRupee,
  ClipboardList,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard",   href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "Students",    href: "/admin/students",    icon: UserSquare2     },
  { label: "TC Requests", href: "/admin/tc",          icon: ClipboardList   },
  { label: "Teachers",    href: "/admin/teachers",    icon: Users           },
  { label: "Fees",        href: "/admin/fees",        icon: IndianRupee     },
  { label: "Notices",     href: "/admin/notices",     icon: Bell            },
  { label: "Gallery",     href: "/admin/gallery",     icon: Images          },
  { label: "Admissions",  href: "/admin/admissions",  icon: GraduationCap   },
  { label: "Events",      href: "/admin/events",      icon: CalendarDays    },
  { label: "Careers",     href: "/admin/careers",     icon: Briefcase       },
  { label: "Media",       href: "/admin/media",       icon: ImagePlus       },
  { label: "Settings",    href: "/admin/settings",    icon: Settings        },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
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
