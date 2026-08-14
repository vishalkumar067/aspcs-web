"use client";

import { useEffect, useState } from "react";

type Video = {
  publicId: string;
  title: string;
  createdAt: string;
  videoUrl: string;
  thumbnailUrl: string;
};

export default function VideosSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos");

        if (!res.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await res.json();

        setVideos(data);
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 h-10 w-60 animate-pulse rounded bg-gray-200" />

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="aspect-video animate-pulse rounded-2xl bg-gray-200 lg:col-span-7" />

            <div className="space-y-5 lg:col-span-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!videos.length) {
    return null;
  }

  const latestVideo = videos[0];
  const otherVideos = videos.slice(1, 4);

  return (
    <>
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          {/* Section Header */}
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                School Media
              </p>

              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Latest Videos
              </h2>

              <p className="mt-3 max-w-2xl text-gray-600">
                Explore the latest events, activities and memorable moments
                from Acharya Shree Sudarshan Patna Central School.
              </p>
            </div>

            <a
              href="/videos"
              className="font-semibold text-red-600 transition hover:text-red-700"
            >
              View All Videos →
            </a>
          </div>

          {/* Video Layout */}
          <div className="grid gap-6 lg:grid-cols-12">

            {/* Latest Video */}
            <div className="lg:col-span-7">
              <button
                type="button"
                onClick={() => setSelectedVideo(latestVideo)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-black text-left shadow-lg"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={latestVideo.thumbnailUrl}
                    alt={latestVideo.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/40" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl transition duration-300 group-hover:scale-110">
                    <span className="ml-1 text-2xl text-red-600">
                      ▶
                    </span>
                  </div>
                </div>

                {/* Latest Badge */}
                <div className="absolute left-5 top-5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                  Latest
                </div>

                {/* Video Information */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {latestVideo.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/80">
                    {formatDate(latestVideo.createdAt)}
                  </p>
                </div>
              </button>
            </div>

            {/* Other Videos */}
            <div className="space-y-5 lg:col-span-5">
              {otherVideos.map((video) => (
                <button
                  key={video.publicId}
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className="group flex w-full gap-4 rounded-2xl bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* Thumbnail */}
                  <div className="relative h-28 w-44 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95">
                        <span className="ml-0.5 text-sm text-red-600">
                          ▶
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 py-1">
                    <h3 className="line-clamp-2 font-semibold text-gray-900 transition group-hover:text-red-600">
                      {video.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {formatDate(video.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition hover:bg-black/90"
              aria-label="Close video"
            >
              ×
            </button>

            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              playsInline
              className="max-h-[85vh] w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
