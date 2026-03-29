import { SEO } from "../components/SEO";
import { BookingWizard } from "../components/BookingWizard";

export function OnlineRandevu() {
  return (
    <>
      <SEO
        title="Online Randevu Al"
        description="Positive Dental Studio online randevu sistemi. 5 adımda hızlıca randevunuzu oluşturun."
        url="/online-randevu"
        keywords={["diş randevu", "online randevu", "diş hekimi randevu", "diş kliniği randevu"]}
        schemaType="dental"
      />
      <BookingWizard />
    </>
  );
}
