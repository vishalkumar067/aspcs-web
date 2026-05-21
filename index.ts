// ─────────────────────────────────────────────────────────────────────────────
// ASPCS — Shared Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ─── API Response Wrapper ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AdminUser;
  tokens: AuthTokens;
}

// ─── Notice / PDF ─────────────────────────────────────────────────────────
export type NoticeCategory =
  | "ACADEMIC"
  | "EXAM"
  | "HOLIDAY"
  | "ADMISSION"
  | "GENERAL"
  | "URGENT";

export interface Notice {
  id: string;
  title: string;
  description?: string;
  category: NoticeCategory;
  pdfUrl?: string;
  imageUrl?: string;
  isImportant: boolean;
  isPublished: boolean;
  publishedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeDTO {
  title: string;
  description?: string;
  category: NoticeCategory;
  pdfUrl?: string;
  isImportant: boolean;
  expiresAt?: string;
}

// ─── Gallery ──────────────────────────────────────────────────────────────
export type GalleryCategory =
  | "EVENTS"
  | "SPORTS"
  | "ACADEMICS"
  | "INFRASTRUCTURE"
  | "CULTURAL"
  | "GRADUATION";

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  alt: string;
  width: number;
  height: number;
  order: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  coverImage: GalleryImage;
  images: GalleryImage[];
  imageCount: number;
  isPublished: boolean;
  eventDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumDTO {
  title: string;
  description?: string;
  category: GalleryCategory;
  eventDate?: string;
}

// ─── Admissions ───────────────────────────────────────────────────────────
export type InquiryStatus =
  | "PENDING"
  | "CONTACTED"
  | "SHORTLISTED"
  | "ADMITTED"
  | "REJECTED";

export type GradeLevel =
  | "NURSERY"
  | "KG1"
  | "KG2"
  | "GRADE_1"
  | "GRADE_2"
  | "GRADE_3"
  | "GRADE_4"
  | "GRADE_5"
  | "GRADE_6"
  | "GRADE_7"
  | "GRADE_8"
  | "GRADE_9"
  | "GRADE_10";

export interface AdmissionInquiry {
  id: string;
  studentName: string;
  dateOfBirth: string;
  gradeApplying: GradeLevel;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address?: string;
  previousSchool?: string;
  message?: string;
  status: InquiryStatus;
  adminNotes?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface SubmitInquiryDTO {
  studentName: string;
  dateOfBirth: string;
  gradeApplying: GradeLevel;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address?: string;
  previousSchool?: string;
  message?: string;
}

// ─── Events ───────────────────────────────────────────────────────────────
export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  imageUrl?: string;
  isHighlight: boolean;
  category: "ACADEMIC" | "CULTURAL" | "SPORTS" | "HOLIDAY" | "EXAM";
  createdAt: string;
}

// ─── Homepage CMS ─────────────────────────────────────────────────────────
export interface HeroSlide {
  id: string;
  heading: string;
  subheading?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  icon?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating: number;
  isPublished: boolean;
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  bio?: string;
  avatarUrl?: string;
  order: number;
  isPublished: boolean;
}

// ─── Navigation ───────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  isExternal?: boolean;
}

// ─── SEO ──────────────────────────────────────────────────────────────────
export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────
export type SizeVariant  = "xs" | "sm" | "md" | "lg" | "xl";
export type ColorVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info";
export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
