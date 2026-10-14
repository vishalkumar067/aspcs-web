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
    panoramaUrl: "/images/MAINGATE.png",
    thumbnailUrl: "/images/MAINGATE.png",
    hotspots: [],
  },
  {
    id: "reception",
    title: "Reception",
    description: "Explore the welcoming entrance to our school campus.",
    category: "Campus",
    panoramaUrl: "/images/Receiption.png",
    thumbnailUrl: "/images/Receiption.png",
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
    panoramaUrl: "/images/computer-lab.png",
    thumbnailUrl: "/images/computer-lab.png",
    hotspots: [],
  },
  {
    id: "science-labs",
    title: "Science Labs",
    description: "Spaces designed to encourage observation, experimentation and discovery.",
    category: "Science",
    panoramaUrl: "/images/science-lab.png",
    thumbnailUrl: "/images/science-lab.png",
    hotspots: [],
  },
  {
    id: "library",
    title: "Library",
    description: "A quiet environment for reading, research and independent learning.",
    category: "Learning",
    panoramaUrl: "/images/library.png",
    thumbnailUrl: "/images/library.png",
    hotspots: [],
  },
  {
    id: "steam-lab",
    title: "STEAM & Innovation",
    description: "A space for creativity, experimentation and problem-solving.",
    category: "Innovation",
    panoramaUrl: "/images/STEAM.png",
    thumbnailUrl: "/images/STEAM.png",
    hotspots: [
      {
        // The viewer opens the Cloudinary video for any hotspot whose
        // id/label/description mentions "robotics lab".
        id: "ai-robotics-lab",
        type: "info",
        label: "AI & Robotics Lab",
        description: "Watch our AI & Robotics Lab in action.",
        // Placeholder position: calibrate with the click logger, then update.
        yaw: 1.2,
        pitch: 0.05,
      },
    ],
  },
  {
    id: "sports",
    title: "Sports Facilities",
    description: "Explore the spaces that support physical development and teamwork.",
    category: "Sports",
    panoramaUrl: "/images/sports.png",
    thumbnailUrl: "/images/sports.png",
    hotspots: [],
  },
  {
    id: "hostel",
    title: "Hostel / Boarding",
    description: "Explore the residential environment and boarding facilities.",
    category: "Boarding",
    panoramaUrl: "/images/hostel.png",
    thumbnailUrl: "/images/hostel.png",
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
