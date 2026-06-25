"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, MessageCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { api, toArray, unwrapData } from "@/lib/api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface LogEntry {
  id: string; channel: "EMAIL" | "WHATSAPP"; recipient: string;
  subject?: string; messagePreview?: string;
  status: "PENDING" | "SENT" | "DELIVERED" | "FAILED";
  errorMessage?: string; sentAt?: string; createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  SENT:      "border-emerald-200 bg-emerald-50 text-emerald-700",
  DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FAILED:    "border-red-200 bg-red-50 text-red-700",
  PENDING:   "border-amber-200 bg-amber-50 text-amber-700",
};

function CommunicationLogsContent() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(searchParams.get("channel") ?? "");
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ size: "50" });
      if (channel) q.set("channel", channel);
      setLogs(toArray<LogEntry>(await api.get(`/progress-reports/communication-logs?${q}`)));
    } catch { toast.error("Failed to load logs"); setLogs([]); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchLogs(); }, [channel]);
  useEffect(() => {
    api.get("/progress-reports/communication-logs/stats")
      .then(res => setStats(unwrapData<Record<string, number>>(res)))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Communication Logs</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Full history of emails and WhatsApp notifications sent to parents.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Emails Sent", value: stats.emailSent, icon: Mail },
            { label: "Emails Failed", value: stats.emailFailed, icon: Mail },
            { label: "WhatsApp Sent", value: stats.whatsappSent, icon: MessageCircle },
            { label: "WhatsApp Failed", value: stats.whatsappFailed, icon: MessageCircle },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-4">
              <s.icon size={14} className="mb-2 text-brand-slate" />
              <p className="font-display text-xl font-bold text-[var(--text-primary)]">{s.value ?? 0}</p>
              <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {["", "EMAIL", "WHATSAPP"].map(c => (
          <button key={c} onClick={() => setChannel(c)}
            className={cn("rounded-xl border px-4 py-2 text-sm font-medium transition-all",
              channel === c ? "border-brand-crimson/40 bg-brand-crimson/10 text-white" : "border-white/10 text-brand-slate hover:text-white")}>
            {c === "" ? "All" : c === "EMAIL" ? "Email" : "WhatsApp"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {["Channel", "Recipient", "Subject / Preview", "Status", "Sent At"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
                      {log.channel === "EMAIL" ? <Mail size={13} /> : <MessageCircle size={13} />}
                      {log.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{log.recipient}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-[var(--text-muted)]">{log.subject ?? log.messagePreview ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold", STATUS_STYLES[log.status])}>
                      {log.status === "FAILED" ? <XCircle size={10} /> : log.status === "PENDING" ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                      {log.status}
                    </span>
                    {log.errorMessage && <p className="mt-1 max-w-xs truncate text-[10px] text-red-400">{log.errorMessage}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                    {log.sentAt ? new Date(log.sentAt).toLocaleString("en-IN") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <div className="py-16 text-center text-[var(--text-muted)]">No communication logs yet.</div>}
        </div>
      )}
    </div>
  );
}

export default function CommunicationLogsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-brand-crimson" /></div>
    }>
      <CommunicationLogsContent />
    </Suspense>
  );
}
