import { useState, useEffect, useRef } from "react";

export const useImageLoading = (equipment) => {
  const [loadingImages, setLoadingImages] = useState(new Set());
  const loadedImagesRef = useRef(new Set());

  useEffect(() => {
    const newLoadingImages = new Set();
    let isMounted = true;

    equipment.forEach((item) => {
      const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
      if (imageUrl && !loadedImagesRef.current.has(item._id)) {
        newLoadingImages.add(item._id);
        
        const img = new window.Image();
        img.onload = function () {
          if (isMounted) {
            loadedImagesRef.current.add(item._id);
            setLoadingImages(prev => {
              const updated = new Set(prev);
              updated.delete(item._id);
              return updated;
            });
          }
        };
        img.onerror = function () {
          if (isMounted) {
            loadedImagesRef.current.add(item._id);
            setLoadingImages(prev => {
              const updated = new Set(prev);
              updated.delete(item._id);
              return updated;
            });
          }
        };
        img.src = imageUrl;
      }
    });
    
    setLoadingImages(newLoadingImages);
    
    return () => { isMounted = false; };
  }, [equipment]);

  return { loadingImages };
};
