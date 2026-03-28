import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Search, Clock, ArrowRight, BookOpen, Sparkles, Tag,
  Calendar, User, TrendingUp, Star, BadgeDollarSign,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { useTable } from "../hooks/useSupabase";
import type { BlogPost as BlogPostType } from "@/lib/supabase";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const BLOG_CATEGORIES = [
  "Tümü",
  "Fiyat Rehberi",
  "İmplantoloji",
  "Estetik Diş Hekimliği",
  "Ortodonti",
  "Çocuk Diş Hekimliği",
  "Genel Diş Hekimliği",
  "Periodontoloji",
];

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  author: string;
  authorTitle: string;
  date: string;
  readTime: string;
  image: string;
  keywords: string[];
  metaDescription: string;
  content: string;
  featured?: boolean;
}

function mapBlogPost(p: BlogPostType): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    categoryColor: p.category_color,
    author: p.author,
    authorTitle: p.author_title,
    date: p.published_at ? new Date(p.published_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "",
    readTime: p.read_time,
    image: p.image,
    keywords: p.keywords || [],
    metaDescription: p.meta_description,
    content: p.content,
    featured: p.is_featured,
  };
}

const BOOKING_URL = "https://randevu.positivedental.com";

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.08 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 hover:border-transparent transition-all flex flex-col"
    >
      {/* Image */}
      <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[16/9]">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={640}
          height={360}
          fetchPriority={index < 3 ? "high" : undefined}
          loading={index < 3 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${post.categoryColor}`}>
          {post.category === "Fiyat Rehberi" && <BadgeDollarSign className="w-3 h-3 inline-block mr-1 -mt-0.5" />}
          {post.category}
        </span>
        {post.featured && (
          <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400 text-amber-900 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Öne Çıkan
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-display font-black text-slate-900 text-lg leading-snug mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">{post.excerpt}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 leading-none">{post.author}</p>
              <p className="text-xs text-slate-400 mt-0.5">{post.authorTitle.split("·")[0].trim()}</p>
            </div>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-indigo-600 text-sm font-bold group-hover:gap-2 transition-all"
          >
            Oku <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all"
    >
      <Link to={`/blog/${post.slug}`} className="block relative h-[480px]">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          width={800}
          height={480}
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B5FBF]/90 via-[#0B5FBF]/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-6 left-6 flex gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${post.categoryColor}`}>
            {post.category}
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400 text-amber-900 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Öne Çıkan
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-3 text-white/50 text-xs mb-3">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
          </div>
          <h2 className="font-display font-black text-white text-2xl sm:text-3xl leading-tight mb-3 group-hover:text-indigo-300 transition-colors">
            {post.title}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/70 text-sm font-medium">{post.author}</span>
            </div>
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-xl group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all">
              Okumaya devam et <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: rawPosts, loading } = useTable<BlogPostType>("blog_posts", "created_at", false);

  const BLOG_POSTS = rawPosts.map(mapBlogPost);

  const filtered = BLOG_POSTS.filter((post) => {
    const matchCategory = selectedCategory === "Tümü" || post.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const featuredPosts = BLOG_POSTS.filter((p) => p.featured);
  const regularPosts = filtered.filter((p) => !p.featured || selectedCategory !== "Tümü" || searchQuery);
  const showFeatured = selectedCategory === "Tümü" && !searchQuery;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B5FBF]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Blog — Diş Sağlığı Rehberi"
        description="Implant, estetik diş hekimliği, ortodonti, çocuk diş sağlığı ve daha fazlası hakkında uzman hekimlerimizin hazırladığı kapsamlı makaleler."
        url="/blog"
        keywords={["diş sağlığı blog", "diş hekimliği makaleleri", "implant rehberi", "ortodonti bilgi"]}
        schemaType="dental"
      />

      <div className="bg-white">

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative bg-[#0B5FBF] overflow-hidden min-h-[56vh] flex items-center">
          <div className="absolute top-[-10%] left-[-8%] w-[500px] h-[500px] rounded-full bg-indigo-600/25 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-700/25 blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-sm mb-8">
                <BookOpen className="w-4 h-4 text-violet-300" />
                <span className="text-white/60 text-sm font-medium">Diş Sağlığı Rehberi</span>
                <span className="text-white/30">·</span>
                <span className="text-violet-300 text-sm font-bold">{BLOG_POSTS.length} Makale</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
                Bilgi ile
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  güçlenin.
                </span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
                Uzman hekimlerimizin kaleminden diş sağlığına dair her şey: implant, estetik, ortodonti ve daha fazlası.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Makale ara..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all backdrop-blur-sm"
                />
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        {/* ══ STATS BAR ════════════════════════════════════════════ */}
        <section className="border-b border-slate-100 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-indigo-500" />{BLOG_POSTS.length} makale</span>
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-violet-500" />Haftalık güncelleme</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />Uzman hekimler tarafından yazıldı</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                    }`}
                  >
                    {cat !== "Tümü" && <Tag className="w-3 h-3" />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CONTENT ══════════════════════════════════════════════ */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Featured Posts */}
            {showFeatured && featuredPosts.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-8">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="font-display font-black text-slate-900 text-2xl">Öne Çıkan Makaleler</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <FeaturedCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* All / Filtered Posts */}
            {(showFeatured || !showFeatured) && (
              <div>
                {showFeatured && (
                  <div className="flex items-center gap-2 mb-8">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <h2 className="font-display font-black text-slate-900 text-2xl">Tüm Makaleler</h2>
                    <span className="text-slate-400 text-sm ml-1">({BLOG_POSTS.length - featuredPosts.length} makale)</span>
                  </div>
                )}
                {!showFeatured && (
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-indigo-500" />
                      <h2 className="font-display font-black text-slate-900 text-2xl">{selectedCategory}</h2>
                    </div>
                    <span className="text-slate-500 text-sm">{filtered.length} makale bulundu</span>
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-black text-slate-900 text-xl mb-2">Makale bulunamadı</h3>
                    <p className="text-slate-500">Farklı bir arama terimi veya kategori deneyin.</p>
                    <button
                      onClick={() => { setSearchQuery(""); setSelectedCategory("Tümü"); }}
                      className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                    >
                      Tümünü göster
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(showFeatured ? BLOG_POSTS.filter(p => !p.featured) : filtered).map((post, i) => (
                      <BlogCard key={post.slug} post={post} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ══ NEWSLETTER / CTA ═════════════════════════════════════ */}
        <section className="py-20 bg-[#0B5FBF] relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[100px]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              <span className="text-white/60 text-sm font-medium">Ücretsiz Danışma</span>
            </div>
            <h2 className="font-display font-black text-white text-4xl sm:text-5xl leading-tight mb-4">
              Sorunuz mu var?
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Uzmanlarımıza sorun.
              </span>
            </h2>
            <p className="text-slate-400 mb-8">
              Makaleyi okudunuz, kafanızda sorular oluştu. Kliniğimize gelin veya bizi arayın — ilk değerlendirme ücretsiz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" /> Randevu Al
              </a>
              <a
                href="tel:+908501234567"
                className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/12 text-white font-bold px-8 py-4 rounded-2xl transition-all"
              >
                0850 123 45 67
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}