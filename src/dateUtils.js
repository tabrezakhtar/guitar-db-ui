export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(navigator.language || "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

export const getTimeFromNow = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);
  
  if (diffYears > 0) {
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
  }
  if (diffMonths > 0) {
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  }
  if (diffWeeks > 0) {
    return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
  }
  if (diffDays > 0) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }
  if (diffHours > 0) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }
  if (diffMinutes > 0) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  }
  return "just now";
};