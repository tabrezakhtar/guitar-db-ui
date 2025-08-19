import { useState, useEffect } from "react";

export const useImageLoading = (equipment) => {
  const [loadingImages, setLoadingImages] = useState(new Set());

  useEffect(() => {
    const newLoadingImages = new Set();
    let isMounted = true;

    // Set all images as loading initially
    equipment.forEach((item) => {
      const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
      if (imageUrl) {
        newLoadingImages.add(item._id);
      }
    });
    
    setLoadingImages(newLoadingImages);

    const promises = equipment.map((item) => {
      const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
      if (!imageUrl) return Promise.resolve();
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = function () {
          if (isMounted) {
            setLoadingImages(prev => {
              const updated = new Set(prev);
              updated.delete(item._id);
              return updated;
            });
          }
          resolve();
        };
        img.onerror = function () {
          if (isMounted) {
            setLoadingImages(prev => {
              const updated = new Set(prev);
              updated.delete(item._id);
              return updated;
            });
          }
          resolve();
        };
        img.src = imageUrl;
      });
    });
    
    Promise.all(promises);
    
    return () => { isMounted = false; };
  }, [equipment]);

  return { loadingImages };
};
