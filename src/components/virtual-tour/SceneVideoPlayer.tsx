"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Play, RefreshCw, Volume2, VolumeX } from "lucide-react";

export type PlayerStatus = "loading" | "ready" | "error";

type Props = {
  sceneId: string;
  title: string;
  /** Tried in order. If one fails to load, the next one is used. */
  sources: string[];
  poster?: string;
  loop?: boolean;
  onStatusChange?: (sceneId: string, status: PlayerStatus) => void;
  onEnded?: () => void;
};

const LOAD_TIMEOUT_MS = 30000;

/**
 * The one shared video player for the virtual tour. The parent renders it with
 * `key={sceneId}`, so switching locations unmounts the old player (pausing it)
 * before the new one mounts: only one video can ever exist or play at a time.
 *
 * It starts muted (browsers block autoplay with sound), offers a sound button,
 * and handles load errors, retry and a tap-to-play fallback on its own.
 */
export default function SceneVideoPlayer({
  sceneId,
  title,
  sources,
  poster,
  loop = true,
  onStatusChange,
  onEnded,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const statusCallbackRef = useRef(onStatusChange);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [attempt, setAttempt] = useState(0); // bumping this remounts <video> (Retry)
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [buffering, setBuffering] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    statusCallbackRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    statusCallbackRef.current?.(sceneId, status);
  }, [sceneId, status]);

  // Give up (with a Retry option) if nothing loads for a long time.
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setStatus("error"), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status, sourceIndex, attempt]);

  // Start playback on mount; pause when this element goes away.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch((error: unknown) => {
      // Only a real autoplay block needs the tap-to-play button.
      if ((error as { name?: string })?.name === "NotAllowedError") setNeedsTap(true);
    });

    return () => {
      video.pause();
    };
  }, [attempt]);

  // A failed video must not keep downloading or playing behind the error screen.
  useEffect(() => {
    if (status === "error") videoRef.current?.pause();
  }, [status]);

  const handleError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((index) => index + 1);
      setStatus("loading");
    } else {
      setStatus("error");
    }
  };

  const retry = () => {
    setSourceIndex(0);
    setNeedsTap(false);
    setPlaying(false);
    setBuffering(false);
    setStatus("loading");
    setAttempt((value) => value + 1);
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 1;
    setMuted(video.muted);
  };

  const tapToPlay = () => {
    videoRef.current
      ?.play()
      .then(() => setNeedsTap(false))
      .catch(() => undefined);
  };

  return (
    <div className="relative h-full w-full min-h-0 overflow-hidden rounded-2xl border border-amber-400/30 bg-black">
      <video
        key={attempt}
        ref={videoRef}
        src={sources[sourceIndex]}
        poster={poster}
        className="absolute inset-0 h-full w-full bg-black object-contain"
        autoPlay
        muted
        playsInline
        loop={loop}
        controls
        controlsList="nodownload"
        preload="auto"
        aria-label={title}
        onLoadedData={(event) => {
          setStatus("ready");
          event.currentTarget.play().catch((error: unknown) => {
            if ((error as { name?: string })?.name === "NotAllowedError") setNeedsTap(true);
          });
        }}
        onPlaying={() => {
          setPlaying(true);
          setBuffering(false);
          setNeedsTap(false);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        onEnded={onEnded}
        onError={handleError}
      />

      {/* Loading / buffering */}
      {status !== "error" && (status === "loading" || buffering) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center" role="status" aria-live="polite">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-brand-gold" />
            <p className="mt-3 text-xs font-semibold text-white/80">Loading video…</p>
          </div>
        </div>
      )}

      {/* Autoplay was blocked: one tap starts it */}
      {status === "ready" && needsTap && !playing && (
        <button
          type="button"
          onClick={tapToPlay}
          aria-label={`Play ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 text-[#09070b] shadow-xl">
            <Play size={30} fill="currentColor" className="ml-1" />
          </span>
        </button>
      )}

      {/* Sound toggle (videos start muted) */}
      {status === "ready" && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="absolute right-3 top-3 flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-black/70 px-3 text-xs font-bold text-white transition hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {muted ? "Tap for sound" : "Sound on"}
        </button>
      )}

      {/* Failed: retry here, or pick another location */}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black p-4 text-center">
          <div role="alert" className="max-w-sm">
            <AlertTriangle className="mx-auto text-amber-400" size={28} />
            <h3 className="mt-3 font-display text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This video is temporarily unavailable. You can retry or choose another location.
            </p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 text-xs font-bold text-[#09070b] transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
