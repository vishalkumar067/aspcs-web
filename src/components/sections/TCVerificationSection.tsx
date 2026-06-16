"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, Search, CheckCircle2, XCircle, Loader2, User, Hash, GraduationCap, CalendarDays, Shield } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://aspcs-backend-production.up.railway.app/api/v1";

interface TCResult {
  tcNumber:     string;
  studentName:  string;
  admissionNo:  string;
  classStudying: string;
  issueDate:    string;
  status:       string;
}

export default function TCVerificationSection() {
  const [tcNumber,  setTcNumber]  = useState("");
  const [dob,       setDob]       = useState("");
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<TCResult | null>(null);
  const [error,     setError]     = useState("");

  const handleVerify = async () => {
    if (!tcNumber.trim() || !dob) {
      setError("Please enter TC number and date of birth.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${BASE}/tc/verify?tcNumber=${encodeURIComponent(tcNumber.trim())}&dateOfBirth=${dob}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json?.message ?? "TC not found or details do not match.");
      } else {
        setResult(json?.data ?? json);
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTcNumber(""); setDob(""); setResult(null); setError("");
  };

  return (
    <section className="section-pad relative overflow-hidden bg-brand-black">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(196,30,58,0.08),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="container-aspcs relative z-10">
        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="section-eyebrow mb-4 inline-flex">
              <ScrollText size={11} /> TC Verification
            </span>
            <h2 className="font-display text-display-xs font-black text-white">
              Verify Transfer <span className="text-brand-gold">Certificate</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-brand-slate">
              Enter the TC number and the student's date of birth to instantly
              verify the authenticity of a Transfer Certificate issued by ASPCS.
            </p>
          </motion.div>

          {/* Verification Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-white/10 bg-white/4 p-8 backdrop-blur-sm"
          >
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* TC Number */}
                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-brand-gold">
                        TC Number *
                      </label>
                      <div className="relative">
                        <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-slate" />
                        <input
                          value={tcNumber}
                          onChange={e => { setTcNumber(e.target.value); setError(""); }}
                          placeholder="e.g. TC-2024-001"
                          className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-white/25 outline-none focus:border-brand-gold/50 focus:bg-white/8 transition-all"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-brand-gold">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-slate" />
                        <input
                          type="date"
                          value={dob}
                          onChange={e => { setDob(e.target.value); setError(""); }}
                          className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 text-sm font-semibold text-white [color-scheme:dark] outline-none focus:border-brand-gold/50 focus:bg-white/8 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-4 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3"
                      >
                        <XCircle size={16} className="shrink-0 text-red-400" />
                        <p className="text-sm font-semibold text-red-300">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="btn-primary mt-6 w-full justify-center py-4 text-base font-black"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Verifying...</>
                    ) : (
                      <><Search size={18} /> Verify TC Certificate</>
                    )}
                  </button>

                  {/* Security note */}
                  <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-brand-slate">
                    <Shield size={12} className="text-brand-gold" />
                    Secure verification · Data protected · ASPCS official records
                  </div>
                </motion.div>
              ) : (
                /* ── Result ────────────────────────────────────────────── */
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Success header */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                      <CheckCircle2 size={28} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-400">✓ Verified</p>
                      <h3 className="font-display text-xl font-black text-white">TC Certificate Authentic</h3>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/4 p-5 sm:grid-cols-2">
                    {[
                      { icon: Hash,          label: "TC Number",     value: result.tcNumber },
                      { icon: User,          label: "Student Name",  value: result.studentName },
                      { icon: GraduationCap, label: "Class",         value: result.classStudying ?? "—" },
                      { icon: Hash,          label: "Admission No",  value: result.admissionNo },
                      { icon: CalendarDays,  label: "Issue Date",    value: result.issueDate ? new Date(result.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                      { icon: CheckCircle2,  label: "Status",        value: result.status },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-gold/10">
                          <Icon size={13} className="text-brand-gold" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-brand-slate">{label}</p>
                          <p className="text-sm font-bold text-white">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ASPCS watermark note */}
                  <div className="mb-6 rounded-xl border border-brand-gold/20 bg-brand-gold/5 px-4 py-3">
                    <p className="text-xs font-semibold text-brand-gold">
                      🏫 This TC was officially issued by Acharya Shree Sudarshan Patna Central School, Patna.
                      For any discrepancy, contact the school office.
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="btn-outline w-full justify-center"
                  >
                    Verify Another TC
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Help text */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-6 text-center text-xs font-medium text-brand-slate"
          >
            For TC-related queries, contact the school office at{" "}
            <a href="tel:+919102997549" className="text-brand-gold hover:underline">+91-91029 97549</a>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
