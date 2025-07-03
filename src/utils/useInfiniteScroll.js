import { useEffect, useRef } from "react";

function useInfiniteScroll({ hasMore, loading, onLoadMore, threshold = 300 }) {
  const containerRef = useRef(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!hasMore || loading) return;
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const height = document.documentElement.scrollHeight;
      const client = window.innerHeight;
      if (height - (scrollY + client) < threshold && !loadingRef.current) {
        loadingRef.current = true;
        onLoadMore();
      }
    }
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  useEffect(() => {
    if (!loading) {
      loadingRef.current = false;
    }
  }, [loading]);

  return containerRef;
}

export default useInfiniteScroll;
