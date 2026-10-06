"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, VolumeX, X } from "lucide-react";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import type { TourScene } from "@/data/virtualTour";

type Props = {
  scenes: TourScene[];
  activeScene?: TourScene;
  onSceneChange: (id: string) => void;
  guided: boolean;
  guidedScenes: TourScene[];
  onGuidedChange: (value: boolean) => void;
};

export default function VirtualTourViewer({
  scenes,
  activeScene,
  onSceneChange,
  guided,
  guidedScenes,
  onGuidedChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const guidedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [info, setInfo] = useState<{ title: string; description: string } | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !activeScene) return;

    setLoading(true);
    setError(false);

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

    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    if (markersPlugin) {
      markersPlugin.clearMarkers();
      activeScene.hotspots.forEach((hotspot) => {
        markersPlugin.addMarker({
          id: hotspot.id,
          position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
          html: `<button type="button" aria-label="${escapeHtml(hotspot.label)}" class="aspcs-tour-hotspot"><span></span></button>`,
          tooltip: hotspot.label,
          data: hotspot,
          anchor: "center center",
        });
      });

      markersPlugin.addEventListener("select-marker", (event) => {
        const marker = event.marker;
        const hotspot = marker.config.data as typeof activeScene.hotspots[number] | undefined;
        if (!hotspot) return;
        if (hotspot.type === "scene" && hotspot.targetSceneId) {
          onSceneChange(hotspot.targetSceneId);
        } else if (hotspot.description) {
          setInfo({ title: hotspot.label, description: hotspot.description });
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
  }, [activeScene, onSceneChange]);

  useEffect(() => {
    if (guidedTimerRef.current) clearTimeout(guidedTimerRef.current);
    if (!guided || guidedScenes.length === 0 || !activeScene) return;

    const currentIndex = guidedScenes.findIndex((scene) => scene.id === activeScene.id);
    if (currentIndex < 0 || currentIndex >= guidedScenes.length - 1) {
      if (currentIndex === guidedScenes.length - 1) onGuidedChange(false);
      return;
    }

    guidedTimerRef.current = setTimeout(() => {
      onSceneChange(guidedScenes[currentIndex + 1].id);
    }, 9000);

    return () => {
      if (guidedTimerRef.current) clearTimeout(guidedTimerRef.current);
    };
  }, [activeScene, guided, guidedScenes, onGuidedChange, onSceneChange]);

  const resetView = () => {
    viewerRef.current?.resetZoom();
    viewerRef.current?.rotate({ yaw: activeScene?.initialYaw ?? 0, pitch: activeScene?.initialPitch ?? 0 });
  };

  const fullscreen = () => {
    containerRef.current?.requestFullscreen?.();
  };

  return (
    <div className="relative bg-[#09070b]">
      <div ref={containerRef} className="relative h-[62vh] min-h-[460px] w-full sm:h-[680px] lg:h-[720px]" />

      {loading && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#09070b]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
            <p className="mt-4 text-sm font-semibold text-white/70">Preparing your virtual tour…</p>
            <p className="mt-1 text-xs text-white/35">Loading the 360° panorama</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#09070b] p-6 text-center">
          <div className="max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Panorama coming soon</p>
            <h2 className="mt-3 font-display text-2xl font-bold">This location is ready for its 360° photograph.</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">
              Add the real equirectangular panorama to the configured public/virtual-tour/panoramas folder to activate this scene.
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
        <div className="pointer-events-auto max-w-[70%] rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">{activeScene?.category}</p>
          <h2 className="mt-1 font-display text-lg font-bold sm:text-xl">{activeScene?.title}</h2>
        </div>
        <button
          type="button"
          onClick={fullscreen}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/55 text-white backdrop-blur-xl transition hover:border-brand-gold/40"
          aria-label="Enter fullscreen"
        >
          <Maximize2 size={17} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-16 sm:px-6 sm:pb-6">
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onGuidedChange(!guided)}
              className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 text-xs font-bold backdrop-blur-xl transition hover:border-brand-gold/40"
            >
              {guided ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              {guided ? "Pause Tour" : "Guided Tour"}
            </button>
            <button
              type="button"
              onClick={resetView}
              className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 text-xs font-bold backdrop-blur-xl transition hover:border-brand-gold/40 sm:flex"
            >
              <RotateCcw size={14} /> Reset View
            </button>
            <span className="hidden items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/50 sm:flex">
              <VolumeX size={14} /> No audio
            </span>
          </div>

          <button
            type="button"
            onClick={() => setLocationOpen((value) => !value)}
            className="flex h-10 items-center gap-2 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-3 text-xs font-bold text-brand-gold backdrop-blur-xl sm:hidden"
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
                  ? "border-brand-gold/50 bg-brand-gold/15 text-brand-gold"
                  : "border-white/10 bg-black/35 text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              {scene.title}
            </button>
          ))}
        </div>
      </div>

      {locationOpen && (
        <div className="absolute inset-x-4 bottom-20 z-30 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-xl sm:hidden">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Explore Campus</span>
            <button type="button" onClick={() => setLocationOpen(false)} aria-label="Close locations">
              <X size={16} className="text-white/50" />
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
                className={`rounded-xl px-3 py-3 text-left text-sm font-semibold ${scene.id === activeScene?.id ? "bg-brand-gold/10 text-brand-gold" : "text-white/70"}`}
              >
                {scene.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {info && (
        <div className="absolute bottom-24 left-4 z-30 max-w-sm rounded-2xl border border-brand-gold/20 bg-black/90 p-5 shadow-2xl backdrop-blur-xl sm:left-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">Explore</p>
              <h3 className="mt-1 font-display text-lg font-bold">{info.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{info.description}</p>
            </div>
            <button type="button" onClick={() => setInfo(null)} aria-label="Close information">
              <X size={16} className="text-white/45" />
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
