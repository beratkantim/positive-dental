import { useParams, Link, Navigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Clock, Calendar, User, Share2, BookOpen,
  ArrowRight, Tag, Sparkles, CheckCircle2, Facebook,
  Twitter, Link2, ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { BlogPostSEO } from "../components/SEO";
import { supabase } from "@/lib/supabase";
import type { BlogPost as BlogPostDB } from "@/lib/supabase";
import { sanitizeHTML } from "@/lib/sanitize";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

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

function mapPost(p: BlogPostDB): BlogPost {
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

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 text-sm font-medium">Paylaş:</span>
      <button
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
        className="w-9 h-9 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, "_blank")}
        className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
      >
        <Link2 className="w-3.5 h-3.5" />
        {copied ? "Kopyalandı!" : "Linki kopyala"}
      </button>
    </div>
  );
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          width={80}
          height={80}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${post.categoryColor} inline-block mb-1`}>
          {post.category}
        </span>
        <h4 className="font-black text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
          {post.title}
        </h4>
        <span className="flex items-center gap-1 text-xs text-slate-400 mt-1">
          <Clock className="w-3 h-3" />{post.readTime}
        </span>
      </div>
    </Link>
  );
}

// SSR data'yı oku
function getBlogSSR(): { post: BlogPostDB | null; posts: BlogPostDB[] } | null {
  try {
    const ssr = (window as any).__SSR_DATA__;
    if (ssr?.data?.blog_post) {
      const result = { post: ssr.data.blog_post, posts: ssr.data.blog_posts || [] };
      // Kullandıktan sonra temizle
      delete ssr.data.blog_post;
      delete ssr.data.blog_posts;
      return result;
    }
  } catch {}
  return null;
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const ssrData = getBlogSSR();

  const [post, setPost] = useState<BlogPost | null>(() =>
    ssrData?.post ? mapPost(ssrData.post) : null
  );
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() =>
    ssrData?.posts?.length ? ssrData.posts.map(mapPost) : []
  );
  const [loading, setLoading] = useState(() => !ssrData?.post);

  useEffect(() => {
    // SSR verisi zaten varsa fetch etme
    if (post && allPosts.length > 0) return;

    async function load() {
      const [single, all] = await Promise.all([
        supabase.from("blog_posts").select("*").eq("slug", slug ?? "").single(),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      ]);
      if (single.data) setPost(mapPost(single.data));
      if (all.data) setAllPosts(all.data.map(mapPost));
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B5FBF]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  const related = allPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <>
      <BlogPostSEO
        title={post.title}
        description={post.metaDescription}
        image={post.image}
        slug={post.slug}
        author={post.author}
        publishedAt={post.date}
        keywords={post.keywords}
        category={post.category}
      />

      <div className="bg-white">

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative bg-[#0B5FBF] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="absolute top-0 left-0 w-[600px] h-[400px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link to="/" className="text-white/40 hover:text-white/70 transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <Link to="/blog" className="text-white/40 hover:text-white/70 transition-colors">Blog</Link>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <span className="text-white/70 truncate max-w-[200px]">{post.category}</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Category */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${post.categoryColor}`}>
                <Tag className="w-3 h-3" />{post.category}
              </span>

              {/* Title */}
              <h1 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{post.author}</p>
                    <p className="text-white/40 text-xs">{post.authorTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/40 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="relative rounded-t-3xl overflow-hidden aspect-[21/9]">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                width={1200}
                height={514}
                fetchPriority="high"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B5FBF]/40 to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* ══ MAIN CONTENT ══════════════════════════════════════════ */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_340px] gap-12">

              {/* Article */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              >
                {/* Excerpt */}
                <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-2xl px-6 py-5 mb-10">
                  <p className="text-indigo-800 text-base leading-relaxed font-medium">{post.excerpt}</p>
                </div>

                {/* Content */}
                <div
                  className="prose-article"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
                  style={{
                    lineHeight: "1.85",
                    color: "#334155",
                  }}
                />

                {/* Keywords */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-500 text-sm font-medium">Etiketler:</span>
                    {post.keywords.map((kw) => (
                      <span key={kw} className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full font-medium hover:bg-indigo-50 hover:text-indigo-700 cursor-default transition-colors">
                        #{kw.replace(/\s+/g, "")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <ShareButton />
                </div>

                {/* Author card */}
                <div className="mt-10 p-6 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-3xl border border-indigo-100 flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg">{post.author}</p>
                    <p className="text-indigo-600 font-semibold text-sm mb-2">{post.authorTitle}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Positive Dental Studio uzman kadrosunun değerli bir üyesi. Alanında uluslararası sertifikalara sahip, hasta odaklı yaklaşımıyla tanınan deneyimli bir diş hekimi.
                    </p>
                  </div>
                </div>

                {/* Prev / Next */}
                <div className="mt-12 grid sm:grid-cols-2 gap-4">
                  {prevPost ? (
                    <Link to={`/blog/${prevPost.slug}`} className="group flex items-center gap-3 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                      <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 flex-shrink-0 transition-colors" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 mb-1">Önceki Makale</p>
                        <p className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-700 transition-colors">{prevPost.title}</p>
                      </div>
                    </Link>
                  ) : <div />}
                  {nextPost ? (
                    <Link to={`/blog/${nextPost.slug}`} className="group flex items-center gap-3 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-right">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 mb-1">Sonraki Makale</p>
                        <p className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-700 transition-colors">{nextPost.title}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 flex-shrink-0 transition-colors" />
                    </Link>
                  ) : <div />}
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="space-y-6"
              >

                {/* CTA Card */}
                <div className="bg-gradient-to-br from-[#0B5FBF] to-indigo-950 rounded-3xl p-6 text-white sticky top-24">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-violet-300" />
                  </div>
                  <h3 className="font-display font-black text-xl mb-2">Ücretsiz Muayene</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">
                    Bu makaleyle ilgili sorularınızı uzman hekimimize sorun. İlk muayene tamamen ücretsiz.
                  </p>
                  <div className="space-y-2.5">
                    {[
                      "Kişisel tedavi planı",
                      "3D dijital analiz",
                      "Fiyat şeffaflığı",
                      "Kolay randevu",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-sm shadow-xl shadow-indigo-900/40 hover:scale-[1.02] transition-all"
                  >
                    <Calendar className="w-4 h-4" /> Randevu Al
                  </a>
                  <a
                    href="tel:+908501234567"
                    className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/8 border border-white/10 hover:bg-white/12 text-white/80 font-bold text-sm transition-all"
                  >
                    📞 0850 123 45 67
                  </a>
                </div>

                {/* Related */}
                {related.length > 0 && (
                  <div className="bg-slate-50 rounded-3xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <h3 className="font-black text-slate-900 text-base">İlgili Makaleler</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {related.map((rp) => (
                        <RelatedCard key={rp.slug} post={rp} />
                      ))}
                    </div>
                    <Link
                      to="/blog"
                      className="mt-4 flex items-center justify-center gap-1.5 text-indigo-600 text-sm font-bold hover:gap-2 transition-all"
                    >
                      Tüm makalelere git <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Quick facts */}
                <div className="rounded-3xl border border-slate-100 p-5 bg-white">
                  <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-violet-500" /> Kategori
                  </h3>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${post.categoryColor}`}>
                    {post.category}
                  </span>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* ══ MORE ARTICLES ════════════════════════════════════════ */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-black text-slate-900 text-2xl">Daha Fazla Oku</h2>
              <Link to="/blog" className="flex items-center gap-1.5 text-indigo-600 text-sm font-bold hover:gap-2 transition-all">
                Tüm Makaleler <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {allPosts
                .filter((p) => p.slug !== post.slug)
                .slice(0, 3)
                .map((p, i) => (
                  <motion.article
                    key={p.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-transparent transition-all"
                  >
                    <Link to={`/blog/${p.slug}`} className="block relative overflow-hidden aspect-video">
                      <ImageWithFallback
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={640}
                        height={360}
                      />
                      <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${p.categoryColor}`}>
                        {p.category}
                      </span>
                    </Link>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Clock className="w-3.5 h-3.5" />{p.readTime}
                      </div>
                      <Link to={`/blog/${p.slug}`}>
                        <h3 className="font-black text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{p.title}</h3>
                      </Link>
                    </div>
                  </motion.article>
                ))}
            </div>
          </div>
        </section>

      </div>

      {/* Article content styles */}
      <style>{`
        .prose-article h2 {
          font-family: var(--font-syne, 'Syne', sans-serif);
          font-weight: 900;
          font-size: 1.5rem;
          color: #0f172a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.25;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e0e7ff;
        }
        .prose-article h3 {
          font-weight: 800;
          font-size: 1.15rem;
          color: #1e293b;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .prose-article p {
          margin-bottom: 1.2rem;
          color: #475569;
        }
        .prose-article ul {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .prose-article ul li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #475569;
          font-size: 0.95rem;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border-radius: 0.75rem;
        }
        .prose-article ul li::before {
          content: "→";
          color: #6366f1;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 0.05rem;
        }
        .prose-article table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0 2rem;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .prose-article th {
          background: #4f46e5;
          color: white;
          font-weight: 800;
          padding: 0.875rem 1.25rem;
          text-align: left;
          font-size: 0.875rem;
        }
        .prose-article td {
          padding: 0.75rem 1.25rem;
          font-size: 0.875rem;
          color: #475569;
          border-bottom: 1px solid #f1f5f9;
        }
        .prose-article tr:last-child td {
          border-bottom: none;
        }
        .prose-article tr:nth-child(even) td {
          background: #f8fafc;
        }
        .prose-article strong {
          font-weight: 700;
          color: #1e293b;
        }
        .booking-cta {
          margin: 2.5rem 0 0.5rem;
        }
        .booking-cta-inner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: linear-gradient(135deg, #0B5FBF 0%, #1e1b4b 100%);
          border-radius: 1.5rem;
          padding: 1.5rem 1.75rem;
          flex-wrap: wrap;
        }
        .booking-cta-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }
        .booking-cta-text {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .booking-cta-text strong {
          color: #fff !important;
          font-size: 1rem;
          font-weight: 800;
        }
        .booking-cta-text span {
          color: rgba(255,255,255,0.55);
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .booking-cta-btn {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff;
          font-weight: 800;
          font-size: 0.9rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.875rem;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
          transition: opacity 0.2s;
        }
        .booking-cta-btn:hover {
          opacity: 0.88;
        }
      `}</style>
    </>
  );
}