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

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    // Bot'ları ve prerender'ları atla
    if (navigator.userAgent.includes("bot") || navigator.userAgent.includes("prerender")) return;

    supabase.from("page_views").insert({
      path: location.pathname,
      referrer: document.referrer || "",
      device: getDevice(),
      browser: getBrowser(),
      session_id: getSessionId(),
    }).then(() => {}); // fire and forget
  }, [location.pathname]);
}
