"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, MapPin, Play, RotateCcw, Sparkles } from "lucide-react";
import VirtualTourViewer from "@/components/virtual-tour/VirtualTourViewer";
import { getGuidedTourScenes, getTourScenes } from "@/services/virtualTourService";

export default function VirtualTourPageClient() {
  const scenes = useMemo(() => getTourScenes(), []);
  const guidedScenes = useMemo(() => getGuidedTourScenes(), []);
  const [sceneId, setSceneId] = useState(scenes[0]?.id ?? "");
  const [guided, setGuided] = useState(false);

  const activeScene = scenes.find((scene) => scene.id === sceneId) ?? scenes[0];

  return (
    <div className="min-h-screen bg-[#0b0810] text-white">
      <section className="relative overflow-hidden pt-28 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,20,45,0.34),transparent_48%)]" />
        <div className="container-aspcs relative pb-10 pt-10 lg:pb-14 lg:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              <Compass size={14} /> Virtual Campus Experience
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              Explore <span className="text-brand-gold">ASPCS</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Experience our campus, learning spaces and facilities from anywhere through an immersive 360° tour.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setGuided(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Play size={16} fill="currentColor" /> Take Guided Tour
              </button>
              <a
                href="#tour"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-gold/40 hover:bg-white/10"
              >
                Explore Campus <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="tour" className="container-aspcs pb-20">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30">
          <VirtualTourViewer
            scenes={scenes}
            activeScene={activeScene}
            onSceneChange={setSceneId}
            guided={guided}
            guidedScenes={guidedScenes}
            onGuidedChange={setGuided}
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Explore", "Move naturally between campus locations."],
            ["Discover", "Open interactive information hotspots."],
            ["Experience", "Look around in a true 360° panorama."],
            ["Visit", "Finish your tour and plan a campus visit."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <Sparkles className="mb-4 text-brand-gold" size={18} />
              <h2 className="font-display text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] py-20">
        <div className="container-aspcs">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">Discover ASPCS</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">More than a campus. A place to grow.</h2>
            <p className="mt-4 leading-7 text-white/60">
              Explore the spaces that shape everyday learning, creativity, technology, sports and student life.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenes.slice(0, 6).map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  setSceneId(scene.id);
                  document.getElementById("tour")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:-translate-y-1 hover:border-brand-gold/30 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">{scene.category}</p>
                    <h3 className="mt-2 font-display text-xl font-bold">{scene.title}</h3>
                  </div>
                  <ArrowRight size={18} className="mt-1 text-white/30 transition group-hover:translate-x-1 group-hover:text-brand-gold" />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/50">{scene.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-aspcs py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-gold/20 bg-gradient-to-br from-brand-crimson/30 via-brand-black to-brand-black p-8 sm:p-12 lg:p-16">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <MapPin className="text-brand-gold" size={25} />
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">Come Experience ASPCS</h2>
            <p className="mt-4 leading-7 text-white/65">
              Explore our campus virtually today, then come and experience the school in person.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/admissions" className="btn-primary inline-flex items-center gap-2">
                Apply for Admission <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold transition hover:border-brand-gold/40 hover:bg-white/5">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setSceneId(scenes[0]?.id ?? "")}
        className="fixed bottom-24 left-5 z-30 hidden items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition hover:border-brand-gold/40 sm:flex"
        aria-label="Reset tour"
      >
        <RotateCcw size={13} /> Reset Tour
      </button>
    </div>
  );
}
