"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, VolumeX, X } from "lucide-react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import type { TourScene } from "@/data/virtualTour";
import RoboticsLabVideo from "@/components/virtual-tour/RoboticsLabVideo"; // adjust to where you saved the file


type Props = {
  scenes: TourScene[];
  activeScene?: TourScene;
  onSceneChange: (id: string) => void;
  guided: boolean;
  guidedScenes: TourScene[];
  onGuidedChange: (value: boolean) => void;
};

// Optional extra field a hotspot can carry to open a video instead of info/scene.
type TourHotspot = TourScene["hotspots"][number] & { videoUrl?: string };

const ROBOTICS_VIDEO_URL =
  "https://player.cloudinary.com/embed/?cloud_name=dug0g6tli&public_id=robotics_lab_acharya_shri_sudarshan_patna_central_school_1_zid2b0&fluid=true&controls=true";

// Matches "AI & Robotics Lab", "ai-robotics-lab", "ai_robotics_lab", "robotics lab", etc.
const ROBOTICS_REGEX = /robotics[\s_&-]*lab/i;

export default function VirtualTourViewer({
  scenes,
  activeScene,
  onSceneChange,
  guided,
  guidedScenes,
  onGuidedChange,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const guidedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest callbacks in refs so the viewer isn't rebuilt when the parent re-renders.
  const onSceneChangeRef = useRef(onSceneChange);
  const onGuidedChangeRef = useRef(onGuidedChange);
  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
    onGuidedChangeRef.current = onGuidedChange;
  }, [onSceneChange, onGuidedChange]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [info, setInfo] = useState<{ title: string; description: string } | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("AI & Robotics Lab");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoOpen = videoUrl !== null;

  // Build the viewer for the active scene
  useEffect(() => {
    if (!containerRef.current || !activeScene) return;

    setLoading(true);
    setError(false);
    setInfo(null);

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: activeScene.panoramaUrl,
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
        const hotspot = event.marker.config.data as TourHotspot | undefined;
        if (!hotspot) return;

        const hotspotName = `${hotspot.id} ${hotspot.label} ${hotspot.description ?? ""}`;

        if (hotspot.videoUrl) {
          // Explicit video hotspot
          setInfo(null);
          setVideoTitle(hotspot.label);
          setVideoUrl(hotspot.videoUrl);
        } else if (ROBOTICS_REGEX.test(hotspotName)) {
          // Robotics Lab hotspot
          setInfo(null);
          setVideoTitle("AI & Robotics Lab");
          setVideoUrl(ROBOTICS_VIDEO_URL);
        } else if (hotspot.type === "scene" && hotspot.targetSceneId) {
          onSceneChangeRef.current(hotspot.targetSceneId);
        } else if (hotspot.description) {
          setInfo({
            title: hotspot.label,
            description: hotspot.description,
          });
        }
      });
    }

    viewer.addEventListener("ready", () => setLoading(false));
    viewer.addEventListener("panorama-error", () => {
      setLoading(false);
      setError(true);
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [activeScene]);

  // Guided tour auto-advance (starts only after the panorama has loaded)
  useEffect(() => {
    if (guidedTimerRef.current) clearTimeout(guidedTimerRef.current);
    if (videoOpen || loading || error) return;
    if (!guided || guidedScenes.length === 0 || !activeScene) return;

    const currentIndex = guidedScenes.findIndex((scene) => scene.id === activeScene.id);

    if (currentIndex < 0) return;

    if (currentIndex >= guidedScenes.length - 1) {
      // Last scene: let it be viewed for a while, then end the tour
      guidedTimerRef.current = setTimeout(() => {
        onGuidedChangeRef.current(false);
      }, 9000);
    } else {
      guidedTimerRef.current = setTimeout(() => {
        onSceneChangeRef.current(guidedScenes[currentIndex + 1].id);
      }, 9000);
    }

    return () => {
      if (guidedTimerRef.current) clearTimeout(guidedTimerRef.current);
    };
  }, [activeScene, guided, guidedScenes, videoOpen, loading, error]);

  // Track fullscreen state so the viewer can fill the screen
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
      // Let Photo Sphere Viewer recompute its size after the layout change
      setTimeout(() => viewerRef.current?.resize({ width: "100%", height: "100%" } as never), 100);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Close video with Escape
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVideoUrl(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen]);

  const resetView = () => {
    viewerRef.current?.zoom(activeScene?.initialZoom ?? 50);
    viewerRef.current?.rotate({
      yaw: activeScene?.initialYaw ?? 0,
      pitch: activeScene?.initialPitch ?? 0,
    });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      // Fullscreen the whole wrapper so overlays + video modal stay visible
      wrapperRef.current?.requestFullscreen?.();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative isolate overflow-hidden bg-[#09070b] text-white ${
        isFullscreen ? "h-screen w-screen" : ""
      }`}
    >
      <div
        ref={containerRef}
        className={`relative w-full ${
          isFullscreen
            ? "h-full"
            : "h-[62vh] min-h-[460px] sm:h-[680px] lg:h-[720px]"
        }`}
      />

      {loading && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#09070b]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
            <p className="mt-4 text-sm font-semibold text-white/80">
              Preparing your virtual tour…
            </p>
            <p className="mt-1 text-xs text-white/60">Loading the 360° panorama</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#09070b] p-6 text-center">
          <div className="max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Panorama coming soon
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white">
              This location is ready for its 360° photograph.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Please check back soon to explore this location.
            </p>
          </div>
        </div>
      )}

      {/* Scene title and fullscreen control */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-6">
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

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-[#09070b]/95 px-4 pb-4 pt-5 text-white sm:px-6 sm:pb-6">
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
              className="hidden h-10 items-center gap-2 rounded-xl border border-white/20 bg-[#18151c] px-3 text-xs font-bold text-white transition hover:border-amber-400 sm:flex"
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
        <div className="absolute inset-x-4 bottom-20 z-30 rounded-2xl border border-white/20 bg-[#09070b] p-3 text-white shadow-2xl sm:hidden">
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

      {/* Video popup */}
      {videoUrl && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setVideoUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${videoTitle} video`}
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
                  {videoTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setVideoUrl(null)}
                aria-label="Close video"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white transition hover:border-amber-400 hover:text-amber-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                key={videoUrl}
                src={videoUrl}
                title={`${videoTitle} - Acharya Shree Sudarshan Patna Central School`}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-1 px-4 py-3 text-xs text-slate-400 sm:flex-row sm:text-sm">
              <span>Acharya Shree Sudarshan Patna Central School</span>
              <a
                href={videoUrl}
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

      {/* Hotspot information popup */}
      {info && (
        <div className="absolute bottom-28 left-4 right-4 z-30 max-h-[40%] overflow-y-auto rounded-2xl border border-amber-400/40 bg-[#09070b] p-5 text-white shadow-2xl sm:left-6 sm:right-auto sm:max-w-sm">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">
                Explore
              </p>
              <h3 className="mt-1 font-display text-lg font-bold !text-white">
                {info.title}
              </h3>
              <p className="mt-2 text-sm leading-6 !text-slate-200">
                {info.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setInfo(null)}
              aria-label="Close information"
              className="shrink-0 rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
