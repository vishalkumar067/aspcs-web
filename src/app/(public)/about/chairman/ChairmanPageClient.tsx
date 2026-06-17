"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Play, X, GraduationCap, Star, BookOpen, Users } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   EDIT THIS DATA to update the page content
───────────────────────────────────────────────────────────────────────────── */
const CHAIRMAN = {
  name:        "Raj Rishi Acharya Shree Sudarshan Ji Maharaj",
  title:       "Chairman",
  subtitle:    "Acharya Shree Sudarshan Patna Central School",
  image:       "/images/chairman.jpg",      // place photo at public/images/chairman.jpg
  shortQuote:  "Education is not the filling of a pail, but the lighting of a fire.",
  message: `
    Dear Students, Parents, and Well-wishers,

    It is with immense pride and a deep sense of responsibility that I address you as the Chairman of Acharya Shree Sudarshan Patna Central School, Patna.

    For over four decades, ASPCS has stood as a beacon of quality education in Bihar. Our journey began with a simple but powerful vision — to create an institution where every child could discover their potential, develop their character, and prepare themselves for the challenges of a rapidly changing world.

    Today, as I look at our vibrant school community — our dedicated teachers, our curious students, and our supportive parent body — I feel an overwhelming sense of gratitude and optimism. We have built something truly special here: a place where academic rigour meets compassionate mentorship, where discipline is nurtured alongside creativity, and where every child is seen, valued, and encouraged to excel.

    As we step into Session 2026–27, we reaffirm our commitment to providing education that goes beyond textbooks. We are expanding our facilities, strengthening our faculty, and embracing technology to ensure our students are prepared not just for examinations, but for life itself.

    I extend my heartfelt invitation to families seeking a school that truly cares about their child's holistic development. ASPCS is not just a school — it is a family, a community, and a promise of a brighter future.

    With warm regards and best wishes for your continued success,
  `,
  youtubeVideoId:  "w3WcNmQE-y0",   // ← Replace with actual YouTube video ID
  // e.g. for https://www.youtube.com/watch?v=ABC123xyz, use "ABC123xyz"
  showVideo: true,
};

const LEADERS = [
{
  id: "executive-chairman",
  role: "Executive Chairman",
  name: "Dr. B.K. Sudarshan",
 credentials:
  "Ph.D. (South Korea) • MBA (USA) • M.A. (Delhi University) • Educationist & Entrepreneur",
  image: "/images/exec-chairman.jpg",
  quote:
    "Education empowers individuals, strengthens communities, and transforms nations.",
  message: `
    Dear Members of the ASPCS Family,

    It is my privilege to serve as the Executive Chairman of Acharya Shree Sudarshan Patna Central School.

    My academic journey includes an M.A. from Delhi University, an MBA from the United States, and a Ph.D. from South Korea. These experiences have shaped my vision of creating institutions that combine academic excellence, innovation, and strong values.

    At ASPCS, our mission is to nurture future-ready leaders through quality education, modern infrastructure, technology-enabled learning, and holistic development.

    Together with our dedicated teachers, supportive parents, and talented students, we continue to build an institution that inspires excellence and transforms lives.

    Thank you for your trust and support.

    Together, we shall build a brighter future through education, innovation, and service.
  `,
},
  {
    id: "director",
    role:     "Director",
    name:     "Sh O.P Singh",
    image:    "/images/director.jpg",        // place photo at public/images/director.jpg
    quote:    "Excellence is not an act but a habit — and we build that habit every day.",
    message: `
      Dear Students and Parents,

      It is my honour to serve as the Director of ASPCS and to work alongside a team of educators who are deeply committed to the school's mission.

      Our approach to education is built on three pillars: academic excellence, character development, and community engagement. We believe that a truly educated person is one who not only excels in their studies but also contributes positively to society.

      Under our Integrated Learning Programme, students are encouraged to make connections across subjects, think critically, and apply their knowledge to real-world situations. Our co-curricular activities — from sports and performing arts to coding and entrepreneurship clubs — ensure that every student finds their passion and pursues it with confidence.

      I am proud of what we have achieved together, and I am excited about the road ahead. ASPCS continues to raise the bar, and I am confident that our students will continue to make us proud.
    `,
  },
  {
    id: "principal",
    role:     "Principal",
    name:     "Mr. Vinay Ojha",
    credentials: "M.Sc., B.Ed., M.Ed.",
    image:    "/images/principal.jpg",       // place photo at public/images/principal.jpg
    quote:    "A school's greatest achievement is not a rank — it is the character of its students.",
    message: `
      Dear Students, Parents, and Guardians,

      Welcome to Acharya Shree Sudarshan Patna Central School. As Principal, I am privileged to lead a school that holds education as its highest calling.

      Every morning when students walk through our gates, I see potential — potential to learn, to grow, to contribute, and to lead. Our responsibility as educators is to nurture that potential with patience, passion, and purpose.

      Our academic calendar is designed to be rich yet balanced. We ensure that students are well-prepared for their board examinations while also having ample opportunities to participate in sports, the arts, science fairs, debates, and community service. We believe in education that touches the heart as much as it sharpens the mind.

      To our parents: thank you for your trust in us. We are partners in your child's journey, and we take that responsibility seriously. Our doors are always open for dialogue, feedback, and collaboration.

      To our students: dream big, work hard, stay curious, and be kind. The world needs what only you can offer.

      With warm regards,
    `,
  },
  
];

