import {
  GUIDED_TOUR_SEQUENCE,
  TOUR_JOURNEYS,
  TOUR_SCENES,
  type TourJourney,
  type TourScene,
} from "@/data/virtualTour";

export type ResolvedJourney = TourJourney & { scenes: TourScene[] };

export function getTourScenes(): TourScene[] {
  return TOUR_SCENES;
}

export function getGuidedTourScenes(): TourScene[] {
  return GUIDED_TOUR_SEQUENCE.map((id) => TOUR_SCENES.find((scene) => scene.id === id)).filter(
    (scene): scene is TourScene => Boolean(scene)
  );
}

/**
 * Journeys only include scenes that really exist in TOUR_SCENES.
 * A journey with no matching scenes is dropped.
 */
export function getJourneys(): ResolvedJourney[] {
  return TOUR_JOURNEYS.map((journey) => ({
    ...journey,
    scenes: journey.sceneIds
      .map((id) => TOUR_SCENES.find((scene) => scene.id === id))
      .filter((scene): scene is TourScene => Boolean(scene)),
  })).filter((journey) => journey.scenes.length > 0);
}
