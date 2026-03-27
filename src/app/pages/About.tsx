import { useState, useEffect } from "react";
import { SEO } from "../components/SEO";
import { supabase } from "@/lib/supabase";
import { AboutHero } from "../components/about/AboutHero";
import { AboutStory } from "../components/about/AboutStory";
import { AboutValues } from "../components/about/AboutValues";
import { AboutTeam } from "../components/about/AboutTeam";

const DEFAULT_FAQ = [
  { q: "Positive Dental Studio Kimdir?", a: "Positive Dental Studio, 2011 yılından bu yana Adana Türkmenbaşı ve İstanbul Nişantaşı'nda hizmet veren modern diş kliniğidir." },
  { q: "Hangi tedavi hizmetlerini sunuyorsunuz?", a: "İmplant, ortodonti, estetik diş hekimliği, çocuk diş hekimliği, kanal tedavisi, periodontoloji ve dijital anestezi hizmetleri sunmaktayız." },
  { q: "Randevu nasıl alabilirim?", a: "Web sitemiz üzerinden 7/24 online randevu alabilir veya 0850 123 45 67 numaralı hattımızı arayabilirsiniz. İlk muayene ücretsizdir." },
  { q: "Hangi şehirlerde kliniğiniz var?", a: "İstanbul Nişantaşı ve Adana Türkmenbaşı olmak üzere 2 şubemizde hizmet vermekteyiz." },
  { q: "Anlaşmalı kurumlarınız ve sigortalarınız var mı?", a: "Evet, birçok özel sağlık sigortası ve kurumsal anlaşmamız mevcuttur." },
];

const DEFAULT_COMPANY = {
  unvan: "Positive Dental Studio Ağız ve Diş Sağlığı A.Ş.",
  vergi_dairesi: "Seyhan Vergi Dairesi",
  vergi_no: "1234567890",
  ticaret_sicil: "12345",
  tescil_tarihi: "2011",
  mersis_no: "0123456789012345",
  merkez: "Adana, Türkiye",
};

export function About() {
  const [eeat, setEeat] = useState({ faq: DEFAULT_FAQ, company: DEFAULT_COMPANY });
  const [pageContent, setPageContent] = useState({ story: "", mission: "", vision: "", values: "" });

  useEffect(() => {
    // Hakkımızda sayfa içerikleri
    supabase.from("site_settings").select("key,value").in("group_name", ["hakkimizda", "hakkimizda_eeat"]).then(({ data }) => {
      if (!data || data.length === 0) return;
      const map: Record<string, string> = {};
      data.forEach(d => { map[d.key] = d.value || ""; });

      // Sayfa içerikleri
      setPageContent({
        story: map.about_story || "",
        mission: map.about_mission || "",
        vision: map.about_vision || "",
        values: map.about_values || "",
      });

      // E-E-A-T
      try {
        if (map.eeat_faq) setEeat(prev => ({ ...prev, faq: JSON.parse(map.eeat_faq) }));
        if (map.eeat_company) setEeat(prev => ({ ...prev, company: JSON.parse(map.eeat_company) }));
      } catch { /* fallback */ }
    });
  }, []);

  return (
    <>
      <SEO
        title="Hakkımızda — 15 Yıllık Güven ve Kalite"
        description="Positive Dental Studio 2011'den bu yana Türkiye'nin önde gelen diş kliniği. 25+ uzman hekim, 2 şube, 15.000+ mutlu hasta."
        url="/hakkimizda"
        keywords={["positive dental studio hakkında", "diş kliniği istanbul", "uzman diş hekimi"]}
        schemaType="dental"
      />
      <div className="bg-white overflow-hidden">
        <AboutHero />
        <AboutStory
          story={pageContent.story}
          mission={pageContent.mission}
          vision={pageContent.vision}
        />
        <AboutValues />
        <AboutTeam eeat={eeat} />
      </div>
    </>
  );
}
