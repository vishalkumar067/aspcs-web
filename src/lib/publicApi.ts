// ─── Public API — no authentication required ──────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL
  ?? "https://aspcs-backend-production.up.railway.app/api/v1";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: 60 },          // ISR: refresh every 60 s
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function items<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  const d = data as Record<string, unknown>;
  return (Array.isArray(d.content) ? d.content :
          Array.isArray(d.data)    ? d.data    :
          Array.isArray(d.items)   ? d.items   : []) as T[];
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Notice {
  id: string;
  title: string;
  description?: string;
  category: string;
  pdfUrl?: string;
  imageUrl?: string;
  important: boolean;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  imageUrl?: string;
  highlight: boolean;
  category: string;
  createdAt: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  category: string;
  coverImageUrl?: string;
  eventDate?: string;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  displayOrder: number;
}

export interface JobListing {
  id: string;
  title: string;
  department: string;
  type: string;
  description: string;
  requirements?: string;
  experience?: string;
  qualification?: string;
  salary?: string;
  lastDate?: string;
  vacancies: number;
  active: boolean;
  createdAt: string;
}

// ─── Notice API ───────────────────────────────────────────────────────────────
export async function getPublishedNotices(page = 0, size = 20): Promise<Notice[]> {
  try {
    const data = await get<unknown>(`/notices/public?page=${page}&size=${size}`);
    return items<Notice>(data);
  } catch { return []; }
}

export async function getLatestNotices(): Promise<Notice[]> {
  try {
    const data = await get<unknown>("/notices/public/latest");
    return items<Notice>(data);
  } catch { return []; }
}

// ─── Event API ────────────────────────────────────────────────────────────────
export async function getPublicEvents(page = 0, size = 20): Promise<Event[]> {
  try {
    const data = await get<unknown>(`/events/public?page=${page}&size=${size}`);
    return items<Event>(data);
  } catch { return []; }
}

export async function getHighlightEvents(): Promise<Event[]> {
  try {
    const data = await get<unknown>("/events/public/highlights");
    return items<Event>(data);
  } catch { return []; }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const data = await get<unknown>("/events/public/upcoming");
    return items<Event>(data);
  } catch { return []; }
}

// ─── Gallery API ──────────────────────────────────────────────────────────────
export async function getPublicAlbums(page = 0, size = 12): Promise<GalleryAlbum[]> {
  try {
    const data = await get<unknown>(`/gallery/public?page=${page}&size=${size}`);
    return items<GalleryAlbum>(data);
  } catch { return []; }
}

export async function getAlbumImages(albumId: string): Promise<GalleryImage[]> {
  try {
    const data = await get<unknown>(`/gallery/${albumId}/images`);
    return items<GalleryImage>(data);
  } catch { return []; }
}

// ─── Careers API ──────────────────────────────────────────────────────────────
export async function getActiveJobs(page = 0, size = 10): Promise<JobListing[]> {
  try {
    const data = await get<unknown>(`/careers/jobs?page=${page}&size=${size}`);
    return items<JobListing>(data);
  } catch { return []; }
}

export async function getJobById(id: string): Promise<JobListing | null> {
  try {
    const data = await get<{ data?: JobListing } | JobListing>(`/careers/jobs/${id}`);
    return (data as Record<string, unknown>)?.data as JobListing ?? data as JobListing;
  } catch { return null; }
}
