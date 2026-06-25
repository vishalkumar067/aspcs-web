"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const router = useRouter();
  const role = useAuthStore(s => s.user?.role);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill in all fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setSaving(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      router.push(role === "TEACHER" ? "/admin/progress-reports" : "/admin/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Change Password</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Update your account password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/8 bg-white/3 p-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/70">Current Password</label>
          <input type={showPasswords ? "text" : "password"} value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)} autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/70">New Password</label>
          <input type={showPasswords ? "text" : "password"} value={newPassword}
            onChange={e => setNewPassword(e.target.value)} autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          <p className="mt-1 text-[11px] text-white/40">At least 8 characters.</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/70">Confirm New Password</label>
          <input type={showPasswords ? "text" : "password"} value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
        </div>

        <button type="button" onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center gap-1.5 text-xs text-brand-slate hover:text-white">
          {showPasswords ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPasswords ? "Hide" : "Show"} passwords
        </button>

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-2.5 text-sm">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
          {saving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
