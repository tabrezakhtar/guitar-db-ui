import { useState } from "react";
import { useGuitarStore } from "./store/useGuitarStore";
import { getCombinedUrl } from "./imageUtils";

const Thumbnail = ({ index, url, alt, showDelete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { deleteImage } = useGuitarStore();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      deleteImage(getCombinedUrl(url));
    }
  };

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
      {showDelete && (
        <span
          onClick={handleDelete}
          className="absolute bottom-0 right-0 bg-red-500 text-white hover:bg-red-800 font-bold text-sm cursor-pointer flex items-center justify-center w-5 h-5 rounded-md"
        >
          ✕
        </span>
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