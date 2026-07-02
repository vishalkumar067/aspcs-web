"use client";
import { useEffect, useState, useMemo } from "react";
import { Loader2, Save, Send, Search, AlertTriangle, Sparkles } from "lucide-react";
import { api, unwrapData } from "@/lib/api";
import toast from "react-hot-toast";

const CLASSES = ["Nursery","KG I","KG II","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X"];
const SECTIONS = ["A","B","C","D"];
const BEHAVIOUR_FIELDS = [
  { key: "disciplineScore",     label: "Discipline" },
  { key: "homeworkScore",       label: "Homework" },
  { key: "participationScore",  label: "Participation" },
  { key: "punctualityScore",    label: "Punctuality" },
  { key: "communicationScore",  label: "Communication" },
  { key: "teamworkScore",       label: "Teamwork" },
] as const;
const RATINGS = ["OUTSTANDING", "EXCELLENT", "GOOD", "AVERAGE", "NEEDS_IMPROVEMENT"];

interface Cycle { id: string; name: string; status: string; }
interface SubjectColumn { subjectId: string; subjectName: string; subjectCode: string; }
interface GridRow {
  studentId: string; rollNo?: string; fullName: string;
  assessmentId?: string; status?: string;
  workingDays?: number; presentDays?: number; attendancePct?: number;
  disciplineScore?: number; homeworkScore?: number; participationScore?: number;
  punctualityScore?: number; communicationScore?: number; teamworkScore?: number;
  teacherRemarks?: string;
  subjectMarks: Record<string, number>;
  subjectRatings: Record<string, string>;
  subjectRemarks: Record<string, string>;
}
interface GridResponse { subjectColumns: SubjectColumn[]; rows: GridRow[]; performanceMode: "MARKS" | "RATING"; }