const STATS = [
  { icon: GraduationCap, value: "45+", label: "Years of Excellence" },
  { icon: Users,         value: "2,000+", label: "Students" },
  { icon: Star,         value: "98%",   label: "Board Pass Rate" },
  { icon: BookOpen,     value: "150+",  label: "Faculty Members" },
];

/* ─── YouTube Modal ──────────────────────────────────────────────────────── */
function YouTubeModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl"
      >
        <button
          onClick={onClose}
          className="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-crimson text-white shadow-lg transition-colors hover:bg-brand-crimson/80"
        >
          <X size={18} />
        </button>
        <div className="relative overflow-hidden rounded-2xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Chairman's Message"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Message Card (for leaders grid) ───────────────────────────────────── */
function LeaderCard({ leader }: { leader: typeof LEADERS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = leader.message.trim().split("\n\n").filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/4"
    >
      {/* Photo + Name header */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-maroon/40 to-brand-black">
        <Image
          src={leader.image}
          alt={leader.name}
          fill
          className="object-cover object-top opacity-80"
          onError={() => {}}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />

        {/* Role badge */}
        <div className="absolute left-5 top-5">
          <span className="rounded-full border border-brand-gold/40 bg-brand-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-gold backdrop-blur-sm">
            {leader.role}
          </span>
        </div>

        {/* Name */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-lg font-black text-white">{leader.name}</p>
        {"credentials" in leader && (
  <>
    <p className="text-xs font-semibold text-brand-gold">
      {(leader as any).credentials}
    </p>

    {leader.id === "executive-chairman" && (
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-brand-gold">
        Featured in Outlook Business • June 2026
      </p>
    )}
  </>
)}
        </div>
      </div>

      {/* Quote */}
      <div className="border-b border-white/8 bg-brand-crimson/8 px-5 py-4">
        <div className="flex items-start gap-3">
          <Quote size={18} className="mt-0.5 shrink-0 text-brand-gold" />
          <p className="text-sm font-semibold italic text-white">{leader.quote}</p>
        </div>
      </div>

      {/* Message */}
      <div className="px-5 pb-5 pt-4">
        <div className={`overflow-hidden transition-all duration-500 ${expanded ? "max-h-[2000px]" : "max-h-32"}`}>
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-3 text-sm font-medium leading-relaxed text-white/80">
              {p}
            </p>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs font-bold text-brand-gold transition-colors hover:text-brand-gold/80"
        >
          {expanded ? "Read Less ↑" : "Read Full Message ↓"}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function ChairmanPageClient() {
  const [videoOpen, setVideoOpen] = useState(false);
  const chairmanParagraphs = CHAIRMAN.message.trim().split("\n\n").filter(Boolean);

  return (
    <main className="min-h-screen bg-brand-black">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-maroon/30 to-brand-black pb-16 pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(196,30,58,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.15) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />

        <div className="container-aspcs relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-brand-gold"
          >
            <Star size={11} className="fill-brand-gold" /> Leadership Messages
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black text-white md:text-5xl lg:text-6xl"
          >
            Voices of <span className="text-brand-gold">Leadership</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/70"
          >
            Inspiring words from the visionaries who guide ASPCS — our Chairman, Executive Chairman,
            Director, and Principal — shaping the future of education in Bihar.
          </motion.p>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div className="border-y border-brand-crimson/15 bg-brand-black">
        <div className="container-aspcs grid grid-cols-2 divide-x divide-brand-crimson/15 md:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center gap-1 py-8"
            >
              <Icon size={20} className="mb-1 text-brand-crimson" />
              <span className="font-display text-3xl font-black text-white">{value}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Chairman's Section ───────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container-aspcs">

          {/* Section eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-gold">
              <Star size={10} className="fill-brand-gold" /> From the Chairman's Desk
            </span>
            <h2 className="font-display text-3xl font-black text-white md:text-4xl">
              Chairman's <span className="text-brand-gold">Message</span>
            </h2>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">

            {/* ── Left: Photo + Video ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} className="flex flex-col gap-6"
            >
              {/* Portrait */}
              <div className="relative overflow-hidden rounded-3xl border border-brand-crimson/20 bg-gradient-to-br from-brand-maroon/30 to-brand-black">
                <div className="relative h-96 w-full">
                  <Image
                    src={CHAIRMAN.image}
                    alt={CHAIRMAN.name}
                    fill
                    className="object-cover object-top"
                    onError={() => {}}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <p className="font-display text-xl font-black text-white">{CHAIRMAN.name}</p>
                  <p className="text-sm font-semibold text-brand-gold">{CHAIRMAN.title}</p>
                  <p className="mt-0.5 text-xs font-medium text-white/60">{CHAIRMAN.subtitle}</p>
                </div>
              </div>

              {/* YouTube Video thumbnail */}
              {CHAIRMAN.showVideo && (
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-brand-crimson/20 bg-brand-black"
                  onClick={() => setVideoOpen(true)}
                >
<img
  src={`https://img.youtube.com/vi/${CHAIRMAN.youtubeVideoId}/hqdefault.jpg`}
  alt="Watch Chairman's Message"
  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
  onError={(e) => {
    e.currentTarget.src = `https://img.youtube.com/vi/${CHAIRMAN.youtubeVideoId}/mqdefault.jpg`;
  }}
/>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-colors group-hover:bg-black/40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson shadow-glow-crimson transition-transform duration-300 group-hover:scale-110">
                      <Play size={22} className="translate-x-0.5 fill-white text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black to-transparent p-4">
                    <p className="text-sm font-bold text-white">▶ Watch Chairman's Video Message</p>
                    <p className="text-xs font-medium text-white/60">Click to play</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── Right: Message ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Pull quote */}
              <div className="mb-8 rounded-2xl border border-brand-gold/20 bg-brand-gold/8 p-6">
                <Quote size={32} className="mb-3 text-brand-gold opacity-60" />
                <p className="font-display text-xl font-bold italic leading-relaxed text-white md:text-2xl">
                  {CHAIRMAN.shortQuote}
                </p>
                <div className="mt-4 h-0.5 w-16 rounded bg-brand-gold/40" />
              </div>

              {/* Full message */}
              <div className="space-y-4">
                {chairmanParagraphs.map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`font-medium leading-relaxed ${
                      i === 0
                        ? "text-base text-white"
                        : i === chairmanParagraphs.length - 1
                        ? "text-sm font-semibold text-brand-gold"
                        : "text-sm text-white/80"
                    }`}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Signature line */}
              <div className="mt-8 flex items-center gap-4 border-t border-white/8 pt-6">
                <div className="h-px flex-1 bg-white/10" />
                <div className="text-right">
                  <p className="font-display text-base font-black text-white">{CHAIRMAN.name}</p>
                  <p className="text-xs font-semibold text-brand-gold">{CHAIRMAN.title}, ASPCS Patna</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Gallery Strip (add school images) ───────────────────────────── */}
      <section className="bg-white/3 py-12">
        <div className="container-aspcs">
          <motion.h3
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mb-6 text-center text-xs font-black uppercase tracking-widest text-white/50"
          >
            A Glimpse of ASPCS
          </motion.h3>
       <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
  {[
    "/gallery/image_1.jpg",
    "/gallery/image_2.jpg",
    "/gallery/image_3.jpg",
    "/gallery/image_4.jpg",
    "/gallery/image_5.jpg",
    "/gallery/image_6.jpg",
    "/gallery/image_7.jpg",
    "/gallery/image_8.jpg",
    "/gallery/image_9.jpg",
    "/gallery/image_10.jpg",
  ].map((src, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      className="relative h-28 overflow-hidden rounded-2xl bg-brand-maroon/20"
    >
      <Image
        src={src}
        alt={`ASPCS Campus ${i + 1}`}
        fill
        className="object-cover opacity-80 transition-transform duration-300 hover:scale-105"
        onError={() => {}}
      />
    </motion.div>
  ))}
</div>
          <p className="mt-4 text-center text-[10px] font-medium text-white/30">
            Acharya Shree Sudarshan Patna Central School Campus
          </p>
        </div>
      </section>

      {/* ── Executive Chairman, Director, Principal ──────────────────────── */}
      <section className="section-pad">
        <div className="container-aspcs">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-12 text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-brand-crimson/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-gold">
              <Users size={10} /> Our Leadership Team
            </span>
            <h2 className="font-display text-3xl font-black text-white md:text-4xl">
              Messages from Our <span className="text-brand-gold">Leaders</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-white/60">
              Inspiring guidance from the Executive Chairman, Director, and Principal
              who shape the vision and daily life of ASPCS.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {LEADERS.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-brand-crimson/15 bg-brand-black py-16">
        <div className="container-aspcs text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="mb-3 font-display text-2xl font-black text-white">
              Join the <span className="text-brand-gold">ASPCS Family</span>
            </h3>
            <p className="mb-7 text-sm font-medium text-white/60">
              Admissions open for all classes including Senior Secondary (Class XI–XII) · Session 2026–27
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="/admissions" className="btn-primary px-8 py-3">
                Apply for Admission
              </a>
              <a href="/contact" className="btn-outline px-8 py-3">
                Contact the School
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── YouTube Modal ─────────────────────────────────────────────────── */}
      {videoOpen && (
        <YouTubeModal
          videoId={CHAIRMAN.youtubeVideoId}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </main>
  );
}
