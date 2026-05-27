"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info } from "lucide-react";

const grades = [
  { grade: "Nursery",        age: "3 – 4 years",  seats: "40" },
  { grade: "KG I & KG II",  age: "4 – 6 years",  seats: "40" },
  { grade: "Grade I – V",   age: "6 – 11 years", seats: "35" },
  { grade: "Grade VI – VIII",age: "11–14 years",  seats: "30" },
  { grade: "Grade IX – X",  age: "14–16 years",  seats: "25" },
];

const documents = [
  "Birth certificate of the student",
  "Previous school's Transfer Certificate (TC)",
  "Last academic year's Report Card",
  "Aadhaar card of student & parents",
  "4 passport-size photographs",
  "Address proof (any government ID)",
  "Caste certificate (if applicable)",
];

const eligibility = [
  "Age criteria as per CBSE / state board norms",
  "Passed previous class with minimum 50% marks",
  "No long-term disciplinary record",
  "Willingness to follow school code of conduct",
];

export default function AdmissionsEligibility() {
  return (
    <section className="section-pad bg-brand-cream dark:bg-brand-black">
      <div className="container-aspcs">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-5 inline-flex"
          >
            Eligibility & Documents
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-display-xs font-bold text-brand-navy dark:text-white"
          >
            Are You <span className="text-brand-gold">Eligible?</span>
          </motion.h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Grade & Seats table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card overflow-hidden lg:col-span-1"
          >
            <div className="border-b border-[var(--surface-border)] px-6 py-4">
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                Seats Available
              </h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Session 2025–26</p>
            </div>
            <div className="divide-y divide-[var(--surface-border)]">
              {grades.map((g) => (
                <div key={g.grade} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{g.grade}</p>
                    <p className="text-xs text-[var(--text-muted)]">{g.age}</p>
                  </div>
                  <div className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-bold text-brand-gold">
                    {g.seats} seats
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 bg-brand-gold/5 px-6 py-4">
              <Info size={14} className="mt-0.5 shrink-0 text-brand-gold" />
              <p className="text-xs text-[var(--text-muted)]">
                Seats are on a first-come, first-served basis. Apply early to avoid missing out.
              </p>
            </div>
          </motion.div>

          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card p-7"
          >
            <h3 className="mb-5 font-display text-lg font-bold text-[var(--text-primary)]">
              Eligibility Criteria
            </h3>
            <ul className="space-y-4">
              {eligibility.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-gold" />
                  <span className="text-sm text-[var(--text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-5">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Need help?</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Our admissions counsellors are available Mon–Sat, 9 AM to 4 PM.
              </p>
              <a
                href="tel:+91XXXXXXXXXX"
                className="mt-3 inline-flex text-sm font-semibold text-brand-gold hover:underline"
              >
                +91-91029-97549
              </a>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card p-7"
          >
            <h3 className="mb-5 font-display text-lg font-bold text-[var(--text-primary)]">
              Documents Required
            </h3>
            <ul className="space-y-4">
              {documents.map((doc, i) => (
                <li key={doc} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-navy/8 dark:bg-brand-gold/10 text-[10px] font-bold text-brand-gold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">{doc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-[var(--text-muted)]">
              * Originals required at the time of admission. Bring attested photocopies as well.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
