import { SEO } from "../components/SEO";
import { KidsHero } from "../components/kids/KidsHero";
import { KidsServices } from "../components/kids/KidsServices";
import { KidsAges } from "../components/kids/KidsAges";

export function Kids() {
  return (
    <>
      <SEO
        title="Kids — Çocuk Diş Hekimliği, 0–13 Yaş"
        description="Positive Dental Kids: çocuklara özel eğlenceli ve korkusuz diş hekimliği deneyimi. Fissür örtücü, florür, süt dişi takibi ve çocuk ortodontisi."
        url="/cocuk-dis-hekimligi"
        keywords={["çocuk diş hekimi", "çocuk dişçi", "fissür örtücü", "bebek diş", "çocuk ortodonti"]}
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
