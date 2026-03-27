-- Hasta yorumları seed — Supabase SQL Editor'da çalıştır
DELETE FROM testimonials;

INSERT INTO testimonials (name, role, text, rating, image, branch, is_approved, is_active, sort_order)
VALUES
  ('Selin Y.', 'İmplant Hastası',
   'Hayatımda dişçiye gitmekten bu kadar keyif aldığımı hiç düşünmezdim. Ekip inanılmaz sıcak, ortam çok modern.',
   5, 'https://images.unsplash.com/photo-1679486479476-5ff4ee182334?w=200&q=80',
   'istanbul', true, true, 1),

  ('Kaan M.', 'Ortodonti Hastası',
   'Şeffaf plak ile 8 ayda çarpık dişlerimi düzelttim. Kimse fark etmedi, sonuç muhteşem!',
   5, 'https://images.unsplash.com/photo-1769559893692-c6d0623bf8e4?w=200&q=80',
   'adana', true, true, 2),

  ('Buse T.', 'Gülüş Tasarımı',
   'Gülüş tasarımı sonuçlarım harika — fotoğraflarda bile belli oluyor! Kesinlikle tavsiye ediyorum.',
   5, 'https://images.unsplash.com/photo-1763739906082-a6093d4939f9?w=200&q=80',
   'istanbul', true, true, 3);
