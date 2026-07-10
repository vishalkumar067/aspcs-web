"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Save, Loader2, KeyRound, Shield } from "lucide-react";
import { api, toArray } from "@/lib/api";
import toast from "react-hot-toast";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "TEACHER", "STUDENT"];
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin", ADMIN: "Admin", EDITOR: "Editor",
  TEACHER: "Teacher", STUDENT: "Student",
};
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-brand-crimson/20 text-red-300",
  ADMIN: "bg-purple-500/20 text-purple-300",
  EDITOR: "bg-blue-500/20 text-blue-300",
  TEACHER: "bg-emerald-500/20 text-emerald-300",
  STUDENT: "bg-amber-500/20 text-amber-300",
};

interface User {
  id: string; name: string; email: string; role: string;
  teacherId?: string; createdAt?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [modal, setModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const [saving, setSaving] = useState(false);

  const [resetModal, setResetModal] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(toArray(res));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load users");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "EDITOR" });
    setModal(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editUser) {
        await api.put(`/auth/users/${editUser.id}`, { name: form.name, email: form.email, role: form.role });
        toast.success("User updated");
      } else {
        if (!form.password || form.password.length < 8) {
          toast.error("Password must be at least 8 characters");
          setSaving(false);
          return;
        }
        await api.post("/auth/users", form);
        toast.success("User created");
      }
      setModal(false);
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`)) return;
    try {
      await api.delete(`/auth/users/${u.id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleResetPassword = async () => {
    if (!resetModal) return;
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setResetting(true);
    try {
      await api.post(`/auth/users/${resetModal.id}/reset-password`, { newPassword });
      toast.success(`Password reset for ${resetModal.name}`);
      setResetModal(null);
      setNewPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Reset failed");
    } finally { setResetting(false); }
  };

  const filtered = users.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-brand-crimson" size={28} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">User Management</h1>
          <p className="mt-1 text-sm text-brand-slate">{users.length} users</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none" />
        </div>
        <select data-theme="dark-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none">
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Name", "Email", "Role", "Created", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-crimson/20 text-xs font-bold text-brand-crimson">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-slate">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${ROLE_COLORS[u.role] ?? "bg-white/10 text-white/70"}`}>
                    <Shield size={10} />
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-brand-slate">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(u)} title="Edit"
                      className="rounded-lg p-1.5 text-brand-slate hover:bg-white/10 hover:text-white"><Pencil size={14} /></button>
                    <button onClick={() => { setResetModal(u); setNewPassword(""); }} title="Reset Password"
                      className="rounded-lg p-1.5 text-brand-slate hover:bg-white/10 hover:text-brand-gold"><KeyRound size={14} /></button>
                    <button onClick={() => handleDelete(u)} title="Delete"
                      className="rounded-lg p-1.5 text-brand-slate hover:bg-white/10 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-brand-slate">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass"
              onClick={e => e.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">
                  {editUser ? "Edit User" : "Create User"}
                </h2>
                <button onClick={() => setModal(false)} className="text-brand-slate hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
                </div>
                {!editUser && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-white/70">Password (min 8 characters)</label>
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-xs font-medium text-white/70">Role</label>
                  <select data-theme="dark-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-brand-black px-3 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50">
                    {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button onClick={() => setModal(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white hover:bg-white/5">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {editUser ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setResetModal(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass"
              onClick={e => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">Reset Password</h2>
                <button onClick={() => setResetModal(null)} className="text-brand-slate hover:text-white"><X size={18} /></button>
              </div>
              <p className="mb-3 text-sm text-brand-slate">
                Set a new password for <span className="font-medium text-white">{resetModal.name}</span> ({resetModal.email})
              </p>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-crimson/50" />
              <div className="mt-4 flex gap-2">
                <button onClick={() => setResetModal(null)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white hover:bg-white/5">Cancel</button>
                <button onClick={handleResetPassword} disabled={resetting} className="btn-primary flex-1 justify-center py-2.5 text-sm">
                  {resetting ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                  Reset Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
