import { useState } from "react";

const CustomImageGallery = ({ items, additionalClass = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    } else if (e.key === "Escape") {
      setIsFullscreen(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div 
      className={`custom-image-gallery ${additionalClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image gallery - Use arrow keys to navigate"
    >
      {/* Main Image Display */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96">
        <div 
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              {item.renderItem ? (
                item.renderItem()
              ) : (
                <img
                  src={item.original}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 transition-all z-10"
          aria-label="Fullscreen"
        >
          ⛶
        </button>

        {/* Image Counter */}
        {items.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm z-10">
            {currentIndex + 1} / {items.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 border-2 rounded transition-all ${
                index === currentIndex
                  ? "border-blue-500 opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={item.thumbnail || item.original}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={toggleFullscreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Fullscreen image gallery"
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {currentItem.renderItem ? (
              <div className="w-full h-full max-w-4xl max-h-full">
                {currentItem.renderItem()}
              </div>
            ) : (
              <img
                src={currentItem.original}
                alt={`Fullscreen image ${currentIndex + 1}`}
                className="w-auto h-full max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Fullscreen Navigation */}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all text-xl"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all text-xl"
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 transition-all text-xl"
              aria-label="Close fullscreen"
            >
              ✕
            </button>

            {/* Fullscreen Counter */}
            {items.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
                {currentIndex + 1} / {items.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomImageGallery;
