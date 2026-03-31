import { Link } from "react-router";
import { Clock } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BlogPostData {
  slug: string;
  title: string;
  image: string;
  category: string;
  categoryColor: string;
  readTime: string;
}

export function RelatedCard({ post }: { post: BlogPostData }) {
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
