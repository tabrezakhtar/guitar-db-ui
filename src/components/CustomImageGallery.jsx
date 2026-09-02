import { useState, useRef, useEffect } from "react";
import { useDraggable } from "react-use-draggable-scroll";

const CustomImageGallery = ({ items, additionalClass = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const thumbnailsRef = useRef(null);
  const { events: thumbnailDragEvents } = useDraggable(thumbnailsRef);

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
      const container = thumbnailsRef.current;
      const thumbnail = container.children[index];
      if (thumbnail) {
        const targetLeft =
          thumbnail.offsetLeft -
          container.clientWidth / 2 +
          thumbnail.clientWidth / 2;
        container.scrollTo({ left: targetLeft, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    scrollToThumbnail(currentIndex);
  }, [currentIndex]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    setTouchEnd(currentX);
    
    if (touchStart !== null && touchStartY !== null) {
      const deltaX = Math.abs(touchStart - currentX);
      const deltaY = Math.abs(touchStartY - currentY);
      
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    }
  };

  const onTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && items.length > 1) {
      goToNext();
    }
    if (isRightSwipe && items.length > 1) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartY(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDoubleClick = () => {
    setIsFullscreen(true);
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
      className={`custom-image-gallery ${additionalClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg content-center`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image gallery - Use arrow keys to navigate"
    >
      <style>
        {`
          .thumbnail-scroll-container {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .thumbnail-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* Main Image Display */}
      <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${additionalClass.includes('h-full') ? 'h-4/5' : 'h-64 sm:h-80 md:h-96'}`}>
        <div 
          className="flex transition-transform duration-300 ease-in-out h-full touch-pan-y"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              {item.renderItem ? (
                <div className="w-full h-full flex items-center justify-center">
                  {item.renderItem()}
                </div>
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
              className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white hover:text-gray-300 p-2 sm:p-4 transition-all z-10 cursor-pointer"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
              aria-label="Previous image"
            >
              <svg className="image-gallery-svg w-8 h-8 sm:w-12 sm:h-12" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white hover:text-gray-300 p-2 sm:p-4 transition-all z-10 cursor-pointer"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))' }}
              aria-label="Next image"
            >
              <svg className="image-gallery-svg w-8 h-8 sm:w-12 sm:h-12" xmlns="http://www.w3.org/2000/svg" viewBox="6 0 12 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
      <div
        ref={thumbnailsRef}
        {...thumbnailDragEvents}
        className={`thumbnail-scroll-container flex flex-nowrap gap-2 overflow-x-auto cursor-grab select-none ${
          items.length > 1 ? "mt-3 sm:mt-4 pb-2" : "h-0 overflow-hidden"
        }`}
      >
        {items.length > 1 &&
          items.map((item, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onDragStart={(e) => e.preventDefault()}
              className={`flex-shrink-0 border-2 rounded transition-all ${
                index === currentIndex
                  ? "border-blue-500 opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={item.thumbnail || item.original}
                alt={`Thumbnail ${index + 1}`}
                draggable={false}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded"
              />
            </button>
          ))}
      </div>

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
              className="flex transition-transform duration-300 ease-in-out h-full w-full touch-pan-y"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
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
