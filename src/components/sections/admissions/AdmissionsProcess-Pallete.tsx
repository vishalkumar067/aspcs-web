"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  FileCheck,
  Users,
  GraduationCap,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Submit Application",
    description:
      "Fill out the online admission form below with the student's details and parent information. Takes less than 10 minutes.",
    color: "from-amber-400/20 to-amber-600/10",
    border: "border-amber-400/25",
    iconColor: "text-amber-400",
  },
  {
    step: "02",
    icon: FileCheck,
    title: "Document Verification",
    description:
      "Our admissions team reviews your application and contacts you within 48 hours to verify documents and schedule a visit.",
    color: "from-blue-400/20 to-blue-600/10",
    border: "border-blue-400/25",
    iconColor: "text-blue-400",
  },
  {
    step: "03",
    icon: Users,
    title: "Interaction & Tour",
    description:
      "A friendly interaction session with the student and parents, followed by a guided tour of our campus and facilities.",
    color: "from-violet-400/20 to-violet-600/10",
    border: "border-violet-400/25",
    iconColor: "text-violet-400",
  },
  {
    step: "04",
    icon: GraduationCap,
    title: "Confirmation & Enrolment",
    description:
      "Receive your admission confirmation letter, complete fee payment, and officially join the ASPCS family.",
    color: "from-emerald-400/20 to-emerald-600/10",
    border: "border-emerald-400/25",
    iconColor: "text-emerald-400",
  },
];

export default function AdmissionsProcess() {
  return (
    <section className="section-pad bg-brand-black">
      <div className="container-aspcs">
        {/* Heading */}
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-5 inline-flex"
          >
            Simple 4-Step Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-display-xs font-bold text-white"
          >
            How Admissions <span className="text-brand-gold">Work</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line — desktop only */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent lg:block" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border ${s.border} bg-gradient-to-br ${s.color} p-7 backdrop-blur-sm`}
              >
                {/* Step number */}
                <div className="mb-5 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${s.iconColor}`}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <span className="font-display text-4xl font-bold text-white/10">
                    {s.step}
                  </span>
                </div>

                <h3 className="mb-3 font-display text-lg font-bold text-white">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
