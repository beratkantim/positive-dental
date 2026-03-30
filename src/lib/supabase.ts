import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types
export type Branch = "adana" | "istanbul";
export type AdminRole = "super_admin" | "editor";

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  title: string;
  specialty: string;
  branch: Branch;
  branch_label: string;
  branches: string[];
  branches_labels: string[];
  service_ids: string[];
  dentsoft_id: string;
  photo: string;
  bio: string;
  content: string;
  meta_description: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
  education: string[];
  expertise: string[];
  booking_url: string;
  is_active: boolean;
  is_manager: boolean;
  sort_order: number;
}

export interface TreatmentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Treatment {
  id: string;
  category_id: string | null;
  title: string;
  title_en: string;
  price: number;
  discount_rate: number;
  cost: number;
  currency: string;
  tooth_type: number | null;
  duration_minutes: number;
  exam_type: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  // joined
  category?: TreatmentCategory;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color_from: string;
  color_to: string;
  image: string;
  price_range: string;
  features: string[];
  content: string;
  meta_description: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  category_id: string | null;
  // joined
  category?: TreatmentCategory;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  category_color: string;
  author: string;
  author_title: string;
  content: string;
  image: string;
  keywords: string[];
  meta_description: string;
  read_time: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface BranchData {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  map_url: string;
  working_hours: string;
  image: string;
  content: string;
  meta_description: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
  gallery: string[];
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
  branch: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  branch: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  label: string;
  type: string;
  group_name: string;
}

export interface HeroSlide {
  id: string;
  tag: string;
  tag_color: string;
  title: string;
  title_gradient: string;
  subtitle: string;
  badge: string;
  image: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface PriceItem {
  id: string;
  category: string;
  name: string;
  price_min: number;
  price_max: number;
  price_note: string;
  is_active: boolean;
  sort_order: number;
}
