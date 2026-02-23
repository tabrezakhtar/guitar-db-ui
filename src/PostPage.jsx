import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import postsManifest from "../public/posts/posts-manifest.json";
import { formatDate } from "./utils/dateUtils";
import Spinner from "./components/Spinner";

function PostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postData = postsManifest.find(p => p.slug === slug);

    if (!postData) {
      navigate("/");
      return;
    }

    fetch(`/posts/${postData.location}`)
      .then(res => res.text())
      .then(text => {
        const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        let content = text;
        let data = {};

        if (frontmatterMatch) {
          const frontmatterText = frontmatterMatch[1];
          content = frontmatterMatch[2];

          frontmatterText.split("\n").forEach(line => {
            const [key, ...valueParts] = line.split(":");
            if (key && valueParts.length > 0) {
              data[key.trim()] = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
            }
          });
        }

        setPost({ ...data, content, title: postData.title, date: postData.date, thumbnail: postData.thumbnail });
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error loading post:", e);
        navigate("/");
      });
  }, [slug, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen p-8"><Spinner width={12} height={12} /></div>;
  if (!post) return null;

  const currentIndex = postsManifest.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? postsManifest[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < postsManifest.length - 1 ? postsManifest[currentIndex + 1] : null;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
        ‹ Back to Home
      </Link>
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-80 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-2 text-[var(--color-text-header)]">{post.title}</h1>
      <p className="text-[var(--color-text-muted)] mb-8">{formatDate(post.date)}</p>
      <div className="text-[var(--color-text-muted)]">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-4 leading-relaxed whitespace-pre-wrap" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4" {...props} />,
            li: ({node, ...props}) => <li className="mb-2" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4" {...props} />,
            code: ({node, ...props}) => <code className="bg-gray-800 px-2 py-1 rounded text-sm" {...props} />,
            pre: ({node, ...props}) => <pre className="bg-gray-900 p-4 rounded mb-4 overflow-x-auto" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-700">
          {previousPost ? (
            <Link
              to={`/posts/${previousPost.slug}`}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ‹ Previous: {previousPost.title}
            </Link>
          ) : <span />}
          {nextPost && (
            <Link
              to={`/posts/${nextPost.slug}`}
              className="text-blue-400 hover:text-blue-300 text-sm ml-auto text-right"
            >
              Next: {nextPost.title} ›
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
