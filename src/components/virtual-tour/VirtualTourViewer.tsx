"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Maximize2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  VolumeX,
  X,
} from "lucide-react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import type { TourHotspot, TourScene } from "@/data/virtualTour";

type Props = {
  scenes: TourScene[];
  activeScene?: TourScene;
  onSceneChange: (id: string) => void;
  guided: boolean;
  guidedScenes: TourScene[];
  onGuidedChange: (value: boolean) => void;
  /** Reports whether a scene's panorama loaded ("ready") or failed ("error"). */
  onSceneStatus?: (id: string, status: "ready" | "error") => void;
};

type InfoCard = {
  title: string;
  category: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  videoUrl?: string;
  actionLabel?: string;
};

type Status = "loading" | "ready" | "error";
type VideoState = "loading" | "loaded" | "error";
type Media = { url: string; title: string } | null;

const PANORAMA_TIMEOUT_MS = 25000; // stop spinning forever on a dead network
const VIDEO_TIMEOUT_MS = 15000;
const GUIDED_DWELL_MS = 9000; // time spent on a working scene
const GUIDED_SKIP_MS = 2500; // time spent on a failed scene before skipping it
const GUIDED_VIDEO_DWELL_MS = 30000; // video scenes need longer than a still panorama

export default function VirtualTourViewer({
  scenes,
  activeScene,
  onSceneChange,
  guided,
  guidedScenes,
  onGuidedChange,
  onSceneStatus,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const guidedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeMediaRef = useRef<HTMLButtonElement>(null);

  // Latest callbacks live in refs, so a parent re-render never rebuilds the viewer.
  const onSceneChangeRef = useRef(onSceneChange);
  const onGuidedChangeRef = useRef(onGuidedChange);
  const onSceneStatusRef = useRef(onSceneStatus);
  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
    onGuidedChangeRef.current = onGuidedChange;
    onSceneStatusRef.current = onSceneStatus;
  }, [onSceneChange, onGuidedChange, onSceneStatus]);

  // Panorama state (owned by the viewer effect)
  const [status, setStatus] = useState<Status>("loading");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // UI state (never touches the viewer lifecycle)
  const [info, setInfo] = useState<InfoCard | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Media preview state (independent from the viewer)
  const [media, setMedia] = useState<Media>(null);
  const [videoState, setVideoState] = useState<VideoState>("loading");
  const [videoKey, setVideoKey] = useState(0);
  const mediaUrl = media?.url ?? null;
  const mediaOpen = media !== null;

  // Video scenes (a flat video shown in place of a 360° photo)
  const [sceneVideoLoaded, setSceneVideoLoaded] = useState(false);
  const activeSceneId = activeScene?.id;
  useEffect(() => {
    setSceneVideoLoaded(false);
  }, [activeSceneId]);

  // Ask Photo Sphere Viewer to re-measure its container (safe if the method is missing).
  const refreshViewerSize = useCallback(() => {
    const viewer = viewerRef.current as unknown as { autoSize?: () => void } | null;
    try {
      viewer?.autoSize?.();
    } catch {
      /* ignore: viewer may be mid-destroy */
    }
  }, []);

  /* ------------------------------------------------------------------ */
  /* Viewer lifecycle: one viewer per (scene, retry), destroyed once.    */
  /* Depends ONLY on the scene and retry counter, never on media state.  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !activeScene) return;
    const scene = activeScene; // const keeps the narrowing inside callbacks

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let viewer: Viewer | null = null;

    setStatus("loading");
    setErrorDetail(null);
    setInfo(null);

    const fail = (detail: string) => {
      if (cancelled) return; // stale callback from a previous scene
      if (timeoutId) clearTimeout(timeoutId);
      setStatus("error");
      setErrorDetail(detail);
      onSceneStatusRef.current?.(scene.id, "error");
    };

    if (scene.videoUrl) {
      // Video scene: Photo Sphere Viewer is not needed, the iframe below plays it.
      setStatus("ready");
      onSceneStatusRef.current?.(scene.id, "ready");
      return () => {
        cancelled = true;
      };
    }

    const panorama = scene.panoramaUrl;
    if (!panorama) {
      fail("No panorama is configured for this location.");
      return () => {
        cancelled = true;
      };
    }

    try {
      viewer = new Viewer({
        container,
        panorama,
        navbar: false,
        defaultYaw: activeScene.initialYaw ?? 0,
        defaultPitch: activeScene.initialPitch ?? 0,
        defaultZoomLvl: activeScene.initialZoom ?? 50,
        touchmoveTwoFingers: false,
        mousemove: true,
        plugins: [[MarkersPlugin, { markers: [] }]],
      });
      viewerRef.current = viewer;

      const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin | null;
      if (markersPlugin) {
        markersPlugin.clearMarkers();

        activeScene.hotspots.forEach((hotspot) => {
          markersPlugin.addMarker({
            id: hotspot.id,
            position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
            html: `<button type="button" aria-label="${escapeHtml(
              hotspot.label,
            )}" class="aspcs-tour-hotspot"><span></span></button>`,
            tooltip: hotspot.label,
            data: hotspot,
            anchor: "center center",
          });
        });

        markersPlugin.addEventListener("select-marker", (event) => {
          if (cancelled) return;
          const hotspot = event.marker.config.data as TourHotspot | undefined;
          if (!hotspot) return;

          if (hotspot.type === "scene" && hotspot.targetSceneId) {
            onSceneChangeRef.current(hotspot.targetSceneId);
          } else if (hotspot.description || hotspot.image || hotspot.videoUrl) {
            setInfo({
              title: hotspot.label,
              category: scene.category,
              description: hotspot.description,
              image: hotspot.image,
              imageAlt: hotspot.imageAlt,
              videoUrl: hotspot.videoUrl,
              actionLabel: hotspot.actionLabel,
            });
          }
        });
      }

      viewer.addEventListener("ready", () => {
        if (cancelled) return;
        if (timeoutId) clearTimeout(timeoutId);
        setStatus("ready");
        onSceneStatusRef.current?.(scene.id, "ready");
      });

      viewer.addEventListener("panorama-error", (event) => {
        console.error(
          `[VirtualTour] Failed to load panorama for "${scene.id}"`,
          event,
        );
        fail(describeError(event));
      });

      timeoutId = setTimeout(
        () => fail("Loading timed out. Please check your connection."),
        PANORAMA_TIMEOUT_MS,
      );
    } catch (err) {
      console.error(`[VirtualTour] Viewer failed to start for "${activeScene.id}"`, err);
      fail(describeError(err));
    }

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (viewer) {
        try {
          viewer.destroy();
        } catch (err) {
          console.warn("[VirtualTour] Error while destroying viewer", err);
        }
      }
      if (viewerRef.current === viewer) viewerRef.current = null;
    };
  }, [activeScene, retryKey]);

  /* ------------------------------------------------------------------ */
  /* Guided tour: dwell on good scenes, skip failed ones, no retries.    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (guidedTimerRef.current) clearTimeout(guidedTimerRef.current);
    if (!guided || mediaOpen || status === "loading") return;
    if (!activeScene || guidedScenes.length === 0) return;

    const index = guidedScenes.findIndex((scene) => scene.id === activeScene.id);
    if (index < 0) return;

    const isLast = index >= guidedScenes.length - 1;
    const delay =
      status === "error"
        ? GUIDED_SKIP_MS
        : activeScene.videoUrl
          ? GUIDED_VIDEO_DWELL_MS
          : GUIDED_DWELL_MS;

    guidedTimerRef.current = setTimeout(() => {
      if (isLast) {
        onGuidedChangeRef.current(false);
      } else {
        onSceneChangeRef.current(guidedScenes[index + 1].id);
      }
    }, delay);

    return () => {
      if (guidedTimerRef.current) clearTimeout(guidedTimerRef.current);
    };
  }, [activeScene, guided, guidedScenes, mediaOpen, status]);

  /* ------------------------------------------------------------------ */
  /* Fullscreen                                                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
      requestAnimationFrame(refreshViewerSize);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [refreshViewerSize]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      // Fullscreen the whole wrapper so controls and the media preview stay visible.
      wrapperRef.current?.requestFullscreen?.();
    }
  };

  /* ------------------------------------------------------------------ */
  /* Media preview: focus handling, timeout, resize on close, Escape.    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!mediaOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeMediaRef.current?.focus();

    return () => {
      const target =
        previouslyFocused && document.contains(previouslyFocused)
          ? previouslyFocused
          : wrapperRef.current;
      target?.focus?.();
      // The panorama must re-measure after the overlay goes away.
      requestAnimationFrame(refreshViewerSize);
    };
  }, [mediaOpen, refreshViewerSize]);

  useEffect(() => {
    if (!mediaUrl) return;
    setVideoState("loading");
    const timer = setTimeout(
      () => setVideoState((state) => (state === "loading" ? "error" : state)),
      VIDEO_TIMEOUT_MS,
    );
    return () => clearTimeout(timer);
  }, [mediaUrl, videoKey]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (media) setMedia(null);
      else if (info) setInfo(null);
      else if (locationOpen) setLocationOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [media, info, locationOpen]);

  /* ------------------------------------------------------------------ */
  /* Actions                                                             */
  /* ------------------------------------------------------------------ */
  const resetView = () => {
    const viewer = viewerRef.current;
    if (!viewer || status !== "ready") return;
    viewer.zoom(activeScene?.initialZoom ?? 50);
    viewer.rotate({
      yaw: activeScene?.initialYaw ?? 0,
      pitch: activeScene?.initialPitch ?? 0,
    });
  };

  const retryPanorama = () => setRetryKey((value) => value + 1);

  /* ------------------------------------------------------------------ */
  /* Render. Stacking: viewer < overlays (z-20) < controls (z-30)        */
  /* < popups (z-40) < media preview (z-50).                             */
  /* ------------------------------------------------------------------ */
  return (
    <div
      ref={wrapperRef}
      tabIndex={-1}
      className={`relative isolate overflow-hidden bg-[#09070b] text-white outline-none ${
        isFullscreen ? "h-screen w-screen" : ""
      }`}
    >
      <div
        ref={containerRef}
        className={`relative w-full transition-opacity duration-500 motion-reduce:transition-none ${
          status === "ready" ? "opacity-100" : "opacity-0"
        } ${isFullscreen ? "h-full" : "h-[62vh] min-h-[460px] sm:h-[680px] lg:h-[720px]"}`}
      />

      {/* Video scene: sits under the controls so navigation stays usable */}
      {activeScene?.videoUrl && (
        <div className="absolute inset-0 z-10 flex flex-col bg-black px-3 pb-24 pt-24 sm:px-6 sm:pb-40">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-amber-400/30 bg-black">
            <iframe
              key={activeScene.id}
              src={activeScene.videoUrl}
              title={`${activeScene.title} - Acharya Shree Sudarshan Patna Central School`}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              onLoad={() => setSceneVideoLoaded(true)}
            />
            {!sceneVideoLoaded && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="text-center" role="status" aria-live="polite">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
                  <p className="mt-3 text-xs font-semibold text-white/80">Loading video…</p>
                </div>
              </div>
            )}
          </div>
          <a
            href={activeScene.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 self-center text-xs font-semibold text-amber-400 hover:underline"
          >
            Video not loading? Open in a new tab
          </a>
        </div>
      )}

      {/* Loading overlay (sits UNDER the controls, so navigation stays usable) */}
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#09070b] px-6 pb-44 pt-24 sm:pb-40">
          <div className="text-center" role="status" aria-live="polite">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
            <p className="mt-4 text-sm font-semibold text-white/80">
              Loading 360° panorama…
            </p>
            {activeScene && (
              <p className="mt-1 text-xs text-white/60">{activeScene.title}</p>
            )}
          </div>
        </div>
      )}

      {/* Panorama unavailable overlay (also UNDER the controls) */}
      {status === "error" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#09070b] px-6 pb-44 pt-28 text-center sm:pb-40">
          <div className="max-w-md" role="alert">
            <AlertTriangle className="mx-auto text-amber-400" size={28} />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
              {activeScene?.category}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {activeScene?.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This 360° panorama is temporarily unavailable. You can continue exploring
              other campus locations.
            </p>
            {errorDetail && (
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                Details: {errorDetail}
              </p>
            )}
            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={retryPanorama}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 text-xs font-bold text-[#09070b] transition hover:bg-amber-300"
              >
                <RefreshCw size={14} />
                Retry
              </button>
              <p className="text-xs text-slate-400">
                <span className="hidden sm:inline">
                  Choose another location from the list below.
                </span>
                <span className="sm:hidden">
                  Tap &ldquo;Explore Locations&rdquo; to choose another place.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scene title and fullscreen control */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto min-w-0 max-w-[75%] rounded-xl border border-white/20 bg-[#09070b]/95 px-4 py-3 text-white shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
            {activeScene?.category}
          </p>
          <h2 className="mt-1 font-display text-lg font-bold !text-white sm:text-xl">
            {activeScene?.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-[#09070b]/95 text-white shadow-lg transition hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize2 size={17} />
        </button>
      </div>

      {/* Bottom controls: always above the loading/error overlays */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/15 bg-[#09070b]/95 px-4 pb-4 pt-5 text-white sm:px-6 sm:pb-6">
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onGuidedChange(!guided)}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-[#18151c] px-3 text-xs font-bold text-white transition hover:border-amber-400"
            >
              {guided ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              {guided ? "Pause Tour" : "Guided Tour"}
            </button>

            <button
              type="button"
              onClick={resetView}
              disabled={status !== "ready" || Boolean(activeScene?.videoUrl)}
              className="hidden h-10 items-center gap-2 rounded-xl border border-white/20 bg-[#18151c] px-3 text-xs font-bold text-white transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
            >
              <RotateCcw size={14} />
              Reset View
            </button>

            <span className="hidden items-center gap-2 rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-slate-300 sm:flex">
              <VolumeX size={14} />
              No audio
            </span>
          </div>

          <button
            type="button"
            onClick={() => setLocationOpen((value) => !value)}
            className="flex h-10 items-center gap-2 rounded-xl border border-amber-400/40 bg-[#18151c] px-3 text-xs font-bold text-amber-400 sm:hidden"
          >
            Explore Locations
          </button>
        </div>

        <div className="mt-3 hidden gap-2 overflow-x-auto pb-1 sm:flex">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => onSceneChange(scene.id)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                scene.id === activeScene?.id
                  ? "border-amber-400 bg-amber-400 text-[#09070b]"
                  : "border-white/20 bg-[#18151c] text-white hover:border-amber-400"
              }`}
            >
              {scene.title}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile location menu */}
      {locationOpen && (
        <div className="absolute inset-x-4 bottom-20 z-40 rounded-2xl border border-white/20 bg-[#09070b] p-3 text-white shadow-2xl sm:hidden">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Explore Campus
            </span>
            <button
              type="button"
              onClick={() => setLocationOpen(false)}
              aria-label="Close locations"
              className="rounded-lg p-1"
            >
              <X size={16} className="text-white/80 hover:text-white" />
            </button>
          </div>

          <div className="grid max-h-60 gap-1 overflow-y-auto">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  onSceneChange(scene.id);
                  setLocationOpen(false);
                }}
                className={`rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                  scene.id === activeScene?.id
                    ? "bg-amber-400 text-[#09070b]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {scene.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hotspot information card */}
      {info && (
        <div
          role="dialog"
          aria-label={info.title}
          className="absolute bottom-28 left-4 right-4 z-40 max-h-[45%] overflow-y-auto rounded-2xl border border-amber-400/40 bg-[#09070b] text-white shadow-2xl sm:left-6 sm:right-auto sm:max-w-sm"
        >
          {info.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.image}
              alt={info.imageAlt ?? info.title}
              loading="lazy"
              className="h-36 w-full rounded-t-2xl object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
          <div className="flex items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">
                {info.category}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold !text-white">
                {info.title}
              </h3>
              {info.description && (
                <p className="mt-2 text-sm leading-6 !text-slate-200">{info.description}</p>
              )}
              {info.videoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setMedia({ url: info.videoUrl as string, title: info.title });
                    setInfo(null);
                  }}
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 text-xs font-bold text-[#09070b] transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09070b]"
                >
                  <Play size={14} fill="currentColor" />
                  {info.actionLabel ?? "Watch Video"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setInfo(null)}
              aria-label="Close information"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Media preview: an overlay only. Opening/closing it never touches the viewer. */}
      {media && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setMedia(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${media.title} video`}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-amber-400/40 bg-[#09070b] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Explore Our Innovation
                </p>
                <h3 className="mt-1 text-base font-bold text-white sm:text-xl">
                  {media.title}
                </h3>
              </div>

              <button
                ref={closeMediaRef}
                type="button"
                onClick={() => setMedia(null)}
                aria-label="Close video"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white transition hover:border-amber-400 hover:text-amber-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                key={`${media.url}-${videoKey}`}
                src={media.url}
                title={`${media.title} - Acharya Shree Sudarshan Patna Central School`}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                onLoad={() => setVideoState("loaded")}
              />

              {videoState === "loading" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-center" role="status" aria-live="polite">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
                    <p className="mt-3 text-xs font-semibold text-white/80">
                      Loading video…
                    </p>
                  </div>
                </div>
              )}

              {videoState === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black p-4 text-center">
                  <div role="alert" className="max-w-sm">
                    <AlertTriangle className="mx-auto text-amber-400" size={24} />
                    <p className="mt-3 text-sm font-semibold text-white">
                      The video could not be loaded.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Check your connection and try again. The virtual tour is still
                      available.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setVideoKey((value) => value + 1)}
                        className="inline-flex h-9 items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-3 text-xs font-bold text-[#09070b]"
                      >
                        <RefreshCw size={13} />
                        Retry
                      </button>
                      <button
                        type="button"
                        onClick={() => setMedia(null)}
                        className="inline-flex h-9 items-center rounded-xl border border-white/20 px-3 text-xs font-bold text-white hover:border-amber-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-between gap-1 px-4 py-3 text-xs text-slate-400 sm:flex-row sm:text-sm">
              <span>Acharya Shree Sudarshan Patna Central School</span>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-400 hover:underline"
              >
                Video not loading? Open in a new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function describeError(input: unknown): string {
  const candidate = (input as { error?: unknown } | null)?.error ?? input;
  if (candidate instanceof Error && candidate.message) return candidate.message;
  if (typeof candidate === "string" && candidate) return candidate;
  return "The image could not be loaded.";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character] ?? character;
  });
}
