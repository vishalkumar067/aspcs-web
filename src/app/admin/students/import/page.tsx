"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileSpreadsheet, Download, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { api, unwrapData } from "@/lib/api";
import toast from "react-hot-toast";

interface ImportRowResult {
  rowNumber: number;
  admissionNo?: string;
  outcome: "CREATED" | "UPDATED" | "FAILED";
  errorMessage?: string;
}
interface ImportSummary {
  batchId: string;
  fileName: string;
  totalRows: number;
  createdCount: number;
  updatedCount: number;
  failedCount: number;
  rows: ImportRowResult[];
}

export default function StudentImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const handleFile = async (file: File) => {
    const validExt = /\.(csv|xlsx|xls)$/i.test(file.name);
    if (!validExt) { toast.error("Only .csv, .xlsx, or .xls files are supported"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large (max 5MB)"); return; }

    setUploading(true);
    setSummary(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.upload("/students/import", formData);
      const result = unwrapData<ImportSummary>(res);
      if (result) {
        setSummary(result);
        toast.success(`${result.createdCount} created, ${result.updatedCount} updated, ${result.failedCount} failed`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      await api.downloadFile("/students/import/template", "student_import_template.xlsx");
    } catch {
      toast.error("Failed to download template");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Import Students</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Upload a CSV or Excel file to add or update students in bulk. Existing admission numbers are updated, new ones are created.
          </p>
        </div>
        <button onClick={handleDownloadTemplate} disabled={downloadingTemplate}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white hover:border-brand-gold/40">
          {downloadingTemplate ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download Template
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
          dragOver ? "border-brand-crimson bg-brand-crimson/5" : "border-white/15 hover:border-white/25"
        }`}
      >
        <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {uploading ? (
          <Loader2 size={32} className="animate-spin text-brand-crimson" />
        ) : (
          <UploadCloud size={32} className="text-brand-slate" />
        )}
        <div>
          <p className="font-medium text-[var(--text-primary)]">
            {uploading ? "Processing your file..." : "Drag & drop a file, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">.csv, .xlsx, or .xls — max 5MB</p>
        </div>
      </div>

      {/* Results */}
      {summary && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard icon={FileSpreadsheet} label="Total Rows" value={summary.totalRows} />
            <SummaryCard icon={CheckCircle2} label="Created" value={summary.createdCount} tone="success" />
            <SummaryCard icon={CheckCircle2} label="Updated" value={summary.updatedCount} tone="info" />
            <SummaryCard icon={XCircle} label="Failed" value={summary.failedCount} tone={summary.failedCount > 0 ? "danger" : undefined} />
          </div>

          {summary.failedCount > 0 && (
            <div className="overflow-hidden rounded-2xl border border-red-400/20">
              <div className="flex items-center gap-2 bg-red-400/5 px-4 py-3 text-sm font-medium text-red-300">
                <AlertTriangle size={14} /> Rows that failed to import
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">Row</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">Admission No</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.rows.filter(r => r.outcome === "FAILED").map(r => (
                    <tr key={r.rowNumber} className="border-b border-white/5">
                      <td className="px-4 py-2 text-[var(--text-muted)]">{r.rowNumber}</td>
                      <td className="px-4 py-2 font-mono text-xs text-[var(--text-muted)]">{r.admissionNo || "-"}</td>
                      <td className="px-4 py-2 text-red-400">{r.errorMessage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-4">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-brand-gold" />
        <p className="text-xs text-white/70">
          Every import is logged with who ran it and exactly what changed. If a row updates an existing student,
          their previous details are saved too — ask an admin to review the import history if anything looks wrong.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }: {
  icon: typeof FileSpreadsheet; label: string; value: number;
  tone?: "success" | "info" | "danger";
}) {
  const toneClass = tone === "success" ? "text-emerald-400" : tone === "danger" ? "text-red-400" : tone === "info" ? "text-blue-400" : "text-brand-slate";
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <Icon size={14} className={`mb-2 ${toneClass}`} />
      <p className="font-display text-xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
