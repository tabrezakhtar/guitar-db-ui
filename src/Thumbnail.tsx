import React, { useState } from "react";

interface ThumbnailProps {
  url: string;
  alt: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ url, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full content-center">
      {isLoading && (
        <div className="inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={url}
        alt={alt}
        className={`w-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default Thumbnail;