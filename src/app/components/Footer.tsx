import { Link } from "react-router";
import { Phone, Mail, Clock } from "lucide-react";
import logo from "../../assets/logo.webp";

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const socialLinks = [
  { Icon: FacebookIcon, href: "#", label: "Facebook", bg: "hover:bg-[#1877f2]" },
  { Icon: XIcon, href: "#", label: "X", bg: "hover:bg-black" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube", bg: "hover:bg-[#ff0000]" },
  { Icon: InstagramIcon, href: "#", label: "Instagram", bg: "hover:bg-pink-600" },
  { Icon: LinkedInIcon, href: "#", label: "LinkedIn", bg: "hover:bg-[#0077b5]" },
  { Icon: WhatsAppIcon, href: "https://wa.me/905001234567", label: "WhatsApp", bg: "hover:bg-[#25d366]" },
];

export function Footer() {
  return (
    <footer className="bg-[#111A3E] text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* About */}
          <div>
            <div className="mb-4">
              <img
                src={logo}
                alt="Positive Dental Studio"
                className="h-10 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-sm text-blue-300 mb-5 leading-relaxed">
              <span className="text-white font-medium">Where positivity begins</span>
              <br />
              Gülüşünüz bizim için değerli. İstanbul Nişantaşı ve Adana Türkmenbaşı şubelerimizde modern teknoloji ve uzman kadroyla yanınızdayız.
            </p>

            {/* Social Icons — tek yer */}
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map(({ Icon, href, label, bg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-900 transition-all duration-200 ${bg} hover:text-white hover:scale-110 shadow-sm`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Ana Sayfa" },
                { to: "/services", label: "Hizmetlerimiz" },
                { to: "/prices", label: "Fiyat Listesi" },
                { to: "/about", label: "Hakkımızda" },
                { to: "/locations", label: "Kliniklerimiz" },
                { to: "/blog", label: "Blog" },
                { to: "/contact", label: "İletişim" },
                { to: "/partners", label: "Anlaşmalı Kurumlar" },
                { to: "/insurance", label: "Anlaşmalı Sigortalar" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-blue-300 hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2.5">
              {[
                "Genel Diş Hekimliği",
                "İmplant Tedavisi",
                "Estetik Diş Hekimliği",
                "Ortodonti",
                "Çocuk Diş Hekimliği",
              ].map((service) => (
                <li key={service} className="text-sm text-blue-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-100">0850 123 45 67</p>
                  <p className="text-xs text-blue-400">Randevu Hattı</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <p className="text-sm text-blue-100">info@positivedental.com</p>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-100">Pzt – Cmt: 09:00 – 20:00</p>
                  <p className="text-xs text-blue-400">Cumartesi: 09:00 – 18:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-slate-500">
            © 2026 Positive Dental Studio. Tüm hakları saklıdır.
          </p>
          <a
            href="https://randevu.positivedental.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Randevu Al →
          </a>
        </div>
      </div>
    </footer>
  );
}