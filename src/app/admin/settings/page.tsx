"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Lock, User, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const user                          = useAuthStore((s) => s.user);
  const [name, setName]               = useState(user?.name ?? "");
  const [email, setEmail]             = useState(user?.email ?? "");
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd]     = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Profile updated successfully");
    setSavingProfile(false);
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      toast.error("All password fields are required");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSavingPwd(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Password changed successfully");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setSavingPwd(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-brand-slate">Manage your admin account settings</p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/8 bg-white/3 p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-crimson/15">
            <User size={16} className="text-brand-crimson" />
          </div>
          <h2 className="font-semibold text-white">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Full Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-crimson/50 focus:ring-2 focus:ring-brand-crimson/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Email Address</label>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand-crimson/50 focus:ring-2 focus:ring-brand-crimson/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Role</label>
            <input
              value={user?.role ?? "ADMIN"} disabled
              className="w-full rounded-xl border border-white/5 bg-white/3 px-4 py-3 text-sm text-brand-slate cursor-not-allowed"
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="btn-primary mt-5 py-2.5 text-sm"
        >
          {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {savingProfile ? "Saving..." : "Save Profile"}
        </button>
      </motion.div>

      {/* Password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/8 bg-white/3 p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gold/15">
            <Lock size={16} className="text-brand-gold" />
          </div>
          <h2 className="font-semibold text-white">Change Password</h2>
        </div>

        <div className="space-y-4">
          {[
            { label: "Current Password",  value: currentPwd, setter: setCurrentPwd },
            { label: "New Password",      value: newPwd,     setter: setNewPwd },
            { label: "Confirm Password",  value: confirmPwd, setter: setConfirmPwd },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="mb-1.5 block text-sm font-medium text-white/80">{label}</label>
              <input
                type="password" value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-crimson/50 focus:ring-2 focus:ring-brand-crimson/20"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleChangePassword}
          disabled={savingPwd}
          className="btn-primary mt-5 py-2.5 text-sm"
        >
          {savingPwd ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
          {savingPwd ? "Updating..." : "Update Password"}
        </button>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/8 bg-white/3 p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15">
            <Bell size={16} className="text-blue-400" />
          </div>
          <h2 className="font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-3">
          {[
            { label: "New admission enquiry",     desc: "Get notified when a new inquiry is submitted" },
            { label: "Notice published",          desc: "Notify when a notice goes live" },
            { label: "Weekly summary",            desc: "Receive a weekly report every Monday" },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4 rounded-xl bg-white/3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-brand-slate">{item.desc}</p>
              </div>
              <div className="relative mt-0.5 h-6 w-11 cursor-pointer rounded-full bg-brand-crimson"
                onClick={() => toast("Notification settings saved")}>
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
