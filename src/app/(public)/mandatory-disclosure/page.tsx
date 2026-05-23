"use client";

import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";

// ─── PDF Document Links ───────────────────────────────────────────────────────
// Replace these URLs with your actual uploaded PDF paths under /public/docs/
const DOCS = {
  affiliation:   "https://aspcspatna.ac.in/Mandatorydoc/Affiliation%20Letter%20-1-converted.pdf",
  society:       "https://aspcspatna.ac.in/Mandatorydoc/Society Registration-converted.pdf",
  noc:           "https://aspcspatna.ac.in/Mandatorydoc/NOC.pdf",
  recognition:   "https://aspcspatna.ac.in/Mandatorydoc/Recoginition Certificate.pdf",
  building:      "https://aspcspatna.ac.in/Mandatorydoc/Building-Safety- Certificate-converted.pdf",
  fire:          "https://aspcspatna.ac.in/Mandatorydoc/Fire Safety Certificate-converted.pdf",
  deo:           "https://aspcspatna.ac.in/Mandatorydoc/DEO.pdf",
  water:         "https://aspcspatna.ac.in/Mandatorydoc/Drinking Water Certificate-converted.pdf",
  feeStructure:  "https://aspcspatna.ac.in/Mandatorydoc/fee-structure.pdf",
  calendar:      "https://aspcspatna.ac.in/Mandatorydoc/ACADEMIC CALENDAR.pdf",
  smc:           "https://aspcspatna.ac.in/Mandatorydoc/SMC- Infromation.pdf",
  pta:           "https://aspcspatna.ac.in/Mandatorydoc/PTA.pdf",
  result:        "https://aspcspatna.ac.in/Mandatorydoc/RESULT.pdf",
  youtubeVideo:  "https://youtu.be/6etdsU3EYRI",
};

function ViewLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-crimson/40 bg-brand-crimson/10 px-3 py-1.5 text-xs font-semibold text-brand-crimson transition-all hover:bg-brand-crimson hover:text-white"
    >
      <FileText size={12} /> View
    </a>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-4 mt-10 flex items-center gap-3">
      <div className="h-6 w-1 rounded-full bg-brand-crimson" />
      <h2 className="font-display text-lg font-bold text-[var(--text-primary)] uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );
}

