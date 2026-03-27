import { SEO } from "../components/SEO";
import { KidsHero } from "../components/kids/KidsHero";
import { KidsServices } from "../components/kids/KidsServices";
import { KidsAges } from "../components/kids/KidsAges";

export function Kids() {
  return (
    <>
      <SEO
        title="Kids \u2014 \u00c7ocuk Di\u015f Hekimli\u011fi, 0\u201318 Ya\u015f"
        description="Positive Dental Kids: \u00e7ocuklara \u00f6zel e\u011flenceli ve korkusuz di\u015f hekimli\u011fi deneyimi. Fiss\u00fcr \u00f6rt\u00fcc\u00fc, flor\u00fcr, s\u00fct di\u015fi takibi ve \u00e7ocuk ortodontisi."
        url="/cocuk-dis-hekimligi"
        keywords={["\u00e7ocuk di\u015f hekimi", "\u00e7ocuk di\u015f\u00e7i", "fiss\u00fcr \u00f6rt\u00fcc\u00fc", "bebek di\u015f", "\u00e7ocuk ortodonti"]}
        schemaType="dental"
      />
      <div className="bg-white overflow-hidden">
        <KidsHero />
        <KidsServices />
        <KidsAges />
      </div>
    </>
  );
}
