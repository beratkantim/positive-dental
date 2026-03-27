import { useEffect } from "react";
import { useLocation } from "react-router";
import { supabase } from "@/lib/supabase";

function getDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  return "Other";
}

function getSessionId(): string {
  let id = sessionStorage.getItem("_sid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("_sid", id);
  }
  return id;
}

// Aynı path'e 5 saniye içinde tekrar kayıt gönderme (spam/bot koruması)
const recentPaths = new Map<string, number>();

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    // Bot, crawler, prerender atla
    if (ua.includes("bot") || ua.includes("crawl") || ua.includes("spider") || ua.includes("prerender")) return;
    // Headless browser atla
    if (ua.includes("headless") || !navigator.languages?.length) return;

    // Rate limit: aynı path 5 saniye içinde tekrar gönderilmez
    const now = Date.now();
    const lastSent = recentPaths.get(location.pathname) || 0;
    if (now - lastSent < 5000) return;
    recentPaths.set(location.pathname, now);

    // Eski kayıtları temizle (memory leak önleme)
    if (recentPaths.size > 50) {
      for (const [k, v] of recentPaths) { if (now - v > 30000) recentPaths.delete(k); }
    }

    supabase.from("page_views").insert({
      path: location.pathname,
      referrer: document.referrer || "",
      device: getDevice(),
      browser: getBrowser(),
      session_id: getSessionId(),
    }).then(() => {}); // fire and forget
  }, [location.pathname]);
}
