import { GUIDED_TOUR_SEQUENCE, TOUR_SCENES, type TourScene } from "@/data/virtualTour";

export function getTourScenes(): TourScene[] {
  return TOUR_SCENES;
}

export function getGuidedTourScenes(): TourScene[] {
  return GUIDED_TOUR_SEQUENCE.map((id) => TOUR_SCENES.find((scene) => scene.id === id)).filter(
    (scene): scene is TourScene => Boolean(scene)
  );
}
