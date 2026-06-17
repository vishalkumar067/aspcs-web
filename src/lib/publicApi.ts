// ─── Public API — no authentication required ──────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL
  ?? "https://aspcs-backend-production.up.railway.app/api/v1";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// Unwraps all known response shapes including { success, data: { content: [] } }
function items<T>(raw: unknown): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as T[];
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.content)) return r.content as T[];
  if (Array.isArray(r.data))    return r.data    as T[];
  if (Array.isArray(r.items))   return r.items   as T[];
  // ApiResponse wrapping a Page: { success, data: { content: [] } }
  if (r.data && typeof r.data === "object") {
    const d = r.data as Record<string, unknown>;
    if (Array.isArray(d.content)) return d.content as T[];
    if (Array.isArray(d.items))   return d.items   as T[];
    if (Array.isArray(d.data))    return d.data    as T[];
  }
  return [];
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
  try { return items<Notice>(await get<unknown>(`/notices/public?page=${page}&size=${size}`)); }
  catch { return []; }
}

export async function getLatestNotices(): Promise<Notice[]> {
  try { return items<Notice>(await get<unknown>("/notices/public/latest")); }
  catch { return []; }
}

// ─── Event API ────────────────────────────────────────────────────────────────
export async function getPublicEvents(page = 0, size = 20): Promise<Event[]> {
  try { return items<Event>(await get<unknown>(`/events/public?page=${page}&size=${size}`)); }
  catch { return []; }
}

export async function getHighlightEvents(): Promise<Event[]> {
  try { return items<Event>(await get<unknown>("/events/public/highlights")); }
  catch { return []; }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try { return items<Event>(await get<unknown>("/events/public/upcoming")); }
  catch { return []; }
}

// ─── Gallery API ──────────────────────────────────────────────────────────────
export async function getPublicAlbums(page = 0, size = 12): Promise<GalleryAlbum[]> {
  try { return items<GalleryAlbum>(await get<unknown>(`/gallery/public?page=${page}&size=${size}`)); }
  catch { return []; }
}

export async function getAlbumImages(albumId: string): Promise<GalleryImage[]> {
  try { return items<GalleryImage>(await get<unknown>(`/gallery/public/${albumId}/images`)); }
  catch { return []; }
}

// ─── Careers API ──────────────────────────────────────────────────────────────
export async function getActiveJobs(page = 0, size = 10): Promise<JobListing[]> {
  try { return items<JobListing>(await get<unknown>(`/careers/jobs?page=${page}&size=${size}`)); }
  catch { return []; }
}

export async function getJobById(id: string): Promise<JobListing | null> {
  try {
    const raw = await get<unknown>(`/careers/jobs/${id}`);
    const r = raw as Record<string, unknown>;
    return (r?.data ?? raw) as JobListing;
  } catch { return null; }
}
