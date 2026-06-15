"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, toArray, uploadImage } from "@/lib/api";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  imageUrl?: string;
  isHighlight: boolean;
  category: string;
  createdAt: string;
}

const CATEGORIES = ["ACADEMIC", "SPORTS", "CULTURAL", "RELIGIOUS", "EXAM", "HOLIDAY", "OTHER"];

function EventModal({ event, onClose, onSaved }: { event?: Event | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title:       event?.title       ?? "",
    description: event?.description ?? "",
    startDate:   event?.startDate   ?? "",
    endDate:     event?.endDate     ?? "",
    venue:       event?.venue       ?? "",
    category:    event?.category    ?? "ACADEMIC",
    isHighlight: event?.isHighlight ?? false,
    imageUrl:    event?.imageUrl    ?? "",
  });
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { setForm(f => ({ ...f, imageUrl: await uploadImage(file, "aspcs/events") })); toast.success("Image uploaded!"); }
    catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.startDate) { toast.error("Title and start date are required"); return; }
    setSaving(true);
    try {
      event?.id ? await api.put(`/events/${event.id}`, form) : await api.post("/events", form);
      toast.success(event?.id ? "Event updated!" : "Event created!");
      onSaved(); onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{event ? "Edit Event" : "Add Event"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Title <span className="text-brand-gold">*</span></label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Event name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Event details..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Start Date <span className="text-brand-gold">*</span></label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Venue</label>
              <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
                placeholder="School auditorium"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">Event Image</label>
            <div className="flex gap-2">
              <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="Image URL or upload →"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-crimson/50" />
              <label className={cn("flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-brand-slate hover:text-white", uploading && "pointer-events-none opacity-50")}>
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? "..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-full rounded-lg object-cover opacity-80" />}
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <div onClick={() => setForm(f => ({ ...f, isHighlight: !f.isHighlight }))}
              className={cn("relative h-5 w-9 rounded-full transition-colors", form.isHighlight ? "bg-brand-crimson" : "bg-white/10")}>
              <div className={cn("absolute top-0 h-5 w-5 rounded-full bg-white shadow transition-transform", form.isHighlight ? "translate-x-4" : "translate-x-0")} />
            </div>
            <span className="text-sm text-white/70">Feature on homepage</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : event ? "Update" : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminEventsPage() {
  const [events,    setEvents]    = useState<Event[]>([]);   // always an array
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const raw = await api.get<unknown>("/events?size=100&sort=startDate,desc");
      setEvents(toArray<Event>(raw));          // ← never undefined
    } catch {
      toast.error("Failed to load events");
      setEvents([]);                           // ← safe fallback
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try { await api.delete(`/events/${id}`); toast.success("Deleted"); fetchEvents(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Events</h1>
          <p className="mt-1 text-sm text-brand-slate">{events.length} events</p>
        </div>
        <button onClick={() => { setEditEvent(null); setModal(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev, i) => (
            <motion.div key={ev.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card overflow-hidden">
              {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} className="h-36 w-full object-cover" />}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-[var(--text-primary)]">{ev.title}</h3>
                  {ev.isHighlight && <span className="shrink-0 rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] text-brand-gold">Featured</span>}
                </div>
                <p className="text-xs text-[var(--text-muted)]">{ev.category}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {new Date(ev.startDate).toLocaleDateString("en-IN")}
                  {ev.endDate && ` – ${new Date(ev.endDate).toLocaleDateString("en-IN")}`}
                </p>
                {ev.venue && <p className="mt-0.5 text-xs text-[var(--text-muted)]">📍 {ev.venue}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setEditEvent(ev); setModal(true); }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-brand-slate hover:text-brand-gold">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(ev.id)} className="rounded-xl border border-white/10 p-2 text-brand-slate hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {events.length === 0 && <div className="col-span-full py-16 text-center text-brand-slate">No events yet.</div>}
        </div>
      )}

      <AnimatePresence>
        {modal && <EventModal event={editEvent} onClose={() => { setModal(false); setEditEvent(null); }} onSaved={fetchEvents} />}
      </AnimatePresence>
    </div>
  );
}
