"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "When do admissions open for session 2025–26?",
    a: "Admissions for session 2025–26 are currently open. We recommend applying early as seats are limited and filled on a first-come, first-served basis.",
  },
  {
    q: "Is there an entrance test for admission?",
    a: "For Grades I to V, admission is based on an informal interaction with the child. For Grades VI and above, a simple written assessment in English and Mathematics is conducted — this is not an entrance exam but helps us understand the student's current level.",
  },
  {
    q: "What is the fee structure?",
    a: "Our fee structure varies by grade. Please contact our admissions office at +91-XXXX-XXXXXX or visit the school in person for a detailed fee breakdown. We also offer instalment payment options.",
  },
  {
    q: "Does ASPCS offer any scholarships?",
    a: "Yes. ASPCS offers merit-based scholarships for academically outstanding students and need-based fee concessions. Please mention your interest in the application form or contact us to learn more.",
  },
  {
    q: "Is transport available?",
    a: "Yes, we have a school bus service covering major areas of the city. Routes and stops are available from the transport office. An additional transport fee applies.",
  },
  {
    q: "Can I visit the school before applying?",
    a: "Absolutely. We encourage all prospective families to visit the campus. You can schedule a free guided campus tour by calling our admissions office. Tours are available Monday to Saturday, 9 AM to 3 PM.",
  },
  {
    q: "How long does the admission process take?",
    a: "Once you submit the application form, our team will contact you within 48 hours. The full process — from application to confirmation — typically takes 5 to 7 working days.",
  },
  {
    q: "Is the application form available offline?",
    a: "Yes. You can collect a physical application form from the school office during working hours (Mon–Sat, 9 AM to 4 PM). However, we recommend the online form for a faster response.",
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        open
          ? "border-brand-gold/30 bg-brand-gold/5"
          : "border-[var(--surface-border)] bg-[var(--surface-card)] hover:border-brand-gold/20"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={cn("text-sm font-semibold transition-colors", open ? "text-brand-gold" : "text-[var(--text-primary)]")}>
          {faq.q}
        </span>
        <ChevronDown
          size={17}
          className={cn(
            "shrink-0 text-brand-gold transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdmissionsFAQ() {
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
            <HelpCircle size={11} />
            FAQs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-display-xs font-bold text-brand-navy dark:text-white"
          >
            Frequently Asked{" "}
            <span className="text-brand-gold">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 max-w-lg text-sm text-[var(--text-muted)]"
          >
            Can't find your answer? Call us at{" "}
            <a href="tel:+91XXXXXXXXXX" className="text-brand-gold hover:underline">
              +91-XXXX-XXXXXX
            </a>
          </motion.p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