export default function MandatoryDisclosurePage() {
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-brand-black">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black pb-14 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(107,15,26,0.8),transparent)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(196,30,58,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(196,30,58,0.08) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container-aspcs relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-eyebrow mb-5 inline-flex">
              <FileText size={11} /> Official Documents
            </span>
            <h1 className="font-display text-display-md font-bold text-white">
              Mandatory <span className="text-brand-gold">Public Disclosure</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-brand-slate">
              As per CBSE affiliation bye-laws, all mandatory documents and
              information are disclosed here for public access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────── */}
      <section className="section-pad pt-12">
        <div className="container-aspcs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6 shadow-card lg:p-10"
          >

            {/* ── A: General Information ─────────────────────────── */}
            <SectionHeading title="A: General Information" />
            <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--surface-border)] bg-brand-crimson/8">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-16">S.NO.</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">INFORMATION</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "NAME OF THE SCHOOL",                "ACHARYA SHRI SUDARSHAN PATNA CENTRAL SCHOOL"],
                    ["2", "AFFILIATION NO. (IF APPLICABLE)",   "330015"],
                    ["3", "SCHOOL CODE (IF APPLICABLE)",       "65016"],
                    ["4", "COMPLETE ADDRESS WITH PIN CODE",    "Sudarshan Vihar, New Bypass Road, Jaganpura, Patna - 800027"],
                    ["5", "PRINCIPAL NAME & QUALIFICATION",    "MR. OM PRAKASH SINGH, M.Sc., B.Ed."],
                    ["6", "SCHOOL EMAIL ID",                   "info@aspcspatna.ac.in"],
                    ["7", "CONTACT DETAILS (LANDLINE/MOBILE)", "+91-91029 97549"],
                  ].map(([sno, info, detail], i) => (
                    <tr key={sno} className={`border-b border-[var(--surface-border)] transition-colors hover:bg-brand-crimson/4 ${i % 2 === 0 ? "" : "bg-[var(--surface-bg)]"}`}>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{sno}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{info}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── B: Documents and Information ───────────────────── */}
            <SectionHeading title="B: Documents and Information" />
            <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--surface-border)] bg-brand-crimson/8">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-16">S.NO.</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">DOCUMENTS / INFORMATION</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-28">DOCUMENTS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSION OF AFFILIATION, IF ANY", DOCS.affiliation],
                    ["2", "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE",    DOCS.society],
                    ["3", "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BY THE STATE GOVT./UT",  DOCS.noc],
                    ["4", "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND ITS RENEWAL IF APPLICABLE", DOCS.recognition],
                    ["5", "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE",          DOCS.building],
                    ["6", "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY",              DOCS.fire],
                    ["7", "COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION/UPGRADATION/EXTENSION OF AFFILIATION OR SELF CERTIFICATION BY SCHOOL", DOCS.deo],
                    ["8", "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES",                            DOCS.water],
                  ].map(([sno, info, link], i) => (
                    <tr key={sno} className={`border-b border-[var(--surface-border)] transition-colors hover:bg-brand-crimson/4 ${i % 2 === 0 ? "" : "bg-[var(--surface-bg)]"}`}>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{sno}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{info}</td>
                      <td className="px-4 py-3"><ViewLink href={link} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)] italic">
              <strong>NOTE:</strong> The schools need to upload the self-attested copies of above listed documents by Chairman/Manager/Secretary and Principal. In case it is noticed at a later stage that uploaded documents are not genuine, the school shall be liable for action as per norms.
            </p>

            {/* ── C: Result and Academics ────────────────────────── */}
            <SectionHeading title="C: Result and Academics" />
            <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--surface-border)] bg-brand-crimson/8">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-16">S.NO.</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">DOCUMENTS / INFORMATION</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-28">DOCUMENTS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "FEE STRUCTURE OF THE SCHOOL",                                              DOCS.feeStructure],
                    ["2", "ANNUAL ACADEMIC CALENDAR",                                                 DOCS.calendar],
                    ["3", "LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)",                                DOCS.smc],
                    ["4", "LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS",                      DOCS.pta],
                    ["5", "LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION AS PER APPLICABILITY",    DOCS.result],
                  ].map(([sno, info, link], i) => (
                    <tr key={sno} className={`border-b border-[var(--surface-border)] transition-colors hover:bg-brand-crimson/4 ${i % 2 === 0 ? "" : "bg-[var(--surface-bg)]"}`}>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{sno}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{info}</td>
                      <td className="px-4 py-3"><ViewLink href={link} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Result Tables */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Class X */}
              <div>
                <p className="mb-3 text-sm font-bold text-[var(--text-primary)]">RESULT CLASS: X</p>
                <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--surface-border)] bg-brand-crimson/8">
                        {["S.NO.", "YEAR", "REGISTERED", "PASSED", "PASS %", "REMARKS"].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1", "2019", "345", "344", "99.71", "—"],
                        ["2", "2020", "301", "290", "96.35", "—"],
                      ].map((row, i) => (
                        <tr key={i} className={`border-b border-[var(--surface-border)] ${i % 2 === 0 ? "" : "bg-[var(--surface-bg)]"}`}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2.5 text-[var(--text-secondary)]">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Class XII */}
              <div>
                <p className="mb-3 text-sm font-bold text-[var(--text-primary)]">RESULT CLASS: XII</p>
                <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--surface-border)] bg-brand-crimson/8">
                        {["S.NO.", "YEAR", "REGISTERED", "PASSED", "PASS %", "REMARKS"].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1", "2019", "187", "124", "66.31", "—"],
                        ["2", "2020", "259", "208", "80.31", "—"],
                      ].map((row, i) => (
                        <tr key={i} className={`border-b border-[var(--surface-border)] ${i % 2 === 0 ? "" : "bg-[var(--surface-bg)]"}`}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2.5 text-[var(--text-secondary)]">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── D: Staff (Teaching) ────────────────────────────── */}
            <SectionHeading title="D: Staff (Teaching)" />
            <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--surface-border)] bg-brand-crimson/8">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-16">S.NO.</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">INFORMATION</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-28">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1",  "PRINCIPAL",                                  "1"],
                    ["2",  "TOTAL NO. OF TEACHERS",                      "91"],
                    ["3",   "• PGT",                                      "19"],
                    ["4",   "• TGT",                                      "47"],
                    ["5",   "• PRT",                                      "25"],
                    ["6",  "TEACHERS SECTION RATIO",                     "1:5"],
                    ["7",  "DETAILS OF SPECIAL EDUCATOR",                "1"],
                    ["8",  "DETAILS OF COUNSELLOR AND WELLNESS TEACHER", "1"],
                  ].map(([sno, info, detail], i) => (
                    <tr key={i} className={`border-b border-[var(--surface-border)] transition-colors hover:bg-brand-crimson/4 ${i % 2 === 0 ? "" : "bg-[var(--surface-bg)]"}`}>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{sno}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{info}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── E: School Infrastructure ───────────────────────── */}
            <SectionHeading title="E: School Infrastructure" />
            <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--surface-border)] bg-brand-crimson/8">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-16">S.NO.</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">INFORMATION</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)] w-40">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "TOTAL CAMPUS AREA OF THE SCHOOL (IN SQUARE MTR)",                                                              "13233"],
                    ["2", "NO. AND SIZE OF THE CLASS ROOMS (IN SQ MTR)",                                                                  "111"],
                    ["3", "NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)",                                             "11"],
                    ["4", "INTERNET FACILITY (Y/N)",                                                                                      "Yes"],
                    ["5", "NO. OF GIRLS TOILETS",                                                                                         "44"],
                    ["6", "NO. OF BOYS TOILETS",                                                                                          "62"],
                  ].map(([sno, info, detail], i) => (
                    <tr key={sno} className={`border-b border-[var(--surface-border)] transition-colors hover:bg-brand-crimson/4 ${i % 2 === 0 ? "" : "bg-[var(--surface-bg)]"}`}>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{sno}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{info}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{detail}</td>
                    </tr>
                  ))}
                  {/* YouTube row */}
                  <tr className="border-b border-[var(--surface-border)] transition-colors hover:bg-brand-crimson/4">
                    <td className="px-4 py-3 text-[var(--text-muted)]">7</td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={DOCS.youtubeVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 text-xs font-semibold text-brand-gold transition-all hover:bg-brand-gold hover:text-brand-black"
                      >
                        <ExternalLink size={12} /> View Video
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
