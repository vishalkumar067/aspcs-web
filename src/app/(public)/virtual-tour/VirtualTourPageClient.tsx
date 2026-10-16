"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  ExternalLink,
  Hand,
  Home,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import VirtualTourViewer from "@/components/virtual-tour/VirtualTourViewer";
import { cloudinaryPosterUrl, type TourScene } from "@/data/virtualTour";
import {
  getGuidedTourScenes,
  getJourneys,
  getTourScenes,
  type ResolvedJourney,
} from "@/services/virtualTourService";

const JOURNEY_ICONS: Record<string, LucideIcon> = {
  "future-ready": Cpu,
  academic: BookOpen,
  sports: Trophy,
  life: Home,
};

/** Opens the school's location in Google Maps. */
const CAMPUS_MAP_URL = "https://share.google/kMKOca1stF2YXjRoz";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0810]";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** Scene image with a branded gradient fallback if the file is missing. */
function SceneThumb({ scene, className = "" }: { scene: TourScene; className?: string }) {
  const [failed, setFailed] = useState(false);
  const imageSrc =
    scene.thumbnailUrl ??
    (scene.videoPublicId ? cloudinaryPosterUrl(scene.videoPublicId) : undefined);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-brand-crimson/50 via-[#18151c] to-[#09070b] ${className}`}
    >
      {imageSrc && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export default function VirtualTourPageClient() {
  const scenes = useMemo(() => getTourScenes(), []);
  const defaultGuidedScenes = useMemo(() => getGuidedTourScenes(), []);
  const journeys = useMemo(() => getJourneys(), []);

  const [sceneId, setSceneId] = useState(scenes[0]?.id ?? "");
  const [guided, setGuided] = useState(false);
  const [journey, setJourney] = useState<ResolvedJourney | null>(null);

  // Journey tracker (client-side only, resets on refresh)
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [unavailable, setUnavailable] = useState<Set<string>>(() => new Set());

  const reducedMotion = usePrefersReducedMotion();

  const activeScene = scenes.find((scene) => scene.id === sceneId) ?? scenes[0];

  // One guided-tour engine: the viewer walks whichever list we pass it.
  const guidedScenes = journey ? journey.scenes : defaultGuidedScenes;

  const scrollToTour = useCallback(() => {
    document.getElementById("tour")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reducedMotion]);

  // Only a scene that actually loaded counts as explored.
  const handleSceneStatus = useCallback((id: string, status: "ready" | "error") => {
    if (status === "ready") {
      setVisited((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));
      setUnavailable((previous) => {
        if (!previous.has(id)) return previous;
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    } else {
      setUnavailable((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));
    }
  }, []);

  const startJourney = (selected: ResolvedJourney) => {
    setJourney(selected);
    setSceneId(selected.scenes[0].id);
    setGuided(true);
    scrollToTour();
  };

  const startFullTour = () => {
    setJourney(null);
    if (defaultGuidedScenes[0]) setSceneId(defaultGuidedScenes[0].id);
    setGuided(true);
    scrollToTour();
  };

  const exitJourney = () => {
    setJourney(null);
    setGuided(false);
  };

  const resetTour = () => {
    setSceneId(scenes[0]?.id ?? "");
    setJourney(null);
    setGuided(false);
  };

  // Journey position
  const journeyIndex = journey
    ? journey.scenes.findIndex((scene) => scene.id === activeScene?.id)
    : -1;
  const journeyLast = journey ? journey.scenes.length - 1 : 0;

  const goToJourneyStop = (index: number) => {
    if (!journey) return;
    const target = journey.scenes[Math.max(0, Math.min(index, journeyLast))];
    if (target) setSceneId(target.id);
  };

  // Explored progress
  const visitedCount = visited.size;
  const progressPercent = scenes.length ? Math.round((visitedCount / scenes.length) * 100) : 0;
  const tourComplete =
    visitedCount > 0 && scenes.every((scene) => visited.has(scene.id) || unavailable.has(scene.id));
  const exploredScenes = scenes.filter((scene) => visited.has(scene.id));

  return (
    <div className="min-h-screen bg-[#0b0810] text-white">
      {/* Welcome */}
      <section className="relative overflow-hidden pt-28 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,20,45,0.34),transparent_48%)]" />

        <div className="container-aspcs relative pb-8 pt-8 lg:pb-12 lg:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] !text-amber-400">
              <Compass size={14} />
              360° Campus Tour
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight !text-white sm:text-5xl lg:text-7xl">
              Step Inside <span className="!text-amber-400">ASPCS</span>
            </h1>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={scrollToTour}
                className={`btn-primary inline-flex min-h-[44px] items-center gap-2 ${FOCUS_RING}`}
              >
                Start Exploring
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={startFullTour}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold !text-white transition hover:border-brand-gold/40 hover:bg-white/10 ${FOCUS_RING}`}
              >
                <Play size={16} fill="currentColor" />
                Guided Tour
              </button>
            </div>

            <p className="mt-5 inline-flex items-center gap-2 text-xs !text-slate-400 sm:text-sm">
              <Hand size={15} className="text-amber-400" />
              Drag or swipe to look around
            </p>
          </div>
        </div>
      </section>

      {/* Interactive virtual tour */}
      <section id="tour" className="container-aspcs scroll-mt-24 pb-12">
        {/* Journey controls: only while a journey is active */}
        {journey && (
          <div
            role="region"
            aria-label={`${journey.title} journey`}
            className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-brand-gold/25 bg-white/[0.04] p-3 sm:p-4"
          >
            <div className="mr-auto min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] !text-amber-400">
                {journey.title}
              </p>
              <p className="truncate font-display text-base font-bold !text-white" aria-live="polite">
                {journeyIndex < 0 ? "Exploring freely" : activeScene?.title}
              </p>
            </div>

            <button
              type="button"
              onClick={() => goToJourneyStop(journeyIndex - 1)}
              disabled={journeyIndex <= 0}
              aria-label="Previous stop"
              className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#18151c] !text-white transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => setGuided((value) => !value)}
              aria-label={guided ? "Pause journey" : "Resume journey"}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/60 bg-[#18151c] !text-amber-400 transition hover:border-amber-400 ${FOCUS_RING}`}
            >
              {guided ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            </button>

            <button
              type="button"
              onClick={() => goToJourneyStop(journeyIndex + 1)}
              disabled={journeyIndex >= journeyLast}
              aria-label="Next stop"
              className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#18151c] !text-white transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
            >
              <ChevronRight size={18} />
            </button>

            <button
              type="button"
              onClick={exitJourney}
              aria-label="Exit journey"
              className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 !text-white transition hover:border-amber-400 ${FOCUS_RING}`}
            >
              <X size={16} />
            </button>

            <div className="flex w-full items-center gap-3">
              <div
                role="progressbar"
                aria-label="Journey progress"
                aria-valuemin={1}
                aria-valuemax={journey.scenes.length}
                aria-valuenow={Math.max(journeyIndex, 0) + 1}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500 motion-reduce:transition-none"
                  style={{
                    width: `${((Math.max(journeyIndex, 0) + 1) / journey.scenes.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[11px] font-semibold !text-slate-300">
                {Math.max(journeyIndex, 0) + 1}/{journey.scenes.length}
              </span>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30">
          <VirtualTourViewer
            scenes={scenes}
            activeScene={activeScene}
            onSceneChange={setSceneId}
            guided={guided}
            guidedScenes={guidedScenes}
            onGuidedChange={setGuided}
            onSceneStatus={handleSceneStatus}
          />
        </div>

        {/* Visual location strip + progress */}
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-xs font-semibold !text-slate-300" aria-live="polite">
              {visitedCount} of {scenes.length} explored
              {unavailable.size > 0 && ` · ${unavailable.size} unavailable`}
            </p>
            <div
              role="progressbar"
              aria-label="Locations explored"
              aria-valuemin={0}
              aria-valuemax={scenes.length}
              aria-valuenow={visitedCount}
              className="h-2 w-32 overflow-hidden rounded-full bg-white/10 sm:w-56"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 motion-reduce:transition-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
            {scenes.map((scene) => {
              const isActive = scene.id === activeScene?.id;
              const isVisited = visited.has(scene.id);
              const isUnavailable = unavailable.has(scene.id);

              return (
                <li key={scene.id} className="w-36 shrink-0 snap-start sm:w-44">
                  <button
                    type="button"
                    onClick={() => setSceneId(scene.id)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`${scene.title}${isVisited ? ", explored" : ""}${
                      isUnavailable ? ", unavailable" : ""
                    }`}
                    className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border-2 transition motion-reduce:transition-none ${FOCUS_RING} ${
                      isActive
                        ? "border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.2)]"
                        : "border-white/10 hover:border-amber-400/50"
                    }`}
                  >
                    <SceneThumb scene={scene} className="absolute inset-0" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <span className="absolute inset-x-2 bottom-2 text-left text-xs font-bold leading-tight !text-white">
                      {scene.title}
                    </span>
                    {isVisited && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[#09070b]">
                        <Check size={13} />
                      </span>
                    )}
                    {isUnavailable && (
                      <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-bold !text-slate-300">
                        Unavailable
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Completion: inline, never a popup */}
        {tourComplete && (
          <div
            role="region"
            aria-label="Tour complete"
            className="relative mt-4 overflow-hidden rounded-2xl border border-brand-gold/30 bg-gradient-to-br from-brand-crimson/30 via-brand-black to-brand-black p-6 sm:p-8"
          >
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-brand-gold/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-2xl font-bold !text-white sm:text-3xl">
                You&apos;ve seen ASPCS. Now come visit.
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {exploredScenes.slice(0, 6).map((scene) => (
                  <li
                    key={scene.id}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold !text-slate-200"
                  >
                    {scene.title}
                  </li>
                ))}
                {exploredScenes.length > 6 && (
                  <li className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold !text-slate-200">
                    +{exploredScenes.length - 6} more
                  </li>
                )}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className={`btn-primary inline-flex min-h-[44px] items-center gap-2 ${FOCUS_RING}`}
                >
                  Plan a Campus Visit
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/admissions"
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold !text-white transition hover:border-brand-gold/40 hover:bg-white/5 ${FOCUS_RING}`}
                >
                  Explore Admissions
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Choose your journey: image-led cards */}
      {journeys.length > 0 && (
        <section className="border-t border-white/10 py-14">
          <div className="container-aspcs">
            <h2 className="font-display text-3xl font-bold !text-white sm:text-4xl">
              Choose Your Journey
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {journeys.map((item) => {
                const Icon = JOURNEY_ICONS[item.id] ?? Compass;
                const isActive = journey?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => startJourney(item)}
                    aria-pressed={isActive}
                    className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none ${FOCUS_RING} ${
                      isActive ? "border-amber-400" : "border-white/10 hover:border-brand-gold/40"
                    }`}
                  >
                    <SceneThumb scene={item.scenes[0]} className="absolute inset-0" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-amber-400">
                      <Icon size={20} />
                    </span>
                    <span className="absolute inset-x-3 bottom-3 block">
                      <span className="block font-display text-base font-bold leading-tight !text-white sm:text-xl">
                        {item.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-xs font-bold !text-amber-400">
                        {item.scenes.length} {item.scenes.length === 1 ? "stop" : "stops"}
                        <ArrowRight
                          size={13}
                          className="transition group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All locations as image tiles */}
      <section className="border-y border-white/10 bg-white/[0.025] py-14">
        <div className="container-aspcs">
          <h2 className="font-display text-3xl font-bold !text-white sm:text-4xl">
            Explore Every Space
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  setSceneId(scene.id);
                  scrollToTour();
                }}
                className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 text-left transition hover:-translate-y-1 hover:border-brand-gold/40 motion-reduce:transform-none motion-reduce:transition-none ${FOCUS_RING}`}
              >
                <SceneThumb scene={scene} className="absolute inset-0" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] !text-amber-400">
                  {scene.category}
                </span>
                {scene.videoPublicId && (
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-[#09070b]">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </span>
                )}
                <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                  <span className="font-display text-base font-bold leading-tight !text-white sm:text-xl">
                    {scene.title}
                  </span>
                  <ArrowRight
                    size={18}
                    className="shrink-0 !text-white transition group-hover:translate-x-1 group-hover:!text-amber-400 motion-reduce:transition-none"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions and contact CTA */}
      <section className="container-aspcs py-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-gold/20 bg-gradient-to-br from-brand-crimson/30 via-brand-black to-brand-black p-8 sm:p-12">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />

          <div className="relative">
            <MapPin className="text-brand-gold" size={25} />

            <h2 className="mt-4 font-display text-3xl font-bold !text-white sm:text-4xl">
              Come Experience ASPCS
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admissions"
                className={`btn-primary inline-flex min-h-[44px] items-center gap-2 ${FOCUS_RING}`}
              >
                Explore Admissions
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/contact"
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold !text-white transition hover:border-brand-gold/40 hover:bg-white/5 ${FOCUS_RING}`}
              >
                Plan a Campus Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location map: opens Google Maps in a new tab so the tour stays open */}
      <section className="container-aspcs pb-16" aria-label="Campus location">
        <a
          href={CAMPUS_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-brand-crimson/25 via-[#18151c] to-[#09070b] p-5 transition hover:-translate-y-1 hover:border-brand-gold/40 motion-reduce:transform-none motion-reduce:transition-none sm:p-6 ${FOCUS_RING}`}
        >
          <span className="flex min-w-0 items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[#09070b]">
              <MapPin size={26} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xl font-bold !text-white sm:text-2xl">
                Location Map
              </span>
              <span className="mt-0.5 block text-xs font-semibold !text-slate-400 sm:text-sm">
                Opens in Google Maps
              </span>
            </span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 !text-white transition group-hover:border-amber-400 group-hover:!text-amber-400 motion-reduce:transition-none">
            <ExternalLink size={18} />
            <span className="sr-only">Open location map in a new tab</span>
          </span>
        </a>
      </section>

      {/* Reset tour */}
      <button
        type="button"
        onClick={resetTour}
        className={`fixed bottom-24 left-5 z-30 hidden items-center gap-2 rounded-full border border-white/10 bg-black/90 px-4 py-2 text-xs font-semibold !text-white backdrop-blur-xl transition hover:border-brand-gold/40 sm:flex ${FOCUS_RING}`}
        aria-label="Reset tour"
      >
        <RotateCcw size={13} />
        Reset Tour
      </button>
    </div>
  );
}
