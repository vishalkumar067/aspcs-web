"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, ExternalLink, MapPin, Play } from "lucide-react";
import SceneVideoPlayer, { type PlayerStatus } from "@/components/virtual-tour/SceneVideoPlayer";
import { cloudinaryPosterUrl, cloudinaryVideoSources, type TourScene } from "@/data/virtualTour";
import { getTourScenes } from "@/services/virtualTourService";

const CAMPUS_MAP_URL = "https://share.google/kMKOca1stF2YXjRoz";
const CAMPUS_MAP_EMBED_URL =
  "https://www.google.com/maps?output=embed&q=Acharya%20Shree%20Sudarshan%20Patna%20Central%20School%2C%20Sudarshan%20Vihar%2C%20New%20Bypass%20Road%2C%20Jaganpura%2C%20Patna%2C%20Bihar%20800027";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0810]";

function ScenePreview({
  scene,
  onSelect,
  active,
}: {
  scene: TourScene;
  onSelect: () => void;
  active: boolean;
}) {
  const [showControls, setShowControls] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const sources = scene.videoPublicId ? cloudinaryVideoSources(scene.videoPublicId) : [];
  const poster = scene.videoPublicId
    ? cloudinaryPosterUrl(scene.videoPublicId)
    : scene.thumbnailUrl;

  return (
    <article
      className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border bg-[#15121a] transition hover:-translate-y-1 motion-reduce:transform-none ${
        active
          ? "border-amber-400 shadow-[0_0_0_2px_rgba(251,191,36,0.18)]"
          : "border-white/10 hover:border-amber-400/50"
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setShowControls(false);
        }
      }}
    >
      {sources.length > 0 ? (
        <video
          className="absolute inset-0 h-full w-full bg-black object-cover"
          src={sources[0]}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls={showControls}
          aria-label={`${scene.title} video preview`}
          onError={(event) => {
            const video = event.currentTarget;
            const fallback = sources[1];
            if (fallback && video.dataset.fallbackTried !== "true") {
              video.dataset.fallbackTried = "true";
              video.src = fallback;
              video.load();
            } else {
              setVideoFailed(true);
            }
          }}
        />
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={`${scene.title} preview`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-crimson/50 via-[#18151c] to-[#09070b]" />
      )}

      {videoFailed && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#15121a]/95 p-4 text-center">
          <div>
            <p className="font-semibold text-white">{scene.title}</p>
            <p className="mt-1 text-xs text-slate-300">Video temporarily unavailable.</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-3 pt-10">
        <p className="font-display text-base font-bold leading-tight text-white sm:text-xl">{scene.title}</p>
        <p className="mt-1 text-xs text-slate-300">
          {scene.videoPublicId ? "Live video preview" : "Video coming soon"}
        </p>
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        aria-label={`Play ${scene.title} in the main video player`}
        className={`absolute left-3 top-3 z-20 flex min-h-10 items-center gap-2 rounded-xl border border-white/20 bg-black/75 px-3 text-xs font-bold text-white transition hover:border-amber-400 ${FOCUS_RING}`}
      >
        <Play size={13} fill="currentColor" />
        Main player
      </button>

      {sources.length > 0 && (
        <button
          type="button"
          onClick={() => setShowControls((visible) => !visible)}
          aria-pressed={showControls}
          aria-label={showControls ? `Hide ${scene.title} video controls` : `Show ${scene.title} video controls`}
          className={`absolute right-3 top-3 z-20 flex min-h-10 items-center gap-2 rounded-xl border border-white/20 bg-black/75 px-3 text-xs font-bold text-white transition hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            showControls ? "ring-1 ring-amber-400" : ""
          }`}
        >
          {showControls ? "Hide controls" : "Video controls"}
        </button>
      )}

    </article>
  );
}

export default function VirtualTourPageClient() {
  const scenes = useMemo(() => getTourScenes(), []);
  const [sceneId, setSceneId] = useState(
    scenes.find((scene) => scene.id === "library" && scene.videoPublicId)?.id ??
      scenes.find((scene) => scene.videoPublicId)?.id ??
      scenes[0]?.id ??
      "",
  );
  const activeScene = scenes.find((scene) => scene.id === sceneId) ?? scenes[0];
  const [loadedScenes, setLoadedScenes] = useState<Set<string>>(() => new Set());

  const handleVideoStatus = useCallback((id: string, status: PlayerStatus) => {
    if (status === "ready") {
      setLoadedScenes((current) => (current.has(id) ? current : new Set(current).add(id)));
    }
  }, []);

  const activeSources = activeScene?.videoPublicId
    ? cloudinaryVideoSources(activeScene.videoPublicId)
    : [];
  const activePoster = activeScene?.videoPublicId
    ? cloudinaryPosterUrl(activeScene.videoPublicId)
    : activeScene?.thumbnailUrl;

  return (
    <main className="min-h-screen bg-[#0b0810] text-white">
      <section className="relative overflow-hidden pt-28 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,20,45,0.34),transparent_48%)]" />
        <div className="container-aspcs relative pb-10 pt-8 lg:pb-14 lg:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              <Compass size={14} /> ASPCS Campus Video Tour
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
              Step Inside <span className="text-amber-400">ASPCS</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Explore our learning spaces through campus videos, from the library to our science and innovation facilities.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("tour")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className={`btn-primary mt-7 inline-flex min-h-[44px] items-center gap-2 ${FOCUS_RING}`}
            >
              Start Exploring <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section id="tour" className="container-aspcs scroll-mt-24 pb-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Now playing</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{activeScene?.title ?? "Campus Video Tour"}</h2>
            {activeScene?.description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{activeScene.description}</p>}
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
            {loadedScenes.size} location{loadedScenes.size === 1 ? "" : "s"} played
          </span>
        </div>
        <div className="relative aspect-video min-h-[240px] overflow-hidden rounded-2xl border border-amber-400/25 bg-black shadow-2xl shadow-black/30 sm:min-h-[360px] lg:min-h-[480px]">
          {activeSources.length ? (
            <SceneVideoPlayer
              key={activeScene.id}
              sceneId={activeScene.id}
              title={activeScene.title}
              sources={activeSources}
              poster={activePoster}
              loop
              onStatusChange={handleVideoStatus}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-crimson/35 via-[#18151c] to-black p-6 text-center">
              <div className="max-w-md">
                <Play className="mx-auto text-amber-400" size={34} />
                <h3 className="mt-4 font-display text-xl font-bold text-white">{activeScene?.title ?? "Choose a campus location"}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">A video for this location has not been connected yet. Choose a location with a video below to start watching.</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick location picker: lets visitors switch spaces without scrolling to the cards below. */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex sm:items-center sm:gap-4">
          <div className="mb-3 sm:mb-0 sm:flex-1">
            <label htmlFor="tour-location-select" className="block text-sm font-bold text-white">Explore another location</label>
            <p className="mt-1 text-xs text-slate-400">Choose a campus space to load its video in the player above.</p>
          </div>
          <div className="relative sm:w-[min(100%,22rem)]">
            <select
              id="tour-location-select"
              value={sceneId}
              onChange={(event) => {
                setSceneId(event.target.value);
                document.getElementById("tour")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`min-h-12 w-full appearance-none rounded-xl border border-white/15 bg-[#15121a] px-4 pr-11 text-sm font-semibold text-white outline-none transition hover:border-amber-400/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 ${FOCUS_RING}`}
            >
              {scenes.map((scene) => (
                <option key={scene.id} value={scene.id} className="bg-[#15121a] text-white">
                  {scene.title}{scene.videoPublicId ? " · Video available" : " · Coming soon"}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-amber-400">▾</span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-14">
        <div className="container-aspcs">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Campus highlights</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Explore Every Space</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Each available video plays silently in its preview. Hover or focus a preview to access its video controls.</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenes.map((scene) => (
              <ScenePreview key={scene.id} scene={scene} active={scene.id === activeScene?.id} onSelect={() => setSceneId(scene.id)} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-aspcs py-14" aria-label="Visit ASPCS">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-gold/20 bg-gradient-to-br from-brand-crimson/30 via-brand-black to-brand-black p-6 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="min-w-0">
              <MapPin className="text-brand-gold" size={25} />
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Come, Experience ASPCS . . .</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">See the campus online, then plan a visit to experience our facilities in person.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/admissions" className={`btn-primary inline-flex min-h-[44px] items-center gap-2 ${FOCUS_RING}`}>Explore Admissions <ArrowRight size={16} /></Link>
                <Link href="/contact" className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-gold/40 hover:bg-white/5 ${FOCUS_RING}`}>Plan a Campus Visit</Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[240px] lg:justify-self-end">
              <div className="overflow-hidden rounded-2xl border border-amber-400/50 bg-[#100d14] shadow-xl shadow-black/30">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5">
                  <span className="flex min-w-0 items-center gap-2 text-xs font-bold text-white">
                    <MapPin size={14} className="shrink-0 text-amber-400" />
                    <span className="truncate">Find our school</span>
                  </span>
                  <a
                    href={CAMPUS_MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open school location and directions in Google Maps"
                    title="Open directions"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-amber-400 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                <iframe
                  title="Interactive map showing Acharya Shree Sudarshan Patna Central School"
                  src={CAMPUS_MAP_EMBED_URL}
                  className="aspect-square w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <a
                  href={CAMPUS_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-t border-white/10 px-3 py-2.5 text-center text-[11px] font-semibold text-amber-400 transition hover:bg-white/5"
                >
                  Open directions ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
