export type TourHotspot = {
  id: string;
  type: "scene" | "info";
  label: string;
  description?: string;
  targetSceneId?: string;
  yaw: number;
  pitch: number;
};

export type TourScene = {
  id: string;
  title: string;
  description: string;
  category: string;
  panoramaUrl: string;
  thumbnailUrl?: string;
  initialYaw?: number;
  initialPitch?: number;
  initialZoom?: number;
  hotspots: TourHotspot[];
};

/**
 * Replace the panoramaUrl values with real 360° equirectangular photographs.
 * No backend is required for this configuration.
 */
export const TOUR_SCENES: TourScene[] = [
  {
    id: "main-gate",
    title: "Main Gate",
    description: "Begin your virtual journey through the ASPCS campus.",
    category: "Campus",
    panoramaUrl: "/virtual-tour/panoramas/main-gate.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/main-gate.jpg",
    hotspots: [],
  },
  {
    id: "reception",
    title: "Reception",
    description: "Explore the welcoming entrance to our school campus.",
    category: "Campus",
    panoramaUrl: "/virtual-tour/panoramas/reception.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/reception.jpg",
    hotspots: [],
  },
  {
    id: "academic-block",
    title: "Academic Block",
    description: "Explore the academic spaces where everyday learning comes alive.",
    category: "Academics",
    panoramaUrl: "/virtual-tour/panoramas/academic-block.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/academic-block.jpg",
    hotspots: [],
  },
  {
    id: "computer-lab",
    title: "Computer Lab",
    description: "A technology-focused learning environment for digital exploration.",
    category: "Technology",
    panoramaUrl: "/virtual-tour/panoramas/computer-lab.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/computer-lab.jpg",
    hotspots: [],
  },
  {
    id: "science-labs",
    title: "Science Labs",
    description: "Spaces designed to encourage observation, experimentation and discovery.",
    category: "Science",
    panoramaUrl: "/virtual-tour/panoramas/science-labs.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/science-labs.jpg",
    hotspots: [],
  },
  {
    id: "library",
    title: "Library",
    description: "A quiet environment for reading, research and independent learning.",
    category: "Learning",
    panoramaUrl: "/virtual-tour/panoramas/library.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/library.jpg",
    hotspots: [],
  },
  {
    id: "steam-lab",
    title: "STEAM & Innovation",
    description: "A space for creativity, experimentation and problem-solving.",
    category: "Innovation",
    panoramaUrl: "/virtual-tour/panoramas/steam-lab.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/steam-lab.jpg",
    hotspots: [],
  },
  {
    id: "sports",
    title: "Sports Facilities",
    description: "Explore the spaces that support physical development and teamwork.",
    category: "Sports",
    panoramaUrl: "/virtual-tour/panoramas/sports.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/sports.jpg",
    hotspots: [],
  },
  {
    id: "hostel",
    title: "Hostel / Boarding",
    description: "Explore the residential environment and boarding facilities.",
    category: "Boarding",
    panoramaUrl: "/virtual-tour/panoramas/hostel.jpg",
    thumbnailUrl: "/virtual-tour/thumbnails/hostel.jpg",
    hotspots: [],
  },
];

export const GUIDED_TOUR_SEQUENCE = [
  "main-gate",
  "reception",
  "academic-block",
  "computer-lab",
  "science-labs",
  "library",
  "steam-lab",
  "sports",
  "hostel",
];
