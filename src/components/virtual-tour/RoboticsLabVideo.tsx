
"use client";

export default function RoboticsLabVideo() {
  const videoUrl =
    "https://player.cloudinary.com/embed/?cloud_name=dug0g6tli&public_id=robotics_lab_acharya_shri_sudarshan_patna_central_school_1_zid2b0";

  return (
    <section className="w-full bg-slate-950 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Explore Our Innovation
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            AI & Robotics Lab
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Discover how our students explore artificial intelligence,
            robotics, coding and emerging technologies through hands-on
            learning experiences.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <div className="relative aspect-video w-full">
            <iframe
              src={videoUrl}
              title="AI and Robotics Lab Virtual Tour - Acharya Shree Sudarshan Patna Central School"
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          Acharya Shree Sudarshan Patna Central School
        </p>
      </div>
    </section>
  );
}
