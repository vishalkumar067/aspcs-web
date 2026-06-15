"use client";

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

// ─── Generic fetch hook ───────────────────────────────────────────────────────
function useFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Request failed");
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

// ─── Notices ──────────────────────────────────────────────────────────────────
export interface Notice {
  id: string;
  title: string;
  description?: string;
  category: string;
  pdfUrl?: string;
  important: boolean;
  published: boolean;
  publishedAt: string;
  expiresAt?: string;
}

export interface PaginatedNotices {
  content: Notice[];
  totalElements: number;
  totalPages: number;
  page: number;
}

export function useNotices(page = 0, size = 10, category?: string) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (category && category !== "ALL") params.set("category", category);
  return useFetch<PaginatedNotices>(`${API}/notice?${params}`, [page, size, category]);
}

// ─── Gallery Albums ───────────────────────────────────────────────────────────
export interface GalleryImage {
  id: string; url: string; thumbnailUrl: string; alt: string; caption?: string;
}

export interface GalleryAlbum {
  id: string; title: string; category: string;
  coverImageUrl?: string; imageCount: number;
  published: boolean; eventDate?: string;
  images: GalleryImage[];
}

export interface PaginatedAlbums {
  content: GalleryAlbum[];
  totalElements: number;
  totalPages: number;
}

export function useGalleryAlbums(page = 0, size = 12, category?: string) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (category && category !== "ALL") params.set("category", category);
  return useFetch<PaginatedAlbums>(`${API}/gallery/albums?${params}`, [page, size, category]);
}

export function useGalleryAlbum(id: string) {
  return useFetch<GalleryAlbum>(`${API}/gallery/albums/${id}`, [id]);
}

// ─── Events ───────────────────────────────────────────────────────────────────
export interface SchoolEvent {
  id: string; title: string; description: string;
  startDate: string; endDate?: string; venue?: string;
  imageUrl?: string; isHighlight: boolean;
  category: string; createdAt: string;
}

export function useEvents(upcoming?: boolean) {
  const params = new URLSearchParams();
  if (upcoming !== undefined) params.set("upcoming", String(upcoming));
  return useFetch<{ content: SchoolEvent[] }>(`${API}/events?${params}`, [upcoming]);
}

// ─── Admissions ───────────────────────────────────────────────────────────────
export async function submitAdmissionInquiry(data: {
  studentName: string; dateOfBirth: string; gradeApplying: string;
  parentName: string; parentEmail: string; parentPhone: string;
  address?: string; previousSchool?: string; message?: string;
}) {
  const res  = await fetch(`${API}/admissions/inquiries`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Submission failed");
  return json.data;
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export async function submitContactForm(data: {
  name: string; email: string; phone?: string;
  subject: string; message: string;
}) {
  // Contact form — sends via email or saves to DB based on backend implementation
  const res  = await fetch(`${API}/contact`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Submission failed");
  return json.data;
}
