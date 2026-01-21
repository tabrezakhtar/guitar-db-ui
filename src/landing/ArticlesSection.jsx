import { Link } from "react-router-dom";
import postsManifest from "../../public/posts/posts-manifest.json";
import { formatDate } from "../utils/dateUtils";

function ArticlesSection({ isVisible }) {
  return (
    <div className={`mb-12 fade-in-bounce delay-800 ${isVisible ? 'visible' : ''}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center justify-center">
          Articles
        </h3>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
          {postsManifest.map(post => (
            <Link
              key={post.slug}
              to={`/posts/${post.slug}`}
              className="bg-[#202b3d] rounded-lg overflow-hidden hover:bg-[#2a3a4d] transition-colors group flex-1 min-w-xs max-w-sm flex flex-col"
            >
              {post.thumbnail && (
                <img 
                  src={post.thumbnail} 
                  alt={post.title} 
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-300 text-xs mb-3">
                  {formatDate(post.date)}
                </p>
                <p className="text-gray-400 text-sm flex-1">
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
    </div>
  );
}

export default ArticlesSection;