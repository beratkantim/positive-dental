export type { Branch, Doctor, Service, BlogPost, BranchData, Testimonial, ContactMessage, SiteSetting, HeroSlide, PriceItem } from "@/lib/supabase";

export type Section =
  | "dashboard" | "hero" | "doctors" | "services"
  | "blog" | "branches" | "testimonials" | "messages"
  | "prices" | "settings" | "users" | "analytics"
  | "partners" | "insurances" | "pages" | "footer" | "audit_log" | "service_pages" | "doctor_pages" | "clinic_pages";
