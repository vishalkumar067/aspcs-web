// ─── Central API Client ──────────────────────────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL
  ?? "https://aspcs-backend-production.up.railway.app/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    // Try every possible key Zustand persist might use
    const keys = ["auth-storage", "auth", "authStore", "aspcs-auth", "admin-auth"];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const token =
        parsed?.state?.token        ??
        parsed?.state?.accessToken  ??
        parsed?.state?.jwt          ??
        parsed?.token               ??
        parsed?.accessToken         ??
        parsed?.jwt                 ??
        null;
      if (token && typeof token === "string" && token.startsWith("ey")) {
        return token;
      }
    }
  } catch { /* silent */ }
  return null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    // ⚠️ Do NOT auto-redirect here — that was causing the fake "logout".
    // Let the calling component decide what to do with 401/403.
    const text = await res.text().catch(() => "");
    let message = text;
    try { message = JSON.parse(text)?.message ?? text; } catch { /* use raw text */ }
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
};

// ─── Debug helper (run in browser console to see your token) ─────────────────
// Copy-paste this in DevTools console:
// JSON.parse(localStorage.getItem('auth-storage') || '{}')

// ─── Safe list helper ─────────────────────────────────────────────────────────
export function toArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.content)) return d.content as T[];
  if (Array.isArray(d.data))    return d.data    as T[];
  if (Array.isArray(d.items))   return d.items   as T[];
  return [];
}

// ─── Cloudinary ───────────────────────────────────────────────────────────────
const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME    ?? "dug0g6tli";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "v0pil9fa";

export async function uploadImage(file: File, folder = "aspcs"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  return (await res.json()).secure_url as string;
}

export async function uploadPDF(file: File, folder = "aspcs/docs"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", folder);
  form.append("resource_type", "raw");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Cloudinary PDF upload failed");
  return (await res.json()).secure_url as string;
}
