"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Search, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

const schema = z.object({
  admissionNo:    z.string().min(1, "Admission number is required"),
  applicantName:  z.string().min(2, "Name is required"),
  applicantPhone: z.string().min(10, "Valid phone number required"),
  applicantEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  reason:         z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function TcRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [refNo, setRefNo]         = useState("");

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/tc/request`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Submission failed");
      setRefNo(json.data.id);
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-black pb-16 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(107,15,26,0.8),transparent)]" />
        <div className="container-aspcs relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-eyebrow mb-5 inline-flex"><FileText size={11} />TC Request</span>
            <h1 className="font-display text-display-md font-bold text-white">
              Transfer <span className="text-brand-gold">Certificate</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-brand-slate">
              Request a Transfer Certificate for a student enrolled at ASPCS.
              The TC will be issued within 3–5 working days after verification.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-aspcs">
          <div className="mx-auto max-w-2xl">

            {/* Info cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Search,       title: "Verify",   desc: "We verify student records in our database" },
                { icon: FileText,     title: "Process",  desc: "TC is prepared within 3-5 working days" },
                { icon: CheckCircle2, title: "Collect",  desc: "Collect in person with original ID proof" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card p-4 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/10">
                      <Icon size={18} className="text-brand-crimson" />
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-10 text-center"
              >
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand-gold/30 bg-brand-gold/10">
                  <CheckCircle2 size={36} className="text-brand-gold" />
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-[var(--text-primary)]">
                  Request Submitted!
                </h3>
                <p className="mb-2 text-[var(--text-secondary)]">
                  Your TC request has been received successfully.
                </p>
                <p className="mb-6 text-sm text-[var(--text-muted)]">
                  Reference No: <span className="font-bold text-brand-crimson">{refNo.slice(0, 8).toUpperCase()}</span>
                </p>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
                  <p className="flex items-start gap-2 text-sm text-amber-800">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    Please carry the above reference number and original ID proof when collecting the TC from school.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary mt-6"
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8"
              >
                <h2 className="mb-6 font-display text-xl font-bold text-[var(--text-primary)]">
                  TC Request Form
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                  {/* Admission No */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                      Student Admission Number <span className="text-brand-crimson">*</span>
                    </label>
                    <input
                      {...register("admissionNo")}
                      placeholder="e.g. ASPCS/2020/001"
                      className={cn("input-field", errors.admissionNo && "border-red-400")}
                    />
                    {errors.admissionNo && <p className="mt-1 text-xs text-red-500">{errors.admissionNo.message}</p>}
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Find the admission number on the student&apos;s ID card or previous report card
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                        Applicant Name <span className="text-brand-crimson">*</span>
                      </label>
                      <input
                        {...register("applicantName")}
                        placeholder="Parent/Guardian name"
                        className={cn("input-field", errors.applicantName && "border-red-400")}
                      />
                      {errors.applicantName && <p className="mt-1 text-xs text-red-500">{errors.applicantName.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
                        Phone Number <span className="text-brand-crimson">*</span>
                      </label>
                      <input
                        {...register("applicantPhone")}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className={cn("input-field", errors.applicantPhone && "border-red-400")}
                      />
                      {errors.applicantPhone && <p className="mt-1 text-xs text-red-500">{errors.applicantPhone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">Email Address</label>
                    <input
                      {...register("applicantEmail")}
                      type="email"
                      placeholder="email@example.com"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">Reason for TC</label>
                    <textarea
                      {...register("reason")}
                      rows={3}
                      placeholder="e.g. Shifting to another city, admission in another school..."
                      className="input-field resize-none"
                    />
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> TC will only be issued for students enrolled at ASPCS.
                      The applicant must be the parent/guardian of the student.
                      Carry original Aadhar card when collecting the TC.
                    </p>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit TC Request"}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