export default function AssessmentEntryPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [grid, setGrid] = useState<GridResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/progress-reports/cycles?status=OPEN")
      .then(res => setCycles((unwrapData<Cycle[]>(res)) ?? []))
      .catch(() => toast.error("Failed to load cycles"));
  }, []);

  const loadGrid = async () => {
    if (!cycleId || !className) { toast.error("Select a cycle and class first"); return; }
    setLoading(true);
    try {
      const q = new URLSearchParams({ cycleId, className });
      if (section) q.set("section", section);
      const res = await api.get(`/progress-reports/assessments/grid?${q}`);
      const data = unwrapData<GridResponse>(res);
      // Ensure subjectRemarks is always an object, never null/undefined —
      // V14 added this field, so existing rows may not have it in the response.
      if (data) {
        data.rows = data.rows.map(r => ({
          ...r,
          subjectRemarks: r.subjectRemarks ?? {},
        }));
      }
      setGrid(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load grid");
      setGrid(null);
    } finally { setLoading(false); }
  };

  const updateRow = (studentId: string, patch: Partial<GridRow>) => {
    if (!grid) return;
    setGrid({ ...grid, rows: grid.rows.map(r => r.studentId === studentId ? { ...r, ...patch } : r) });
  };

  const updateSubjectValue = (studentId: string, subjectId: string, value: string) => {
    if (!grid) return;
    setGrid({
      ...grid,
      rows: grid.rows.map(r => {
        if (r.studentId !== studentId) return r;
        if (grid.performanceMode === "MARKS") {
          return { ...r, subjectMarks: { ...r.subjectMarks, [subjectId]: Number(value) } };
        }
        return { ...r, subjectRatings: { ...r.subjectRatings, [subjectId]: value } };
      })
    });
  };

  const updateSubjectRemarks = (studentId: string, subjectId: string, value: string) => {
    if (!grid) return;
    setGrid({
      ...grid,
      rows: grid.rows.map(r => {
        if (r.studentId !== studentId) return r;
        return { ...r, subjectRemarks: { ...r.subjectRemarks, [subjectId]: value } };
      })
    });
  };

  const filteredRows = useMemo(() => {
    if (!grid) return [];
    if (!search.trim()) return grid.rows;
    const q = search.toLowerCase();
    return grid.rows.filter(r => r.fullName.toLowerCase().includes(q) || r.rollNo?.toLowerCase().includes(q));
  }, [grid, search]);

  const handleSave = async (submit: boolean) => {
    if (!grid) return;
    if (submit && !confirm(`Submit assessments for ${grid.rows.length} students? This locks them for editing once a report is generated.`)) return;
    setSaving(true);
    try {
      const rows = grid.rows.map(r => ({
        studentId: r.studentId,
        workingDays: r.workingDays, presentDays: r.presentDays,
        disciplineScore: r.disciplineScore, homeworkScore: r.homeworkScore,
        participationScore: r.participationScore, punctualityScore: r.punctualityScore,
        communicationScore: r.communicationScore, teamworkScore: r.teamworkScore,
        teacherRemarks: r.teacherRemarks,
        subjectMarks: r.subjectMarks, subjectRatings: r.subjectRatings,
        subjectRemarks: r.subjectRemarks,
      }));
      await api.post("/progress-reports/assessments/bulk-save", { cycleId, className, section, rows, submit });
      toast.success(submit ? "Assessments submitted!" : "Draft saved");
      loadGrid();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const handleSubmitSingle = async (row: GridRow) => {
    if (!grid) return;
    if (!confirm(`Submit assessment for ${row.fullName}? This locks it for editing once a report is generated.`)) return;
    setSubmittingId(row.studentId);
    try {
      const payload = {
        studentId: row.studentId,
        workingDays: row.workingDays, presentDays: row.presentDays,
        disciplineScore: row.disciplineScore, homeworkScore: row.homeworkScore,
        participationScore: row.participationScore, punctualityScore: row.punctualityScore,
        communicationScore: row.communicationScore, teamworkScore: row.teamworkScore,
        teacherRemarks: row.teacherRemarks,
        subjectMarks: row.subjectMarks, subjectRatings: row.subjectRatings,
        subjectRemarks: row.subjectRemarks,
      };
      await api.post("/progress-reports/assessments/bulk-save", { cycleId, className, section, rows: [payload], submit: true });
      toast.success(`${row.fullName} submitted!`);
      loadGrid();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Submit failed");
    } finally { setSubmittingId(null); }
  };
const [generatingId, setGeneratingId] = useState<string | null>(null);

const handleGenerateRemarks = async (row: GridRow) => {
  if (!grid) return;

  setGeneratingId(row.studentId);

  try {
    // Subject performance
    const subjectPerformance: Record<string, string> = {};

    for (const sub of grid.subjectColumns) {
      const rating = row.subjectRatings?.[sub.subjectId];
      const marks = row.subjectMarks?.[sub.subjectId];

      if (rating) {
        subjectPerformance[sub.subjectName] = rating;
      } else if (marks !== undefined && marks !== null) {
        subjectPerformance[sub.subjectName] = String(marks);
      }
    }

    // First name
    const firstName = row.fullName.trim().split(" ")[0];

    // Attendance
    const attendancePct =
      row.workingDays && row.presentDays
        ? Math.round((row.presentDays / row.workingDays) * 100)
        : null;

    // Average Marks
    const marks = Object.values(row.subjectMarks).filter(
      (m): m is number => typeof m === "number" && !isNaN(m)
    );

    const averageMarks =
      marks.length > 0
        ? +(marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1)
        : null;

    // Overall Performance
    let overallPerformance = "Average";

    if (averageMarks !== null) {
      if (averageMarks >= 90) overallPerformance = "Outstanding";
      else if (averageMarks >= 75) overallPerformance = "Excellent";
      else if (averageMarks >= 60) overallPerformance = "Good";
      else if (averageMarks >= 40) overallPerformance = "Average";
      else overallPerformance = "Needs Improvement";
    }

    // Different writing style every time
    const writingStyles = [
      "warm",
      "professional",
      "teacher-like",
      "encouraging",
      "motivational",
      "friendly",
      "positive",
      "academic",
    ];

    const writingStyle =
      writingStyles[Math.floor(Math.random() * writingStyles.length)];

    const res = await api.post("/progress-reports/ai-remarks/generate", {
      studentName: row.fullName,
      studentFirstName: firstName,

      className,
      section,

      attendancePct,
      averageMarks,
      overallPerformance,

      behaviour: {
        discipline: row.disciplineScore,
        homework: row.homeworkScore,
        participation: row.participationScore,
        punctuality: row.punctualityScore,
        communication: row.communicationScore,
        teamwork: row.teamworkScore,
      },

      subjectPerformance,

      writingStyle,
    });

    const data = unwrapData<{ remarks: string }>(res);

    if (data?.remarks) {
      updateRow(row.studentId, {
        teacherRemarks: data.remarks,
      });

      toast.success("Remarks generated!");
    }
  } catch (err: unknown) {
    toast.error(
      err instanceof Error ? err.message : "Generation failed"
    );
  } finally {
    setGeneratingId(null);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Student Assessments</h1>
        <p className="mt-1 text-sm text-brand-slate">Enter attendance, academic performance, and behaviour for a class.</p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap gap-3">
        <select data-theme="dark-select" value={cycleId} onChange={e => setCycleId(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          <option value="">Select cycle...</option>
          {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select data-theme="dark-select" value={className} onChange={e => setClassName(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          <option value="">Select class...</option>
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select data-theme="dark-select" value={section} onChange={e => setSection(e.target.value)}
          className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
          <option value="">All sections</option>
          {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={loadGrid} disabled={loading} className="btn-primary px-5 py-2.5 text-sm">
          {loading ? <Loader2 size={15} className="animate-spin" /> : "Load Students"}
        </button>
      </div>

      {grid && (
        <>
          {/* Search + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-xs flex-1">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-brand-crimson/50" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white hover:border-brand-gold/40">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary px-4 py-2.5 text-sm">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit All
              </button>
            </div>
          </div>

          {/* Mobile-friendly: card list instead of a wide table */}
          <div className="space-y-3">
            {filteredRows.map(row => (
              <div key={row.studentId} className={`rounded-2xl border p-4 ${row.status === "LOCKED" ? "border-white/5 bg-white/2 opacity-60" : "border-white/8 bg-white/3"}`}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{row.fullName}</p>
                    <p className="text-xs text-brand-slate">Roll No: {row.rollNo ?? "-"}</p>
                  </div>
                  {row.status && (
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                      row.status === "SUBMITTED" ? "border-blue-200 bg-blue-50 text-blue-700" :
                      row.status === "LOCKED" ? "border-gray-200 bg-gray-50 text-gray-600" :
                      "border-amber-200 bg-amber-50 text-amber-700"}`}>
                      {row.status}
                    </span>
                  )}
                </div>

                {row.status === "LOCKED" ? (
                  <p className="flex items-center gap-2 text-xs text-brand-slate">
                    <AlertTriangle size={12} /> Locked — this report has already been generated.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {/* Attendance */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="mb-1 block text-[11px] text-white/60">Working Days</label>
                        <input type="number" value={row.workingDays ?? ""} onChange={e => updateRow(row.studentId, { workingDays: Number(e.target.value) })}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white outline-none" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] text-white/60">Present Days</label>
                        <input type="number" value={row.presentDays ?? ""} onChange={e => updateRow(row.studentId, { presentDays: Number(e.target.value) })}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white outline-none" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] text-white/60">Attendance %</label>
                        <div className="rounded-lg border border-white/5 bg-white/3 px-2.5 py-2 text-sm text-white/50">
                          {row.workingDays && row.presentDays ? ((row.presentDays / row.workingDays) * 100).toFixed(1) + "%" : "-"}
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
  {grid.subjectColumns.map(sub => (
    <div key={sub.subjectId}>
      <label className="mb-1 block text-[11px] text-white/60">
        {sub.subjectName}
      </label>

      {grid.performanceMode === "MARKS" ? (
        <input
          type="number"
          min={0}
          max={100}
          value={row.subjectMarks[sub.subjectId] ?? ""}
          onChange={e =>
            updateSubjectValue(row.studentId, sub.subjectId, e.target.value)
          }
          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20"
        />
      ) : (
        <select
          data-theme="dark-select"
          value={row.subjectRatings[sub.subjectId] ?? ""}
          onChange={e =>
            updateSubjectValue(row.studentId, sub.subjectId, e.target.value)
          }
          className="w-full rounded-lg border border-white/10 bg-brand-black px-2.5 py-2 text-xs text-white outline-none transition-colors focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20"
        >
          <option value="">-</option>
          {RATINGS.map(r => (
            <option key={r} value={r}>
              {r.replace("_", " ")}
            </option>
          ))}
        </select>
      )}

      <input
        type="text"
        placeholder="Remarks..."
        value={row.subjectRemarks[sub.subjectId] ?? ""}
        onChange={e =>
          updateSubjectRemarks(row.studentId, sub.subjectId, e.target.value)
        }
        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-white placeholder:text-white/40 outline-none transition-colors focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20"
      />
    </div>
  ))}
</div>

                    {/* Behaviour */}
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {BEHAVIOUR_FIELDS.map(f => (
                        <div key={f.key}>
                          <label className="mb-1 block text-[11px] text-white/60">{f.label}</label>
                          <select data-theme="dark-select" value={(row as unknown as Record<string, number | undefined>)[f.key] ?? ""}
                            onChange={e => updateRow(row.studentId, { [f.key]: Number(e.target.value) })}
                            className="w-full rounded-lg border border-white/10 bg-brand-black px-2 py-2 text-xs text-white outline-none">
                            <option value="">-</option>
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>

                    {/* Remarks */}
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-[11px] text-white/60">Teacher Remarks</label>
                        {row.status !== "SUBMITTED" && row.status !== "LOCKED" && (
                          <button onClick={() => handleGenerateRemarks(row)} disabled={generatingId === row.studentId}
                            className="flex items-center gap-1 rounded-md bg-brand-gold/15 px-2 py-0.5 text-[10px] font-medium text-brand-gold hover:bg-brand-gold/25 disabled:opacity-50">
                            {generatingId === row.studentId ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                            AI Generate
                          </button>
                        )}
                      </div>
                      <textarea value={row.teacherRemarks ?? ""} onChange={e => updateRow(row.studentId, { teacherRemarks: e.target.value })}
                        rows={2} placeholder="Add remarks, or generate with AI on the Report Generation page..."
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white placeholder:text-white/25 outline-none" />
                    </div>

                    {/* Per-student Submit */}
                    {row.status !== "SUBMITTED" && row.status !== "LOCKED" && (
                      <div className="flex justify-end pt-1">
                        <button onClick={() => handleSubmitSingle(row)} disabled={submittingId === row.studentId}
                          className="flex items-center gap-1.5 rounded-lg bg-brand-crimson/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-crimson disabled:opacity-50">
                          {submittingId === row.studentId ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {filteredRows.length === 0 && (
              <div className="rounded-2xl border border-white/8 py-12 text-center text-brand-slate">
                No students match your search.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
