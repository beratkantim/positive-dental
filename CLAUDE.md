# Positive Dental Studio — Proje Kuralları

## ⚠️ SEO Kritik Dosyalar — Değiştirme!
Aşağıdaki dosyalar SEO optimizasyonu için özel ayarlanmıştır. Değişiklik yapmadan önce kullanıcıya danışın:

- `index.html` — Meta tag sıralaması (charset → title → description → canonical → css → og → favicon), preconnect/preload stratejisi, font non-blocking yükleme
- `src/app/components/SEO.tsx` — Title şablonu, canonical URL'ler, Open Graph, JSON-LD structured data
- `src/app/routes.tsx` — Türkçe SEO URL path'leri (/hizmetlerimiz, /hakkimizda vb.)
- `vercel.json` — 301 redirect'ler (eski İngilizce path → yeni Türkçe path), SPA rewrite kuralları
- `src/styles/index.css` — Mobil performans optimizasyonları (blur gizleme, backdrop-filter kapatma)

## Route URL'leri (Değiştirme!)
| Eski (İngilizce) | Yeni (Türkçe) |
|---|---|
| /services | /hizmetlerimiz |
| /about | /hakkimizda |
| /locations | /kliniklerimiz |
| /contact | /iletisim |
| /kids | /cocuk-dis-hekimligi |
| /partners | /anlasmali-kurumlar |
| /insurance | /anlasmali-sigortalar |
| /prices | /fiyat-listesi |
| /doctors | /doktorlarimiz |

## Veritabanı Tabloları
- `treatment_categories` — Tedavi ana kategorileri (12 kategori)
- `treatments` — Tedavi kalemleri (293 kayıt, XLS'den import edildi)
- `doctors` — Doktor bilgileri
- `branches` — Şube/klinik bilgileri
- `blogs` — Blog yazıları
- `testimonials` — Hasta yorumları
- `price_items` — Fiyat listesi kalemleri

## Dentsoft API Entegrasyonu
- Proxy: `api/dentsoft.js` (Vercel serverless, ES module format)
- Client: `src/lib/dentsoft.ts`
- Status: IP whitelist bekleniyor (Dentsoft sabit IP zorunlu kılıyor)
- Nişantaşı kliniği için yapılacak, Adana ayrı verilecek

## Teknik Notlar
- `package.json` → `"type": "module"` — API fonksiyonları `export default` kullanmalı
- Vercel serverless function'larda `import` yerine global `fetch` kullan
- `content-lazy` CSS sınıfı below-the-fold bölümler için (services bölümünden kaldırıldı — LCP'yi geciktiriyordu)
- Mobilde blur efektleri `hidden md:block` ile gizleniyor (GPU performansı)
