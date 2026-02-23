import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import postsManifest from "../../public/posts/posts-manifest.json";
import { formatDate } from "../utils/dateUtils";

function ArticlesSection({ isVisible }) {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.8 }}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[var(--color-text-header)] flex items-center justify-center">
          Articles
        </h3>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
          {postsManifest.map(post => (
            <Link
              key={post.slug}
              to={`/posts/${post.slug}`}
              className="bg-[var(--color-card-dark)] rounded-lg overflow-hidden hover:bg-[var(--color-card-dark-hover)] transition-colors group flex-1 min-w-xs max-w-sm flex flex-col"
            >
              {post.thumbnail && (
                <img 
                  src={post.thumbnail} 
                  alt={post.title} 
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-lg font-semibold text-[var(--color-text-header)] mb-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h4>
                <p className="text-[var(--color-text-muted)] text-xs mb-3">
                  {formatDate(post.date)}
                </p>
                <p className="text-[var(--color-text-muted)] text-sm flex-1">
                  {post.description}
                </p>
                <div className="mt-4 text-blue-400 text-sm font-medium">
                  Read article →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ArticlesSection;