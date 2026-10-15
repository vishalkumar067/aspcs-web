"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ROBOTICS_LAB_POSTER_URL, ROBOTICS_LAB_VIDEO_URL } from "@/data/virtualTour";

type Props = {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
};

/**
 * Poster-first video card. The Cloudinary player is only loaded after the visitor
 * taps play, so the page stays fast and nothing autoplays.
 */
export default function RoboticsLabVideo({
  videoUrl = ROBOTICS_LAB_VIDEO_URL,
  posterUrl = ROBOTICS_LAB_POSTER_URL,
  title = "AI & Robotics Lab",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  return (
    <section className="container-aspcs py-14 md:py-20" aria-label={title}>
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-crimson/40 via-[#18151c] to-[#09070b] shadow-2xl shadow-black/40">
        {playing ? (
          <iframe
            src={videoUrl}
            title={`${title} - Acharya Shree Sudarshan Patna Central School`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {posterUrl && !posterFailed && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterUrl}
                alt=""
                loading="lazy"
                onError={() => setPosterFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-[#09070b] shadow-xl transition group-hover:scale-110 motion-reduce:transition-none sm:h-20 sm:w-20">
              <Play size={28} fill="currentColor" className="ml-1" />
            </span>

            <span className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                Watch
              </span>
              <span className="mt-1 block font-display text-2xl font-bold text-white sm:text-4xl">
                {title}
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
