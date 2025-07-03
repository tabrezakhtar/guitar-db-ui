import { useState, useEffect } from "react";

function useImageDimensions(url) {
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.onload = function () {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  }, [url]);

  return dimensions;
}

export default useImageDimensions;
