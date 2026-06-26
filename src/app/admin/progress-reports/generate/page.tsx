"use client";
import { useEffect, useState } from "react";
import { Loader2, FileText, Mail, MessageCircle, CheckCircle2, XCircle, Sparkles, Download } from "lucide-react";
import { api, unwrapData, toArray } from "@/lib/api";
import toast from "react-hot-toast";

const CLASSES = ["Nursery","KG I","KG II","Class I","Class II","Class III","Class IV","Class V","Class VI","Class VII","Class VIII","Class IX","Class X"];
const SECTIONS = ["A","B","C","D"];

interface Cycle { id: string; name: string; status: string; }
interface DispatchOutcome {
  studentId: string; studentName: string; reportId?: string;
  pdfGenerated: boolean; emailSent: boolean; whatsappSent: boolean; error?: string;
}

export default function ReportGenerationPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [results, setResults] = useState<DispatchOutcome[] | null>(null);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (reportId: string, studentName: string) => {
    setDownloadingId(reportId);
    try {
      // Backend names the file from the student + cycle itself, so this is
      // just a fallback in case that header is ever missing for some reason.
      await api.downloadFile(`/progress-reports/reports/${reportId}/download`, `${studentName}.pdf`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    api.get("/progress-reports/cycles")
      .then(res => setCycles(toArray<Cycle>(res)))
      .catch(() => toast.error("Failed to load cycles"));
  }, []);

  const handleDispatch = async () => {
    if (!cycleId || !className) { toast.error("Select a cycle and class first"); return; }
    if (!confirm(`Generate and send progress reports for all submitted students in ${className}${section ? " - " + section : ""}? This will email${sendWhatsApp ? " and WhatsApp-notify" : ""} parents.`)) return;

    setDispatching(true);
    setResults(null);
    try {
      const res = await api.post("/progress-reports/dispatch/bulk", {
        cycleId, className, section: section || undefined, sendEmail, sendWhatsApp,
      });
      const outcomes = unwrapData<DispatchOutcome[]>(res) ?? [];
      setResults(outcomes);
      const successCount = outcomes.filter(o => o.pdfGenerated).length;
      toast.success(`Generated ${successCount} of ${outcomes.length} reports`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Dispatch failed");
    } finally { setDispatching(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Report Generation</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Generate PDF reports and notify parents for a whole class in one step.</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="mb-4 flex flex-wrap gap-3">
          <select value={cycleId} onChange={e => setCycleId(e.target.value)}
            className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
            <option value="">Select cycle...</option>
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name} ({c.status})</option>)}
          </select>
          <select value={className} onChange={e => setClassName(e.target.value)}
            className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
            <option value="">Select class...</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={section} onChange={e => setSection(e.target.value)}
            className="rounded-xl border border-white/10 bg-brand-black px-4 py-2.5 text-sm text-white outline-none">
            <option value="">All sections</option>
            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="mb-5 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-brand-crimson" />
            <Mail size={14} /> Send Email
          </label>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={sendWhatsApp} onChange={e => setSendWhatsApp(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-brand-crimson" />
            <MessageCircle size={14} /> Send WhatsApp Notification
          </label>
        </div>

        <p className="mb-4 text-xs text-white/50">
          The PDF is always generated, even if both checkboxes above are unchecked — you can download each one from the results table below.
        </p>

        <button onClick={handleDispatch} disabled={dispatching} className="btn-primary px-5 py-3 text-sm">
          {dispatching ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {dispatching ? "Generating & Sending..." : "Generate Reports & Notify Parents"}
        </button>
      </div>

      {results && (
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Student", "PDF", "Download", "Email", "WhatsApp", "Error"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.studentId} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{r.studentName}</td>
                  <td className="px-4 py-3">{r.pdfGenerated ? <CheckCircle2 size={15} className="text-emerald-400" /> : <XCircle size={15} className="text-red-400" />}</td>
                  <td className="px-4 py-3">
                    {r.pdfGenerated && r.reportId ? (
                      <button onClick={() => handleDownload(r.reportId!, r.studentName)} disabled={downloadingId === r.reportId}
                        className="flex items-center gap-1.5 text-xs font-medium text-brand-gold hover:text-brand-gold/80">
                        {downloadingId === r.reportId ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                        Download
                      </button>
                    ) : <span className="text-white/30">-</span>}
                  </td>
                  <td className="px-4 py-3">{r.emailSent ? <CheckCircle2 size={15} className="text-emerald-400" /> : <span className="text-white/30">-</span>}</td>
                  <td className="px-4 py-3">{r.whatsappSent ? <CheckCircle2 size={15} className="text-emerald-400" /> : <span className="text-white/30">-</span>}</td>
                  <td className="px-4 py-3 text-xs text-red-400">{r.error ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-4">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-gold" />
        <p className="text-xs text-white/70">
          Only assessments with status <span className="font-semibold text-white">SUBMITTED</span> are included.
          Save and submit student assessments first on the Student Assessments page.
        </p>
      </div>
    </div>
  );
}
