import { useState, useRef, useEffect } from "react";

const CustomImageGallery = ({ items, additionalClass = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const thumbnailsRef = useRef(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const scrollToThumbnail = (index) => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[index];
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  };

  useEffect(() => {
    scrollToThumbnail(currentIndex);
  }, [currentIndex]);

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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white hover:text-gray-300 p-4 transition-all z-10"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
              aria-label="Previous image"
            >
              <svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white hover:text-gray-300 p-4 transition-all z-10"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
              aria-label="Next image"
            >
              <svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 left-2 bg-transparent text-white hover:text-gray-300 p-3 transition-all z-10"
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
          aria-label="Fullscreen"
        >
          <svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
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
        <div ref={thumbnailsRef} className="flex gap-2 mt-4 overflow-x-auto pb-2">
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
            <div 
              className="flex transition-transform duration-300 ease-in-out h-full w-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {items.map((item, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                  {item.renderItem ? (
                    <div className="w-full h-full max-w-4xl max-h-full">
                      {item.renderItem()}
                    </div>
                  ) : (
                    <img
                      src={item.original}
                      alt={`Fullscreen image ${index + 1}`}
                      className="w-auto h-full max-w-full object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Fullscreen Navigation */}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent text-white hover:text-gray-300 p-5 transition-all z-10"
                  style={{ filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.8))' }}
                  aria-label="Previous image"
                >
                  <svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" width="56" height="56">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent text-white hover:text-gray-300 p-5 transition-all z-10"
                  style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
                  aria-label="Next image"
                >
                  <svg className="image-gallery-svg" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" width="56" height="56">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-transparent text-white hover:text-gray-300 p-3 transition-all z-10"
              aria-label="Close fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
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
