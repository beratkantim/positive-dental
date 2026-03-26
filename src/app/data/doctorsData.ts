export type Branch = "adana" | "istanbul";

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  branch: Branch;
  branchLabel: string;
  photo: string;
  bio: string;
  education: string[];
  expertise: string[];
  bookingUrl: string;
}

export const DOCTORS: Doctor[] = [
  /* ── Adana Türkmenbaşı ─────────────────────────────── */
  {
    id: "dt-elif-kaya",
    name: "Dt. Elif Kaya",
    title: "Diş Hekimi",
    specialty: "Genel Diş Hekimliği & Estetik",
    branch: "adana",
    branchLabel: "Adana Türkmenbaşı",
    photo: "https://images.unsplash.com/photo-1754715203698-70c7ad3a879d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "10 yılı aşkın deneyimiyle estetik diş hekimliği ve gülüş tasarımı konusunda uzmanlaşmış, hasta memnuniyetini her şeyin önünde tutan bir hekim.",
    education: [
      "Çukurova Üniversitesi Diş Hekimliği Fakültesi",
      "İmplantoloji Sertifika Programı – Türk İmplant Derneği",
    ],
    expertise: ["Gülüş Tasarımı", "Zirkonyum Kaplama", "Diş Beyazlatma", "Kompozit Bonding"],
    bookingUrl: "https://randevu.positivedental.com",
  },
  {
    id: "dt-murat-demir",
    name: "Dt. Murat Demir",
    title: "Uzman Diş Hekimi",
    specialty: "İmplantoloji & Cerrahi",
    branch: "adana",
    branchLabel: "Adana Türkmenbaşı",
    photo: "https://images.unsplash.com/photo-1631596577204-53ad0d6e6978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "İmplant cerrahisi ve ileri cerrahi prosedürler konusunda uzman olan Dt. Demir, 1.500'ün üzerinde başarılı implant uygulamasına sahiptir.",
    education: [
      "Ankara Üniversitesi Diş Hekimliği Fakültesi",
      "Oral İmplantoloji Uzmanlık – ITI Türkiye",
    ],
    expertise: ["Dental İmplant", "Sinüs Lifting", "Kemik Grefti", "All-on-4 / All-on-6"],
    bookingUrl: "https://randevu.positivedental.com",
  },
  {
    id: "dt-selin-arslan",
    name: "Dt. Selin Arslan",
    title: "Ortodonti Uzmanı",
    specialty: "Ortodonti & Invisalign",
    branch: "adana",
    branchLabel: "Adana Türkmenbaşı",
    photo: "https://images.unsplash.com/photo-1772987057599-2f1088c1e993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Şeffaf plak tedavisi ve geleneksel braket sistemleri konusunda uzmanlaşmış, her yaş grubuna yönelik ortodontik çözümler sunan hekim.",
    education: [
      "Ege Üniversitesi Ortodonti Anabilim Dalı – Uzmanlık",
      "Invisalign Sertifikalı Sağlayıcı – Diamond Provider",
    ],
    expertise: ["Invisalign", "Metal Braket", "Seramik Braket", "Çocuk Ortodonti"],
    bookingUrl: "https://randevu.positivedental.com",
  },

  /* ── İstanbul Nişantaşı ────────────────────────────── */
  {
    id: "dt-can-yilmaz",
    name: "Dt. Can Yılmaz",
    title: "Uzman Diş Hekimi",
    specialty: "Periodontoloji & İmplant",
    branch: "istanbul",
    branchLabel: "İstanbul Nişantaşı",
    photo: "https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Diş eti hastalıkları ve implant cerrahisinde uzman olan Dt. Yılmaz, minimal invazif yaklaşımlarıyla tanınmakta ve yılda 200+ başarılı uygulama gerçekleştirmektedir.",
    education: [
      "İstanbul Üniversitesi Diş Hekimliği Fakültesi",
      "Periodontoloji Uzmanlığı – Marmara Üniversitesi",
    ],
    expertise: ["Periodontoloji", "Lazer Diş Eti Tedavisi", "İmplant", "Kemik Rejenerasyonu"],
    bookingUrl: "https://randevu.positivedental.com",
  },
  {
    id: "dt-ayse-celik",
    name: "Dt. Ayşe Çelik",
    title: "Estetik Diş Hekimi",
    specialty: "Estetik Diş Hekimliği & Lamine",
    branch: "istanbul",
    branchLabel: "İstanbul Nişantaşı",
    photo: "https://images.unsplash.com/photo-1565090567208-c8038cfcf6cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Lamine veneer ve porselenden gülüş tasarımı alanında öncü isimlerden biri olan Dt. Çelik, uluslararası estetik diş hekimliği kongrelerinde konuşmacı olarak yer almaktadır.",
    education: [
      "Hacettepe Üniversitesi Diş Hekimliği Fakültesi",
      "Estetik Diş Hekimliği – EAED Üyesi",
    ],
    expertise: ["Lamine Veneer", "Porelen Kaplama", "Gülüş Tasarımı", "Ofis Beyazlatma"],
    bookingUrl: "https://randevu.positivedental.com",
  },
  {
    id: "dt-berk-sahin",
    name: "Dt. Berk Şahin",
    title: "Ortodonti & Pedodonti",
    specialty: "Çocuk Diş Hekimliği & Ortodonti",
    branch: "istanbul",
    branchLabel: "İstanbul Nişantaşı",
    photo: "https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Çocuk ve ergen hastalarda ortodontik tedavi ile koruyucu diş hekimliği konusunda uzmanlaşmış; çocukların kliniğe olan kaygılarını azaltma konusunda özel eğitim almış hekim.",
    education: [
      "İstanbul Üniversitesi Pedodonti Uzmanlığı",
      "Çocuk Ortodontisi – Türk Ortodonti Derneği",
    ],
    expertise: ["Çocuk Diş Hekimliği", "Koruyucu Ortodonti", "Fissür Örtücü", "Florür Uygulaması"],
    bookingUrl: "https://randevu.positivedental.com",
  },
  {
    id: "dt-naz-yildiz",
    name: "Dt. Naz Yıldız",
    title: "Diş Hekimi",
    specialty: "Endodonti & Restoratif",
    branch: "istanbul",
    branchLabel: "İstanbul Nişantaşı",
    photo: "https://images.unsplash.com/photo-1759350075177-eeb89d507990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    bio: "Kanal tedavisi ve restoratif diş hekimliğinde uzmanlaşmış olan Dt. Yıldız, modern endodontik teknolojilerle ağrısız ve hızlı tedavi protokolleri uygulamaktadır.",
    education: [
      "Gazi Üniversitesi Diş Hekimliği Fakültesi",
      "Endodonti İleri Eğitim – Türk Endodonti Derneği",
    ],
    expertise: ["Kanal Tedavisi", "Kompozit Dolgu", "Porselen İnley", "Restorasyon"],
    bookingUrl: "https://randevu.positivedental.com",
  },
];

export const BRANCHES = [
  { id: "adana" as Branch, label: "Adana Türkmenbaşı", icon: "🌟" },
  { id: "istanbul" as Branch, label: "İstanbul Nişantaşı", icon: "✨" },
];
