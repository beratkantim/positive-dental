import { useState, useEffect } from "react";
import { SEO } from "../components/SEO";
import { supabase } from "@/lib/supabase";
import { AboutHero } from "../components/about/AboutHero";
import { AboutStory } from "../components/about/AboutStory";
import { AboutValues } from "../components/about/AboutValues";
import { AboutTeam } from "../components/about/AboutTeam";

const DEFAULT_FAQ = [
  { q: "Positive Dental Studio Kimdir?", a: "Positive Dental Studio, 2011 y\u0131l\u0131ndan bu yana Adana T\u00fcrkmenba\u015f\u0131 ve \u0130stanbul Ni\u015fanta\u015f\u0131'nda hizmet veren modern di\u015f klini\u011fidir. 25'ten fazla uzman hekimimizle implant, ortodonti, estetik di\u015f hekimli\u011fi ve \u00e7ocuk di\u015f hekimli\u011fi ba\u015fta olmak \u00fczere t\u00fcm di\u015f tedavilerinde y\u00fcksek kaliteli hizmet sunuyoruz." },
  { q: "Hangi tedavi hizmetlerini sunuyorsunuz?", a: "Genel di\u015f hekimli\u011fi, implant tedavisi, ortodonti (\u015feffaf plak ve braket), estetik di\u015f hekimli\u011fi (laminate veneer, zirkonyum kaplama, di\u015f beyazlatma), \u00e7ocuk di\u015f hekimli\u011fi, endodonti (kanal tedavisi), periodontoloji (di\u015f eti tedavisi), a\u011f\u0131z ve \u00e7ene cerrahisi ile dijital anestezi hizmetleri sunmaktay\u0131z." },
  { q: "Randevu nas\u0131l alabilirim?", a: "Web sitemiz \u00fczerinden 7/24 online randevu alabilir, 0850 123 45 67 numaral\u0131 randevu hatt\u0131m\u0131z\u0131 arayabilir veya WhatsApp \u00fczerinden bize ula\u015fabilirsiniz. \u0130lk muayene de\u011ferlendirmemiz \u00fccretsizdir." },
  { q: "Hangi \u015fehirlerde klini\u011finiz var?", a: "\u015eu anda \u0130stanbul Ni\u015fanta\u015f\u0131 ve Adana T\u00fcrkmenba\u015f\u0131 olmak \u00fczere 2 \u015fubemizde hizmet vermekteyiz. Her iki klini\u011fimiz de son teknoloji cihazlarla donat\u0131lm\u0131\u015ft\u0131r." },
  { q: "Anla\u015fmal\u0131 kurumlar\u0131n\u0131z ve sigortalar\u0131n\u0131z var m\u0131?", a: "Evet, bir\u00e7ok \u00f6zel sa\u011fl\u0131k sigortas\u0131 ve kurumsal anla\u015fmam\u0131z mevcuttur. Anla\u015fmal\u0131 kurum ve sigorta listemizi web sitemizdeki ilgili sayfalardan inceleyebilirsiniz." },
];

const DEFAULT_COMPANY = {
  unvan: "Positive Dental Studio A\u011f\u0131z ve Di\u015f Sa\u011fl\u0131\u011f\u0131 A.\u015e.",
  vergi_dairesi: "Seyhan Vergi Dairesi",
  vergi_no: "1234567890",
  ticaret_sicil: "12345",
  tescil_tarihi: "2011",
  mersis_no: "0123456789012345",
  merkez: "Adana, T\u00fcrkiye",
};

export function About() {
  const [eeat, setEeat] = useState<{ faq: typeof DEFAULT_FAQ; company: typeof DEFAULT_COMPANY }>({ faq: DEFAULT_FAQ, company: DEFAULT_COMPANY });

  useEffect(() => {
    supabase.from("site_settings").select("key,value").eq("group_name", "hakkimizda_eeat").then(({ data }) => {
      if (!data || data.length === 0) return;
      const map: Record<string, string> = {};
      data.forEach(d => { map[d.key] = d.value || ""; });
      try {
        if (map.eeat_faq) setEeat(prev => ({ ...prev, faq: JSON.parse(map.eeat_faq) }));
        if (map.eeat_company) setEeat(prev => ({ ...prev, company: JSON.parse(map.eeat_company) }));
      } catch { /* fallback to defaults */ }
    });
  }, []);

  return (
    <>
      <SEO
        title="Hakk\u0131m\u0131zda \u2014 15 Y\u0131ll\u0131k G\u00fcven ve Kalite"
        description="Positive Dental Studio 2011'den bu yana T\u00fcrkiye'nin \u00f6nde gelen di\u015f klini\u011fi. 25+ uzman hekim, 4 \u015fehir, 15.000+ mutlu hasta. Misyon, vizyon ve de\u011ferlerimizi ke\u015ffedin."
        url="/hakkimizda"
        keywords={["positive dental studio hakk\u0131nda", "di\u015f klini\u011fi istanbul", "uzman di\u015f hekimi", "di\u015f klini\u011fi tarihi"]}
        schemaType="dental"
      />
      <div className="bg-white overflow-hidden">
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutTeam eeat={eeat} />
      </div>
    </>
  );
}
