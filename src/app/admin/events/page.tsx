"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Pencil, Trash2, X, Save, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type EventCategory = "ACADEMIC" | "CULTURAL" | "SPORTS" | "HOLIDAY" | "EXAM";
type SchoolEvent = {
  id: string; title: string; category: EventCategory;
  startDate: string; venue?: string; isHighlight: boolean; description?: string;
};

const MOCK_EVENTS: SchoolEvent[] = [
  { id: "1", title: "Annual Sports Day",        category: "SPORTS",   startDate: "2025-05-15", venue: "School Ground",    isHighlight: true },
  { id: "2", title: "Science Exhibition",        category: "ACADEMIC", startDate: "2025-05-22", venue: "School Hall",      isHighlight: true },
  { id: "3", title: "Cultural Fest 2025",        category: "CULTURAL", startDate: "2025-06-05", venue: "Main Auditorium",  isHighlight: true },
  { id: "4", title: "Summer Vacation Begins",    category: "HOLIDAY",  startDate: "2025-05-31", venue: "",                 isHighlight: false },
  { id: "5", title: "Pre-Board Examination",     category: "EXAM",     startDate: "2025-06-10", venue: "Classrooms",       isHighlight: false },
];

const categoryColors: Record<EventCategory, string> = {
  ACADEMIC: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  CULTURAL: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  SPORTS:   "bg-green-500/15 text-green-300 border-green-500/30",
  HOLIDAY:  "bg-amber-500/15 text-amber-300 border-amber-500/30",
  EXAM:     "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

const categories: EventCategory[] = ["ACADEMIC", "CULTURAL", "SPORTS", "HOLIDAY", "EXAM"];

function EventModal({ event, onClose, onSave }: {
  event?: SchoolEvent | null;
  onClose: () => void;
  onSave: (data: Partial<SchoolEvent>) => void;
}) {
  const [title, setTitle]           = useState(event?.title ?? "");
  const [category, setCategory]     = useState<EventCategory>(event?.category ?? "ACADEMIC");
  const [startDate, setStartDate]   = useState(event?.startDate ?? "");
  const [venue, setVenue]           = useState(event?.venue ?? "");
  const [highlight, setHighlight]   = useState(event?.isHighlight ?? false);
  const [description, setDesc]      = useState(event?.description ?? "");
  const [saving, setSaving]         = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !startDate) { toast.error("Title and date are required"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave({ title, category, startDate, venue, isHighlight: highlight, description });
    setSaving(false);
    toast.success(event ? "Event updated!" : "Event created!");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-brand-crimson/20 bg-brand-black p-6 shadow-glass"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{event ? "Edit Event" : "Add Event"}</h3>
          <button onClick={onClose} className="text-brand-slate hover:text-white"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Event Title *</label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day 2025"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50 focus:ring-2 focus:ring-brand-crimson/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Category</label>
              <select
                value={category} onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full rounded-xl border border-white/10 bg-brand-black px-4 py-3 text-sm text-white outline-none focus:border-brand-crimson/50"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Date *</label>
              <input
                type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white [color-scheme:dark] outline-none focus:border-brand-crimson/50"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Venue</label>
            <input
              value={venue} onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. School Auditorium"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Description</label>
            <textarea
              value={description} onChange={(e) => setDesc(e.target.value)}
              rows={3} placeholder="Optional description..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setHighlight(!highlight)}
              className={cn("relative h-6 w-11 rounded-full transition-colors", highlight ? "bg-brand-crimson" : "bg-white/10")}
            >
              <div className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform", highlight ? "translate-x-6" : "translate-x-1")} />
            </div>
            <span className="text-sm text-white/80">Mark as Highlight</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-brand-slate hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-sm">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Event"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents]         = useState<SchoolEvent[]>(MOCK_EVENTS);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editEvent, setEditEvent]   = useState<SchoolEvent | null>(null);

  const handleSave = (data: Partial<SchoolEvent>) => {
    if (editEvent) {
      setEvents((prev) => prev.map((e) => e.id === editEvent.id ? { ...e, ...data } : e));
    } else {
      setEvents((prev) => [{
        id: Date.now().toString(), title: data.title!, category: data.category!,
        startDate: data.startDate!, venue: data.venue, isHighlight: data.isHighlight ?? false,
        description: data.description,
      }, ...prev]);
    }
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Events</h1>
          <p className="mt-1 text-sm text-brand-slate">{events.length} events scheduled</p>
        </div>
        <button onClick={() => { setEditEvent(null); setModalOpen(true); }} className="btn-primary py-2.5 text-sm">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {["Event", "Category", "Date", "Venue", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/5 transition-colors hover:bg-white/3"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="shrink-0 text-brand-gold" />
                    <span className="font-medium text-white">{event.title}</span>
                    {event.isHighlight && (
                      <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2 py-0.5 text-[10px] font-bold text-brand-gold">
                        Highlight
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase", categoryColors[event.category])}>
                    {event.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-brand-slate">{event.startDate}</td>
                <td className="px-5 py-4 text-brand-slate">{event.venue || "—"}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditEvent(event); setModalOpen(true); }}
                      className="rounded-lg p-1.5 text-brand-slate hover:bg-white/5 hover:text-brand-gold">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteEvent(event.id)}
                      className="rounded-lg p-1.5 text-brand-slate hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="py-16 text-center text-brand-slate">No events yet.</div>}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <EventModal event={editEvent} onClose={() => setModalOpen(false)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
}
