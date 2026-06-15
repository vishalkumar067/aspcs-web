"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Eye, EyeOff, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray, uploadImage, uploadPDF } from "@/lib/api";
import toast from "react-hot-toast";

interface Notice {
  id: string;
  title: string;
  description?: string;
  category: string;
  pdfUrl?: string;
  imageUrl?: string;
  important: boolean;
  published: boolean;
  createdAt: string;
}

const CATEGORIES = ["GENERAL", "ACADEMIC", "EXAMINATION", "ADMISSION", "EVENT", "HOLIDAY", "CIRCULAR"];

function NoticeModal({ notice, onClose, onSaved }: {
  notice?: Notice | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title:       notice?.title       ?? "",
    description: notice?.description ?? "",
    category:    notice?.category    ?? "GENERAL",
    important:   notice?.important   ?? false,
    published:   notice?.published   ?? false,
    pdfUrl:      notice?.pdfUrl      ?? "",
    imageUrl:    notice?.imageUrl    ?? "",
  });
  const [saving,       setSaving]      = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // ── await is OUTSIDE setForm — fixes "await in non-async function" ──────────
  const handlePDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const url = await uploadPDF(file, "aspcs/notices");   // await here ✓
      setForm(f => ({ ...f, pdfUrl: url }));                // plain setter ✓
      toast.success("PDF uploaded!");
    } catch {
      toast.error("PDF upload failed");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await uploadImage(file, "aspcs/notices"); // await here ✓
      setForm(f => ({ ...f, imageUrl: url }));              // plain setter ✓
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (notice?.id) {
        await api.put(`/notices/${notice.id}`, form);
        toast.success("Notice updated!");
      } else {
        await api.post("/notices", form);
        toast.success("Notice created!");
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{notice ? "Edit Notice" : "New Notice"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Title <span className="text-brand-gold">*</span></label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Notice title"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Notice details..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Attach PDF</label>
            <div className="flex gap-2">
              <input value={form.pdfUrl} onChange={e => setForm({ ...form, pdfUrl: e.target.value })}
                placeholder="PDF URL or upload →"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
              <label className={cn("flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-brand-slate hover:text-white",
                uploadingPdf && "pointer-events-none opacity-50")}>
                {uploadingPdf ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploadingPdf ? "..." : "Upload"}
                <input type="file" accept=".pdf" className="hidden" onChange={handlePDF} />
              </label>
            </div>
            {form.pdfUrl && <p className="mt-1 truncate text-[10px] text-brand-gold">{form.pdfUrl}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Image</label>
            <div className="flex gap-2">
              <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="Image URL or upload →"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
              <label className={cn("flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-brand-slate hover:text-white",
                uploadingImg && "pointer-events-none opacity-50")}>
                {uploadingImg ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploadingImg ? "..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-20 w-full rounded-lg object-cover opacity-80" />}
          </div>

          <div className="flex gap-4">
            {(["important", "published"] as const).map(key => (
              <label key={key} className="flex cursor-pointer items-center gap-2">
                <div onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                  className={cn("relative h-5 w-9 rounded-full transition-colors", form[key] ? "bg-brand-crimson" : "bg-white/10")}>
                  <div className={cn("absolute top-0 h-5 w-5 rounded-full bg-white shadow transition-transform", form[key] ? "translate-x-4" : "translate-x-0")} />
                </div>
                <span className="text-xs text-white/70">{key === "important" ? "Mark as Important" : "Publish Now"}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : notice ? "Update" : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminNoticesPage() {
  const [notices,    setNotices]    = useState<Notice[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  const [search,     setSearch]     = useState("");

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const raw = await api.get<unknown>("/notice");
      setNotices(toArray<Notice>(raw));
    } catch {
      toast.error("Failed to load notices");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try { await api.delete(`/notices/${id}`); toast.success("Deleted"); fetchNotices(); }
    catch { toast.error("Delete failed"); }
  };

  const togglePublish = async (notice: Notice) => {
    try {
      await api.patch(`/notices/${notice.id}/publish`, { published: !notice.published });
      fetchNotices();
    } catch {
      try { await api.put(`/notices/${notice.id}`, { ...notice, published: !notice.published }); fetchNotices(); }
      catch { toast.error("Update failed"); }
    }
  };

  const filtered = notices.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Notices</h1>
          <p className="mt-1 text-sm text-brand-slate">{notices.length} total · {notices.filter(n => n.published).length} published</p>
        </div>
        <button onClick={() => { setEditNotice(null); setModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Add Notice
        </button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search notices..."
        className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Title", "Category", "Status", "Date", ""].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((n, i) => (
                <motion.tr key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-white">{n.title}</p>
                    {n.important && <span className="text-[10px] text-brand-gold">★ Important</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-brand-slate">{n.category}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                      n.published ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-600")}>
                      {n.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-brand-slate">
                    {new Date(n.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => togglePublish(n)} className="rounded-lg p-1.5 text-brand-slate hover:text-brand-gold">
                        {n.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => { setEditNotice(n); setModal(true); }}
                        className="rounded-lg p-1.5 text-brand-slate hover:text-brand-gold"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(n.id)}
                        className="rounded-lg p-1.5 text-brand-slate hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-brand-slate">
              {search ? "No notices match your search." : "No notices yet."}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modal && <NoticeModal notice={editNotice}
          onClose={() => { setModal(false); setEditNotice(null); }} onSaved={fetchNotices} />}
      </AnimatePresence>
    </div>
  );
}
