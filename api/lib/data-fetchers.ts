import { supabaseServer } from "./supabase-server";

// ── Route → Data fetchers ──────────────────────────────────────────────────────
// Her fonksiyon, ilgili sayfa componentinin useTable/useEffect'te yaptığı
// aynı query'leri sunucu tarafında çalıştırır.

export async function fetchHomeData() {
  const [slides, testimonials] = await Promise.all([
    supabaseServer.from("hero_slides").select("*").order("sort_order", { ascending: true }),
    supabaseServer.from("testimonials").select("*").order("created_at", { ascending: false }),
  ]);
  return {
    hero_slides: slides.data || [],
    testimonials: testimonials.data || [],
  };
}

export async function fetchServicesData() {
  const { data } = await supabaseServer.from("services").select("*").order("sort_order", { ascending: true });
  return { services: data || [] };
}

export async function fetchLocationsData() {
  const { data } = await supabaseServer.from("branches").select("*").order("sort_order", { ascending: true });
  return { branches: data || [] };
}

export async function fetchBlogData() {
  const { data } = await supabaseServer.from("blog_posts").select("*").order("created_at", { ascending: false });
  return { blog_posts: data || [] };
}

export async function fetchBlogPostData(slug: string) {
  const [single, all] = await Promise.all([
    supabaseServer.from("blog_posts").select("*").eq("slug", slug).single(),
    supabaseServer.from("blog_posts").select("*").order("created_at", { ascending: false }),
  ]);
  return {
    blog_post: single.data || null,
    blog_posts: all.data || [],
  };
}

export async function fetchPriceListData() {
  const [items, categories] = await Promise.all([
    supabaseServer.from("price_items").select("*").order("sort_order", { ascending: true }),
    supabaseServer.from("price_categories").select("*").order("sort_order", { ascending: true }),
  ]);
  return {
    price_items: items.data || [],
    price_categories: categories.data || [],
  };
}

export async function fetchDoctorsData() {
  const [doctors, branches] = await Promise.all([
    supabaseServer.from("doctors").select("*").order("sort_order", { ascending: true }),
    supabaseServer.from("branches").select("*").order("sort_order", { ascending: true }),
  ]);
  return {
    doctors: doctors.data || [],
    branches: branches.data || [],
  };
}

export async function fetchAppointmentData() {
  const { data } = await supabaseServer.from("doctors").select("*").order("sort_order", { ascending: true });
  return { doctors: data || [] };
}
