import { useState } from "react";

export default function Share({ userId, username, className = "bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors cursor-pointer" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const url = `${window.location.origin}/profile/${userId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      aria-label={copied ? "Profile URL copied" : `Copy ${username || "profile"} URL to clipboard`}
    >
      {copied ? "✅ Copied" : "🔗 Share Profile"}
    </button>
  );
}
