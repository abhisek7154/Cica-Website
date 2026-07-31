export type NoticeType = "general" | "holiday" | "exam" | "admission";
export type EventType = "event" | "exam";

export interface HeroSlide {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isActive: boolean;
}

export interface HeroContent {
  id: number;
  title: string;
  subtitle: string;

  primaryButtonText: string;
  primaryButtonLink: string;

  secondaryButtonText: string;
  secondaryButtonLink: string;

  autoplay: boolean;
  autoplaySpeed: number;
  overlayOpacity: number;

  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
}

export type GalleryDisplayMode = "grid" | "slideshow";

export interface GalleryDisplayConfig {
  mode: GalleryDisplayMode;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  category: string;
  type: EventType;
  createdAt?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: NoticeType;
  createdAt?: string;
}

export interface AnnouncementItem {
  id: string;
  message: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  subject: string;
  bio: string;
  photo: string;
  pdfUrl?: string;
  pdfTitle?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  description: string;
  imageUrl: string;
  pdfUrl?: string;
  pdfTitle?: string;
}

export interface ContactSettings {
  schoolName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;

  phone: string;
  alternatePhone?: string;

  email: string;
  website?: string;

  facebook?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;

  googleMapEmbed?: string;
  officeHours?: string;

  latitude?: number;
  longitude?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export type NavSectionKey =
  | "home"
  | "gallery"
  | "events"
  | "notices"
  | "staff"
  | "contact";

export type NavConfig = Record<NavSectionKey, boolean>;

export interface DownloadItem {
  id: string;
  title: string;
  description?: string;

  category: string;

  fileUrl: string;

  downloads: number;

  displayOrder: number;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentItem {
  id: string;

  title: string;
  category: string;

  description?: string;

  fileUrl: string;

  downloads: number;

  displayOrder: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  captchaAnswer: number;
  captchaExpected: number;
}
