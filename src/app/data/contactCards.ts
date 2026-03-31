import { Phone, Mail, Clock, MapPin } from "lucide-react";

export const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Telefon",
    sub: "Anında randevu ve bilgi için.",
    content: "0850 123 45 67",
    href: "tel:+908501234567",
    note: "Pzt – Cmt: 09:00 – 20:00",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: Mail,
    title: "E-Posta",
    sub: "24 saat içinde yanıt veriyoruz.",
    content: "info@positivedental.com",
    href: "mailto:info@positivedental.com",
    note: "Hızlı yanıt garantisi",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    sub: "Her gün hizmetinizdeyiz.",
    content: "Pzt – Cmt: 09:00 – 20:00",
    href: "#",
    note: "Cumartesi: 09:00 – 18:00",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: MapPin,
    title: "Kliniklerimiz",
    sub: "Size en yakın şubeyi bulun.",
    content: "İstanbul & Adana",
    href: "/kliniklerimiz",
    note: "Nişantaşı · Türkmenbaşı",
    gradient: "from-amber-500 to-orange-500",
    isInternal: true,
  },
];
