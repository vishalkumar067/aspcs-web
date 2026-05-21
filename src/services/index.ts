import { api } from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  Notice,
  CreateNoticeDTO,
  PaginatedResponse,
  GalleryAlbum,
  CreateAlbumDTO,
  AdmissionInquiry,
  SubmitInquiryDTO,
  SchoolEvent,
  HeroSlide,
  Stat,
  Testimonial,
  Faculty,
} from "@/types";

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authService = {
  login: (payload: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", payload),

  logout: () =>
    api.post<void>("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string }>("/auth/refresh", { refreshToken }),

  me: () =>
    api.get<LoginResponse["user"]>("/auth/me"),
};

// ─── Notices ──────────────────────────────────────────────────────────────
export const noticeService = {
  getAll: (params?: { page?: number; size?: number; category?: string; published?: boolean }) =>
    api.get<PaginatedResponse<Notice>>("/notices", { params }),

  getById: (id: string) =>
    api.get<Notice>(`/notices/${id}`),

  create: (payload: CreateNoticeDTO) =>
    api.post<Notice>("/notices", payload),

  update: (id: string, payload: Partial<CreateNoticeDTO>) =>
    api.put<Notice>(`/notices/${id}`, payload),

  delete: (id: string) =>
    api.delete<void>(`/notices/${id}`),

  togglePublish: (id: string) =>
    api.patch<Notice>(`/notices/${id}/toggle-publish`),
};

// ─── Gallery ──────────────────────────────────────────────────────────────
export const galleryService = {
  getAlbums: (params?: { page?: number; size?: number; category?: string }) =>
    api.get<PaginatedResponse<GalleryAlbum>>("/gallery/albums", { params }),

  getAlbumById: (id: string) =>
    api.get<GalleryAlbum>(`/gallery/albums/${id}`),

  createAlbum: (payload: CreateAlbumDTO) =>
    api.post<GalleryAlbum>("/gallery/albums", payload),

  updateAlbum: (id: string, payload: Partial<CreateAlbumDTO>) =>
    api.put<GalleryAlbum>(`/gallery/albums/${id}`, payload),

  deleteAlbum: (id: string) =>
    api.delete<void>(`/gallery/albums/${id}`),

  addImages: (albumId: string, imageUrls: string[]) =>
    api.post<GalleryAlbum>(`/gallery/albums/${albumId}/images`, { imageUrls }),

  deleteImage: (albumId: string, imageId: string) =>
    api.delete<void>(`/gallery/albums/${albumId}/images/${imageId}`),
};

// ─── Admissions ───────────────────────────────────────────────────────────
export const admissionsService = {
  submit: (payload: SubmitInquiryDTO) =>
    api.post<AdmissionInquiry>("/admissions/inquiries", payload),

  getAll: (params?: { page?: number; size?: number; status?: string }) =>
    api.get<PaginatedResponse<AdmissionInquiry>>("/admissions/inquiries", { params }),

  getById: (id: string) =>
    api.get<AdmissionInquiry>(`/admissions/inquiries/${id}`),

  updateStatus: (id: string, status: AdmissionInquiry["status"], notes?: string) =>
    api.patch<AdmissionInquiry>(`/admissions/inquiries/${id}/status`, { status, adminNotes: notes }),

  delete: (id: string) =>
    api.delete<void>(`/admissions/inquiries/${id}`),
};

// ─── Events ───────────────────────────────────────────────────────────────
export const eventService = {
  getAll: (params?: { page?: number; upcoming?: boolean }) =>
    api.get<PaginatedResponse<SchoolEvent>>("/events", { params }),

  getById: (id: string) =>
    api.get<SchoolEvent>(`/events/${id}`),

  create: (payload: Omit<SchoolEvent, "id" | "createdAt">) =>
    api.post<SchoolEvent>("/events", payload),

  update: (id: string, payload: Partial<SchoolEvent>) =>
    api.put<SchoolEvent>(`/events/${id}`, payload),

  delete: (id: string) =>
    api.delete<void>(`/events/${id}`),
};

// ─── CMS / Homepage ───────────────────────────────────────────────────────
export const cmsService = {
  getHeroSlides: () =>
    api.get<HeroSlide[]>("/cms/hero-slides"),

  updateHeroSlides: (slides: Omit<HeroSlide, "id">[]) =>
    api.put<HeroSlide[]>("/cms/hero-slides", { slides }),

  getStats: () =>
    api.get<Stat[]>("/cms/stats"),

  updateStats: (stats: Omit<Stat, "id">[]) =>
    api.put<Stat[]>("/cms/stats", { stats }),

  getTestimonials: () =>
    api.get<Testimonial[]>("/cms/testimonials"),

  getFaculty: () =>
    api.get<Faculty[]>("/cms/faculty"),
};
