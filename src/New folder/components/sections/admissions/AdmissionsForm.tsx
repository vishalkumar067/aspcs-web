"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, User, Mail, Phone, BookOpen, Calendar, School, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const admissionSchema = z.object({
  studentName:    z.string().min(2, "Student name must be at least 2 characters"),
  dateOfBirth:    z.string().min(1, "Date of birth is required"),
  gradeApplying:  z.string().min(1, "Please select a grade"),
  parentName:     z.string().min(2, "Parent name must be at least 2 characters"),
  parentEmail:    z.string().email("Please enter a valid email address"),
  parentPhone:    z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(13, "Phone number too long")
    .regex(/^[+\d\s-]+$/, "Invalid phone number format"),
  address:        z.string().optional(),
  previousSchool: z.string().optional(),
  message:        z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const grades = [
  "Nursery", "KG I", "KG II",
  "Grade I", "Grade II", "Grade III", "Grade IV", "Grade V",
  "Grade VI", "Grade VII", "Grade VIII",
  "Grade IX", "Grade X",
];

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">
        {label}
        {required && <span className="ml-0.5 text-brand-gold">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function AdmissionsForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  const onSubmit = async (data: AdmissionFormData) => {
    setSubmitting(true);
    try {
      // TODO: Replace with actual API call:
      // await admissionsService.submit(data);

      // Simulated delay for now
      await new Promise((res) => setTimeout(res, 1500));
      console.log("Admission form data:", data);
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success State ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section className="section-pad bg-brand-black" id="apply">
        <div className="container-aspcs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg rounded-3xl border border-brand-gold/20 bg-brand-gold/5 p-12 text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
              <CheckCircle2 size={36} className="text-brand-gold" />
            </div>
            <h3 className="mb-3 font-display text-2xl font-bold text-white">
              Application Submitted!
            </h3>
            <p className="mb-8 text-brand-slate">
              Thank you for applying to ASPCS. Our admissions team will contact
              you within <strong className="text-white">48 hours</strong> to
              schedule your campus visit.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-primary w-full justify-center"
            >
              Submit Another Application
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  // ─── Form ───────────────────────────────────────────────────────────────
  return (
    <section className="section-pad bg-brand-black" id="apply">
      <div className="container-aspcs">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-5 inline-flex"
          >
            Online Application Form
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-display-xs font-bold text-white"
          >
            Apply <span className="text-brand-gold">Online Now</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-3 max-w-md text-sm text-brand-slate"
          >
            Fill in the form below and our admissions team will get back to
            you within 48 hours.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <div className="rounded-3xl border border-brand-crimson/15 bg-brand-black-light/50 p-8 shadow-glass backdrop-blur-xl lg:p-12">

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* ── Section: Student Details ── */}
              <div className="mb-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/15">
                    <User size={15} className="text-brand-gold" />
                  </div>
                  <h4 className="font-semibold text-white">Student Details</h4>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Student's Full Name" error={errors.studentName?.message} required>
                    <input
                      {...register("studentName")}
                      placeholder="e.g. Rahul Kumar Sharma"
                      className={cn(
                        "input-field bg-white/5 text-white placeholder:text-white/25",
                        errors.studentName && "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                      )}
                    />
                  </Field>

                  <Field label="Date of Birth" error={errors.dateOfBirth?.message} required>
                    <input
                      {...register("dateOfBirth")}
                      type="date"
                      className={cn(
                        "input-field bg-white/5 text-white [color-scheme:dark]",
                        errors.dateOfBirth && "border-red-500/50"
                      )}
                    />
                  </Field>

                  <Field label="Applying for Grade" error={errors.gradeApplying?.message} required>
                    <div className="relative">
                      <BookOpen size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <select
                        {...register("gradeApplying")}
                        className={cn(
                          "input-field bg-white/5 pl-10 text-white",
                          errors.gradeApplying && "border-red-500/50"
                        )}
                      >
                        <option value="" className="bg-brand-black">Select grade...</option>
                        {grades.map((g) => (
                          <option key={g} value={g.replace(" ", "_").toUpperCase()} className="bg-brand-black">
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Field>

                  <Field label="Previous School (if any)" error={errors.previousSchool?.message}>
                    <div className="relative">
                      <School size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        {...register("previousSchool")}
                        placeholder="Name of previous school"
                        className="input-field bg-white/5 pl-10 text-white placeholder:text-white/25"
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Divider */}
              <div className="divider-gold mb-8" />

              {/* ── Section: Parent / Guardian Details ── */}
              <div className="mb-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/15">
                    <User size={15} className="text-brand-gold" />
                  </div>
                  <h4 className="font-semibold text-white">Parent / Guardian Details</h4>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Parent / Guardian Name" error={errors.parentName?.message} required>
                    <input
                      {...register("parentName")}
                      placeholder="e.g. Suresh Kumar Sharma"
                      className={cn(
                        "input-field bg-white/5 text-white placeholder:text-white/25",
                        errors.parentName && "border-red-500/50"
                      )}
                    />
                  </Field>

                  <Field label="Phone Number" error={errors.parentPhone?.message} required>
                    <div className="relative">
                      <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        {...register("parentPhone")}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className={cn(
                          "input-field bg-white/5 pl-10 text-white placeholder:text-white/25",
                          errors.parentPhone && "border-red-500/50"
                        )}
                      />
                    </div>
                  </Field>

                  <Field label="Email Address" error={errors.parentEmail?.message} required>
                    <div className="relative">
                      <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        {...register("parentEmail")}
                        type="email"
                        placeholder="email@example.com"
                        className={cn(
                          "input-field bg-white/5 pl-10 text-white placeholder:text-white/25",
                          errors.parentEmail && "border-red-500/50"
                        )}
                      />
                    </div>
                  </Field>

                  <Field label="Home Address" error={errors.address?.message}>
                    <input
                      {...register("address")}
                      placeholder="Street, City, PIN code"
                      className="input-field bg-white/5 text-white placeholder:text-white/25"
                    />
                  </Field>
                </div>
              </div>

              {/* Divider */}
              <div className="divider-gold mb-8" />

              {/* ── Section: Message ── */}
              <div className="mb-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/15">
                    <MessageSquare size={15} className="text-brand-gold" />
                  </div>
                  <h4 className="font-semibold text-white">Additional Message</h4>
                  <span className="text-xs text-brand-slate">(optional)</span>
                </div>

                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Any specific questions, requirements, or information you'd like to share..."
                  className="input-field w-full resize-none bg-white/5 text-white placeholder:text-white/25"
                />
              </div>

              {/* Note */}
              <p className="mb-6 text-xs text-brand-slate">
                <span className="text-brand-gold">*</span> Required fields.
                Your information is kept strictly confidential and used only for
                admission processing.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center py-4 text-base shadow-glow-gold disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
