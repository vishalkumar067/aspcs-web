// ─── Central API Client ──────────────────────────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL
  ?? "https://aspcs-backend-production.up.railway.app/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("aspcs-admin-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    // FormData sets its own multipart/form-data + boundary header automatically;
    // forcing application/json here would corrupt the upload, so it's skipped.
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try { message = JSON.parse(text)?.message ?? text; } catch { /* raw */ }
    throw new Error(message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as T;
}

export const api = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", body: formData }),
  // For binary responses (file downloads) — request() always calls res.json(),
  // which would throw on an .xlsx byte stream, so this bypasses that.
  downloadFile: async (path: string, filename: string): Promise<void> => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  },
};

// ─── toArray: unwraps all known response shapes ───────────────────────────────
//
//  Shape 1 — plain array:             []
//  Shape 2 — Spring Page:             { content: [], totalElements: N }
//  Shape 3 — ApiResponse flat:        { data: [], success: true }
//  Shape 4 — ApiResponse + Page:      { data: { content: [], totalElements: N }, success: true }
//
export function toArray<T>(raw: unknown): T[] {
  if (!raw) return [];

  // Shape 1
  if (Array.isArray(raw)) return raw as T[];

  const r = raw as Record<string, unknown>;

  // Shape 2 — Spring Page at top level
  if (Array.isArray(r.content)) return r.content as T[];

  // Shape 3 — data is already a plain array
  if (Array.isArray(r.data)) return r.data as T[];

  // Shape 4 — ApiResponse wrapping a Page  ← THE MISSING CASE
  if (r.data && typeof r.data === "object" && !Array.isArray(r.data)) {
    const d = r.data as Record<string, unknown>;
    if (Array.isArray(d.content)) return d.content as T[];
    if (Array.isArray(d.items))   return d.items   as T[];
    if (Array.isArray(d.data))    return d.data    as T[];
  }

  // Fallback
  if (Array.isArray(r.items)) return r.items as T[];

  return [];
}

// ─── unwrapData: get the raw data field from ApiResponse ─────────────────────
// Use when you need scalars (stats, single objects) not arrays
export function unwrapData<T>(raw: unknown): T | null {
  if (!raw) return null;
  const r = raw as Record<string, unknown>;
  if ("data" in r) return r.data as T;
  return raw as T;
}

// ─── Cloudinary ───────────────────────────────────────────────────────────────
const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME    ?? "dug0g6tli";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "v0pil9fa";

export async function uploadImage(file: File, folder = "aspcs"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  return (await res.json()).secure_url as string;
}

export async function uploadPDF(file: File, folder = "aspcs/docs"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", folder);
  form.append("resource_type", "raw");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary PDF upload failed");
  return (await res.json()).secure_url as string;
}
