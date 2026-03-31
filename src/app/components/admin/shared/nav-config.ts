import type { Section } from "./types";

export const NAV_ITEMS: { id: Section; label: string; icon: string; badge?: string }[] = [
  { id: "dashboard",    label: "Dashboard",        icon: "📊" },
  { id: "hero",         label: "Hero Slider",       icon: "🖼️" },
  { id: "doctors",      label: "Doktorlar",         icon: "👨‍⚕️" },
  { id: "services",     label: "Tedaviler",         icon: "🦷" },
  { id: "blog",         label: "Blog",              icon: "📝" },
  { id: "branches",     label: "Şubeler",           icon: "📍" },
  { id: "testimonials", label: "Yorumlar",          icon: "⭐" },
  { id: "messages",     label: "Mesajlar",          icon: "💬", badge: "!" },
  { id: "prices",       label: "Fiyat Listesi",     icon: "💰" },
  { id: "partners",     label: "Anlaşmalı Kurumlar", icon: "🏢" },
  { id: "insurances",   label: "Sigortalar",         icon: "🛡️" },
  { id: "doctor_pages",  label: "Doktor Sayfaları",   icon: "🩺" },
  { id: "clinic_pages",  label: "Klinik Sayfaları",   icon: "🏥" },
  { id: "pages",        label: "Sayfa İçerikleri",   icon: "📄" },
  { id: "footer",       label: "Footer",             icon: "🔻" },
  { id: "analytics",    label: "Analitik",           icon: "📈" },
  { id: "settings",     label: "Site Ayarları",     icon: "⚙️" },
  { id: "users",        label: "Kullanıcılar",      icon: "👥" },
  { id: "audit_log",    label: "İşlem Kayıtları",   icon: "📋" },
];
