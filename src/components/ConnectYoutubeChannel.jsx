import { useState, useEffect } from "react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ConnectYoutubeChannel = ({ initialValue = "", onSuccess, onError }) => {
  const [youtubeInput, setYoutubeInput] = useState(initialValue);
  const [youtubeError, setYoutubeError] = useState("");
  const [loading, setLoading] = useState(false);
  const hasExistingChannel = initialValue && initialValue.trim() !== "";

  useEffect(() => {
    setYoutubeInput(initialValue);
  }, [initialValue]);

  function extractChannelIdOrHandleLocal(input) {
    if (!input) return null;
    const value = String(input).trim();

    const isChannelId = (str) => /^UC[A-Za-z0-9_-]{22}$/.test(str);
    const isHandle = (str) => /^[A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9]$/.test(str) && !/\.{2,}/.test(str);

    if (/^https?:\/\/(www\.)?youtube\.com/.test(value)) {
      const handleMatch = value.match(/youtube\.com\/@([A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9])(?:[/?#]|$)/);
      if (handleMatch) return { type: "handle", value: handleMatch[1] };

      const channelMatch = value.match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})(?:[/?#]|$)/);
      if (channelMatch) return { type: "id", value: channelMatch[1] };

      const customMatch = value.match(/youtube\.com\/c\/([A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9])(?:[/?#]|$)/);
      if (customMatch) return { type: "handle", value: customMatch[1] };

      const userMatch = value.match(/youtube\.com\/user\/([A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9])(?:[/?#]|$)/);
      if (userMatch) return { type: "handle", value: userMatch[1] };

      return null;
    }

    const cleaned = value.replace(/^@/, "");
    if (isChannelId(cleaned)) return { type: "id", value: cleaned };
    if (isHandle(cleaned)) return { type: "handle", value: cleaned };

    return null;
  }

  const handleInputChange = (e) => {
    const value = e.target.value || "";
    setYoutubeInput(value);

    if (value.trim() === "") {
      setYoutubeError("");
      return;
    }

    const parsed = extractChannelIdOrHandleLocal(value);
    if (parsed) {
      setYoutubeError("");
    } else {
      setYoutubeError("Invalid YouTube URL or handle");
    }
  };

  const handleConnect = async () => {
    if (!youtubeInput.trim()) {
      setYoutubeError("Please enter a YouTube URL or handle");
      return;
    }

    const parsed = extractChannelIdOrHandleLocal(youtubeInput);
    if (!parsed) {
      setYoutubeError("Invalid YouTube URL or handle");
      return;
    }

    setLoading(true);
    setYoutubeError("");

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/youtube/channel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ url: youtubeInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors || data.message || "Failed to connect YouTube channel");
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to connect YouTube channel";
      setYoutubeError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={`flex items-center gap-3 px-3 py-2 rounded-md bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] ${youtubeError ? "border border-red-600" : "border border-gray-600"}`}>
        <img src="/icons/youtube_icon.png" alt="YouTube" className="w-6 h-6 flex-shrink-0" />
        <input
          type="text"
          placeholder="Paste in your YouTube URL or @handle"
          value={youtubeInput}
          onChange={handleInputChange}
          disabled={loading}
          aria-invalid={youtubeError ? "true" : "false"}
          className="flex-1 bg-transparent text-[var(--color-text-header)] focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleConnect}
          disabled={loading || !!youtubeError || !youtubeInput.trim()}
          className={`px-4 py-1 ${hasExistingChannel ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white rounded focus:outline-none focus:ring-2 ${hasExistingChannel ? "focus:ring-green-400" : "focus:ring-blue-400"} disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              {hasExistingChannel ? "Updating..." : "Connecting..."}
            </span>
          ) : (
            hasExistingChannel ? "Update" : "Connect"
          )}
        </button>
      </div>
      {youtubeError && (
        <p className="mt-1 text-sm text-red-400">
          {youtubeError}
        </p>
      )}
    </div>
  );
};

export default ConnectYoutubeChannel;
