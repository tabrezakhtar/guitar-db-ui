import { useState } from "react";

const Thumbnail = ({ index, url, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full aspect-square">
      {typeof index === 'number' && !isNaN(index) && 
        <span className="absolute inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium">
          {index + 1}
        </span>
      }
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default Thumbnail;