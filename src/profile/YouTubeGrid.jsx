import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { formatDate } from "../utils/dateUtils";

export default function YoutubeGrid({ userId, handle, avatar, channelId, maxResults = 12 }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!userId) return;
      setLoading(true);
      setError("");
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/youtube/videos?userId=${encodeURIComponent(userId)}&maxResults=${maxResults}`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data?.errors || "Failed to load videos");
          setVideos([]);
          return;
        }
        setVideos(data.videos || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load videos");
        setVideos([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (!handle && !channelId) return null;

  return (
    <div className="mb-6 bg-gray-700 p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-3 text-white">Latest YouTube Videos</h3>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={avatar || ""}
          alt={handle ? `@${handle} channel avatar` : "youtube avatar"}
          className="w-12 h-12 rounded-full"
        />
        <a
          className="text-blue-400 hover:underline text-sm"
          href={handle ? `https://www.youtube.com/@${handle.replace(/^@/, "")}` : `https://www.youtube.com/channel/${channelId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {handle ? `@${handle.replace(/^@/, "")}` : channelId}
        </a>
      </div>

      {loading && (
        <div role="status" aria-busy="true" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {Array.from({ length: Math.min(Number(maxResults) || 12, 12) }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded overflow-hidden animate-pulse" aria-hidden="true">
              <div className="w-full bg-gray-600 aspect-video"></div>
              <div className="p-2">
                <div className="h-3 bg-gray-600 rounded mb-2 w-3/4"></div>
                <div className="h-2 bg-gray-600 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {!loading && !error && videos && videos.length > 0 && (
        <div role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {videos.map(video => (
            <button
              role="listitem"
              key={video.videoId}
              type="button"
              aria-label={video.title}
              className="group bg-gray-800 rounded overflow-hidden text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey) {
                  window.open(video.url, "_blank");
                  return;
                }
                setActiveVideo(video);
              }}
            >
              <img src={video.thumbnail} alt={video.title} className="w-full h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 object-cover group-hover:opacity-90" />
              <div className="p-2">
                <div className="text-sm md:text-xs text-white font-semibold leading-tight max-h-10 overflow-hidden">{video.title}</div>
                <div className="text-xs text-gray-400 mt-1">{formatDate(video.publishedAt)}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && (!videos || videos.length === 0) && (
        <p className="text-sm text-gray-400">No recent videos available</p>
      )}

      {activeVideo && (
        <Modal onCancel={() => setActiveVideo(null)} showConfirm={false} allowBackgroundClose={true} cancelText="Close">
          <div className="w-[min(96vw,1000px)] max-w-full">
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${String(activeVideo.videoId)}?rel=0`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="mt-3 text-white font-semibold">{activeVideo.title}</div>
          </div>
        </Modal>
      )}
    </div>
  );
}
