import { z } from "zod";

const assetUrlSchema = z
  .string()
  .min(2, "Asset URL is required.")
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Enter a valid absolute URL or /uploads path."
  );

export const contactSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .regex(/^[+]?[0-9\s-]{8,16}$/, "Enter a valid phone number."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  captchaAnswer: z.coerce.number(),
  captchaExpected: z.coerce.number()
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address.")
});

export const eventSchema = z.object({
  title: z.string().min(3),
  date: z.string().min(8),
  description: z.string().min(10),
  location: z.string().min(2),
  category: z.string().min(2).optional(),
  type: z.enum(["event", "exam"])
});

export const noticeSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(8),
  date: z.string().min(8),
  type: z.enum([
    "general",
    "holiday",
    "exam",
    "admission"
  ])
});

export const announcementSchema = z.object({
  message: z.string().trim().min(3, "Announcement message is required."),
  displayOrder: z.number().int().min(0, "Display order must be zero or greater."),
  isActive: z.boolean()
});

export const announcementUpdateSchema = announcementSchema.extend({
  id: z.string().min(1, "Announcement ID is required.")
});

export const imageSchema = z.object({
  url: assetUrlSchema,
  alt: z.string().min(3),
  category: z.string().min(2)
});

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1)
});

export const adminPinLoginSchema = z.object({
  pin: z.string().min(4).max(32)
});

export const adminPinChangeSchema = z.object({
  currentPin: z.string().min(4).max(32),
  newPin: z.string().min(4).max(32)
});

export const imageUpdateSchema = z.object({
  alt: z.string().min(3),
  category: z.string().min(2),
  url: assetUrlSchema.optional()
});

export const heroSlideSchema = z.object({
  title: z.string().min(1, "Title is required."),
  imageUrl: assetUrlSchema,
  altText: z.string().min(1, "Alt text is required."),
  displayOrder: z.number().int().nonnegative(),
  isActive: z.boolean()
});

export const heroContentSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().min(2),

  primaryButtonText: z.string().min(1),
  primaryButtonLink: z.string().min(1),

  secondaryButtonText: z.string().min(1),
  secondaryButtonLink: z.string().min(1),

  autoplay: z.boolean(),
  autoplaySpeed: z.number().positive(),
  overlayOpacity: z.number().min(0).max(1)
});

export const staffSchema = z.object({
  name: z.string().min(2, "Teacher name should be at least 2 characters."),
  subject: z.string().min(2, "Subject is required."),
  bio: z.string().min(8, "Bio should be at least 8 characters."),
  photo: assetUrlSchema
});

export const contactSettingsSchema = z.object({
  schoolName: z.string().min(2),

  address: z.string().min(6),

  city: z.string().min(2),

  state: z.string().min(2),

  postalCode: z.string().min(3),

  phone: z
    .string()
    .regex(/^[+]?[0-9\s-]{8,16}$/, "Enter a valid phone number."),

  alternatePhone: z.string().optional(),

  email: z.string().email(),

  website: z.string().optional(),

  facebook: z.string().optional(),

  instagram: z.string().optional(),

  youtube: z.string().optional(),

  whatsapp: z.string().optional(),

  googleMapEmbed: z.string().optional(),

  officeHours: z.string().optional(),

  latitude: z.number().optional(),

  longitude: z.number().optional()
});

export const navConfigSchema = z.object({
  home: z.boolean(),
  gallery: z.boolean(),
  events: z.boolean(),
  notices: z.boolean(),
  staff: z.boolean(),
  contact: z.boolean()
});

export const galleryDisplayConfigSchema = z.object({
  mode: z.enum(["grid", "slideshow"])
});

export const teacherTextSchema = z.object({
  name: z.string().min(2, "Teacher name should be at least 2 characters."),
  subject: z.string().min(2, "Subject is required."),
  description: z.string().min(8, "Description should be at least 8 characters.")
});

export const documentTextSchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters.")
});
