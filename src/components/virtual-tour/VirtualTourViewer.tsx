"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Maximize2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  X,
} from "lucide-react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import {
  cloudinaryPosterUrl,
  cloudinaryVideoSources,
  type TourHotspot,
  type TourScene,
} from "@/data/virtualTour";
import SceneVideoPlayer, { type PlayerStatus } from "./SceneVideoPlayer";

type Props = {
  scenes: TourScene[];
  activeScene?: TourScene;
  onSceneChange: (id: string) => void;
  guided: boolean;
  guidedScenes: TourScene[];
  onGuidedChange: (value: boolean) => void;
  /** Reports whether a scene loaded ("ready") or failed ("error"). */
  onSceneStatus?: (id: string, status: "ready" | "error") => void;
};

type InfoCard = {
  title: string;
  category: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

type Status = "loading" | "ready" | "error";

const PANORAMA_TIMEOUT_MS = 25000; // stop spinning forever on a dead network
const GUIDED_DWELL_MS = 9000; // time spent on a panorama
const GUIDED_SKIP_MS = 2500; // time spent on a failed scene before skipping it

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

  // Latest callbacks live in refs, so a parent re-render never rebuilds the viewer.
  const onSceneChangeRef = useRef(onSceneChange);
  const onGuidedChangeRef = useRef(onGuidedChange);
  const onSceneStatusRef = useRef(onSceneStatus);
  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
    onGuidedChangeRef.current = onGuidedChange;
    onSceneStatusRef.current = onSceneStatus;
  }, [onSceneChange, onGuidedChange, onSceneStatus]);

  // Panorama state (only used by scenes that have no video)
  const [status, setStatus] = useState<Status>("loading");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Video state (reported by the shared player)
  const [videoStatus, setVideoStatus] = useState<PlayerStatus>("loading");

  // UI state: never touches the viewer or the video lifecycle
  const [info, setInfo] = useState<InfoCard | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Does the active scene play a video? Memoised so the player isn't handed new props needlessly.
  const videoPublicId = activeScene?.videoPublicId;
  const videoSources = useMemo(
    () => (videoPublicId ? cloudinaryVideoSources(videoPublicId) : null),
    [videoPublicId],
  );
  const videoPoster = useMemo(
    () => (videoPublicId ? cloudinaryPosterUrl(videoPublicId) : undefined),
    [videoPublicId],
  );

  // Ask Photo Sphere Viewer to re-measure its container (safe if the method is missing).
  const refreshViewerSize = useCallback(() => {
    const viewer = viewerRef.current as unknown as { autoSize?: () => void } | null;
    try {
      viewer?.autoSize?.();
    } catch {
      /* ignore: viewer may be mid-destroy */
    }
  }, []);

  const handleVideoStatus = useCallback((id: string, next: PlayerStatus) => {
    setVideoStatus(next);
    if (next === "ready") onSceneStatusRef.current?.(id, "ready");
    else if (next === "error") onSceneStatusRef.current?.(id, "error");
  }, []);

  /* ------------------------------------------------------------------ */
  /* Panorama lifecycle for scenes WITHOUT a video. Video scenes skip    */
  /* Photo Sphere Viewer entirely. Depends only on scene + retry.        */
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
    setVideoStatus("loading");

    const fail = (detail: string) => {
      if (cancelled) return; // stale callback from a previous scene
      if (timeoutId) clearTimeout(timeoutId);
      setStatus("error");
      setErrorDetail(detail);
      onSceneStatusRef.current?.(scene.id, "error");
    };

    if (scene.videoPublicId) {
      // Video scene: the shared player (rendered below) takes over.
      setStatus("ready");
      return () => {
        cancelled = true;
      };
    }

    const panorama = scene.panoramaUrl;
    if (!panorama) {
      fail("No video or panorama is configured for this location.");
      return () => {
        cancelled = true;
      };
    }

    try {
      viewer = new Viewer({
        container,
        panorama,
        navbar: false,
        defaultYaw: scene.initialYaw ?? 0,
        defaultPitch: scene.initialPitch ?? 0,
        defaultZoomLvl: scene.initialZoom ?? 50,
        touchmoveTwoFingers: false,
        mousemove: true,
        plugins: [[MarkersPlugin, { markers: [] }]],
      });
      viewerRef.current = viewer;

      const markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin | null;
      if (markersPlugin) {
        markersPlugin.clearMarkers();

        scene.hotspots.forEach((hotspot) => {
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
          } else if (hotspot.description || hotspot.image) {
            setInfo({
              title: hotspot.label,
              category: scene.category,
              description: hotspot.description,
              image: hotspot.image,
              imageAlt: hotspot.imageAlt,
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
        console.error(`[VirtualTour] Failed to load panorama for "${scene.id}"`, event);
        fail(describeError(event));
      });

      timeoutId = setTimeout(
        () => fail("Loading timed out. Please check your connection."),
        PANORAMA_TIMEOUT_MS,
      );
    } catch (err) {
      console.error(`[VirtualTour] Viewer failed to start for "${scene.id}"`, err);
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
  /* Guided tour. Panoramas: dwell then advance. Videos: advance when    */
  /* the video ends. Failed scenes are skipped. No automatic retries.    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (guidedTimerRef.current) clearTimeout(guidedTimerRef.current);
    if (!guided || status === "loading") return;
    if (!activeScene || guidedScenes.length === 0) return;

    const index = guidedScenes.findIndex((scene) => scene.id === activeScene.id);
    if (index < 0) return;

    const isLast = index >= guidedScenes.length - 1;
    const isVideo = Boolean(activeScene.videoPublicId);

    let delay: number | null;
    if (status === "error") delay = GUIDED_SKIP_MS;
    else if (isVideo) delay = videoStatus === "error" ? GUIDED_SKIP_MS : null; // ends via onEnded
    else delay = GUIDED_DWELL_MS;

    if (delay === null) return;

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
  }, [activeScene, guided, guidedScenes, status, videoStatus]);

  const handleVideoEnded = () => {
    if (!guided || !activeScene) return;
    const index = guidedScenes.findIndex((scene) => scene.id === activeScene.id);
    if (index < 0) return;
    if (index >= guidedScenes.length - 1) onGuidedChange(false);
    else onSceneChange(guidedScenes[index + 1].id);
  };

  /* ------------------------------------------------------------------ */
  /* Fullscreen. The wrapper goes fullscreen; the player is never        */
  /* remounted, so playback continues through enter/exit.                */
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
      wrapperRef.current?.requestFullscreen?.();
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (info) setInfo(null);
      else if (locationOpen) setLocationOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [info, locationOpen]);

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
  /* Render. Stacking: viewer/video < overlays (z-20) < controls (z-30)  */
  /* < popups (z-40).                                                    */
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

      {/* The one shared video player. Keyed by scene: switching unmounts (and pauses) the old one. */}
      {activeScene && videoSources && (
        <div className="absolute inset-0 z-10 flex flex-col bg-black px-3 pb-24 pt-24 sm:px-6 sm:pb-40">
          <SceneVideoPlayer
            key={activeScene.id}
            sceneId={activeScene.id}
            title={activeScene.title}
            sources={videoSources}
            poster={videoPoster}
            loop={!guided}
            onStatusChange={handleVideoStatus}
            onEnded={handleVideoEnded}
          />
        </div>
      )}

      {/* Panorama loading overlay (sits UNDER the controls, so navigation stays usable) */}
      {status === "loading" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#09070b] px-6 pb-44 pt-24 sm:pb-40">
          <div className="text-center" role="status" aria-live="polite">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
            <p className="mt-4 text-sm font-semibold text-white/80">Loading 360° panorama…</p>
            {activeScene && <p className="mt-1 text-xs text-white/60">{activeScene.title}</p>}
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
              This location is temporarily unavailable. You can continue exploring other
              campus locations.
            </p>
            {errorDetail && (
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">Details: {errorDetail}</p>
            )}
            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={retryPanorama}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 text-xs font-bold text-[#09070b] transition hover:bg-amber-300"
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

      {/* Bottom controls: always above the loading/error overlays and the video */}
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

            {/* Only meaningful for 360° photos */}
            {!videoSources && (
              <button
                type="button"
                onClick={resetView}
                disabled={status !== "ready"}
                className="hidden h-10 items-center gap-2 rounded-xl border border-white/20 bg-[#18151c] px-3 text-xs font-bold text-white transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
              >
                <RotateCcw size={14} />
                Reset View
              </button>
            )}
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

      {/* Hotspot information card (panorama scenes) */}
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
              <h3 className="mt-1 font-display text-lg font-bold !text-white">{info.title}</h3>
              {info.description && (
                <p className="mt-2 text-sm leading-6 !text-slate-200">{info.description}</p>
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
