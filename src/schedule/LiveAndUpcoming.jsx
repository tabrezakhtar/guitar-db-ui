import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LiveAndUpcoming = () => {
  const [liveNow, setLiveNow] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveAndUpcoming = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/schedule/live`);
        if (response.ok) {
          const data = await response.json();
          setLiveNow(data.liveNow || []);
          setUpcoming(data.upcoming || []);
        }
      } catch (error) {
        console.error("Error fetching live and upcoming:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveAndUpcoming();
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const getTimeUntil = (isoString) => {
    const now = new Date();
    const start = new Date(isoString);
    const diffMs = start - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `in ${diffMins}m`;
    }
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `in ${diffHours}h ${remainingMins}m`;
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg bg-[var(--color-card-dark)]">
        <h3 className="flex items-center justify-center text-lg font-semibold text-[var(--color-text-header)] mb-4">
          <img src="/icons/youtube_icon.png" alt="YouTube" className="inline w-5 h-5 mr-1" />
          Live Streams
        </h3>
        <div className="text-[var(--color-text-muted)]">Loading...</div>
      </div>
    );
  }

  if (liveNow.length === 0 && upcoming.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-[var(--color-card-dark)]">
        <h3 className="flex items-center justify-center text-lg font-semibold text-[var(--color-text-header)] mb-4">
          <img src="/icons/youtube_icon.png" alt="YouTube" className="inline w-5 h-5 mr-1" />
          Live Streams
        </h3>
        <p className="text-[var(--color-text-muted)]">No streams scheduled at this time</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-[var(--color-card-dark)]">
      <h3 className="flex items-center justify-center text-lg font-semibold text-[var(--color-text-header)] mb-4">
        <img src="/icons/youtube_icon.png" alt="YouTube" className="inline w-5 h-5 mr-1" />
        Live Streams
      </h3>
      
      {liveNow.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Live Now</h4>
          <div className="space-y-2">
            {liveNow.map((stream) => (
              <Link
                key={stream.userId}
                to={`/profile?userId=${stream.userId}`}
                className="flex justify-center gap-3 p-3 bg-[var(--color-main-bg)] rounded hover:opacity-80 transition-opacity"
              >
                {stream.youtubeChannelAvatar && (
                  <img 
                    src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(stream.youtubeChannelAvatar)}`} 
                    alt={stream.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-[var(--color-text-header)]">
                    {stream.username}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    Started at {formatTime(stream.startTime)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">Coming Up</h4>
          <div className="space-y-2">
            {upcoming.map((stream) => (
              <Link
                key={stream.userId}
                to={`/profile?userId=${stream.userId}`}
                className="flex justify-center gap-3 p-3 bg-[var(--color-main-bg)] rounded hover:opacity-80 transition-opacity"
              >
                {stream.youtubeChannelAvatar && (
                  <img 
                    src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(stream.youtubeChannelAvatar)}`}
                    alt={stream.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-[var(--color-text-header)]">
                    {stream.username}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {stream.day} at {stream.time} • {getTimeUntil(stream.startTime)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAndUpcoming;
