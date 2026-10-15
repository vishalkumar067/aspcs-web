/**
 * Cloudinary player URL for the AI & Robotics Lab video.
 * Override it per environment with NEXT_PUBLIC_ROBOTICS_LAB_VIDEO_URL (Vercel env var).
 */
export const ROBOTICS_LAB_VIDEO_URL =
  process.env.NEXT_PUBLIC_ROBOTICS_LAB_VIDEO_URL ??
  "https://player.cloudinary.com/embed/?cloud_name=dug0g6tli&public_id=robotics_lab_acharya_shri_sudarshan_patna_central_school_1_zid2b0&fluid=true&controls=true";

/**
 * Poster image for the lab video. Cloudinary can generate a still from the video itself.
 * Override with NEXT_PUBLIC_ROBOTICS_LAB_POSTER_URL if you upload a custom poster.
 */
export const ROBOTICS_LAB_POSTER_URL =
  process.env.NEXT_PUBLIC_ROBOTICS_LAB_POSTER_URL ??
  "https://res.cloudinary.com/dug0g6tli/video/upload/so_2,w_1280,h_720,c_fill,q_auto,f_jpg/robotics_lab_acharya_shri_sudarshan_patna_central_school_1_zid2b0.jpg";

export type TourHotspot = {
  id: string;
  type: "scene" | "info";
  label: string;
  description?: string;
  targetSceneId?: string;
  /** Optional real photograph shown on the hotspot card (lazy-loaded). */
  image?: string;
  imageAlt?: string;
  /** Optional video (e.g. Cloudinary player URL) opened from the hotspot card. */
  videoUrl?: string;
  /** Button text for the card action, e.g. "Watch Lab Video". */
  actionLabel?: string;
  yaw: number;
  pitch: number;
};

export type TourScene = {
  id: string;
  title: string;
  description: string;
  category: string;
  /** 360° equirectangular photo. Omit it when the scene plays a video instead. */
  panoramaUrl?: string;
  /** Plays this video (e.g. Cloudinary player URL) in place of a 360° panorama. */
  videoUrl?: string;
  thumbnailUrl?: string;
  initialYaw?: number;
  initialPitch?: number;
  initialZoom?: number;
  hotspots: TourHotspot[];
};

/**
 * A themed path through existing scenes. Scene ids that don't exist are ignored,
 * and a journey with no existing scenes is hidden automatically.
 */
export type TourJourney = {
  id: string;
  title: string;
  tagline: string;
  intro: string;
  sceneIds: string[];
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
    panoramaUrl: "/images/reception.jpg.jpeg",
    thumbnailUrl: "/images/reception.jpg.jpeg",
    hotspots: [],
  },
  {
    id: "reception",
    title: "Reception",
    description: "Explore the welcoming entrance to our school campus.",
    category: "Campus",
    panoramaUrl: "/images/reception.jpg.jpeg",
    thumbnailUrl: "/images/reception.jpg.jpeg",
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
    hotspots: [
      {
        id: "ai-robotics-lab-hotspot",
        type: "scene",
        label: "AI & Robotics Lab",
        targetSceneId: "ai-robotics-lab",
        // Placeholder position: calibrate with a click logger, then update.
        yaw: 1.2,
        pitch: 0.05,
      },
    ],
  },
  {
    id: "ai-robotics-lab",
    title: "AI & Robotics Lab",
    description: "See our AI & Robotics Lab in action in this short video from the school.",
    category: "Innovation",
    thumbnailUrl: ROBOTICS_LAB_POSTER_URL,
    videoUrl: ROBOTICS_LAB_VIDEO_URL,
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
  "ai-robotics-lab",
  "sports",
  "hostel",
];

export const TOUR_JOURNEYS: TourJourney[] = [
  {
    id: "future-ready",
    title: "Future-Ready Learning",
    tagline: "Technology, STEAM and hands-on science",
    intro:
      "See where students get hands-on with technology, innovation and science.",
    sceneIds: ["computer-lab", "steam-lab", "ai-robotics-lab", "science-labs"],
  },
  {
    id: "academic",
    title: "Academic Excellence",
    tagline: "Everyday learning spaces",
    intro: "Visit the spaces where everyday learning, reading and research happen.",
    sceneIds: ["academic-block", "library", "science-labs"],
  },
  {
    id: "sports",
    title: "Sports & Activities",
    tagline: "Teamwork and physical development",
    intro: "See the spaces that support sports, teamwork and an active lifestyle.",
    sceneIds: ["sports"],
  },
  {
    id: "life",
    title: "Life at ASPCS",
    tagline: "Arrival, welcome and boarding",
    intro: "Walk in through the entrance and see what student life looks like.",
    sceneIds: ["main-gate", "reception", "hostel"],
  },
];
