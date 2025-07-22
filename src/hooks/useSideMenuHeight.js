import { useState, useEffect, useRef } from "react";

export const useSideMenuHeight = () => {
  const [sideMenuHeight, setSideMenuHeight] = useState("auto");
  const [tagsListHeight, setTagsListHeight] = useState("auto");
  const sideMenuRef = useRef(null);
  const headerSectionRef = useRef(null);

  useEffect(() => {
    const calculateHeights = () => {
      const isSmallScreen = window.innerWidth < 768; // md breakpoint
      
      if (isSmallScreen) {
        // On small screens, use full viewport height
        setSideMenuHeight(`${window.innerHeight}px`);
        
        // Calculate remaining height for tags list
        if (headerSectionRef.current) {
          const headerHeight = headerSectionRef.current.offsetHeight;
          const padding = 48; // 6 * 8px (p-6)
          const tagsHeaderHeight = 60; // Approximate height of tags header + search
          const remainingHeight = window.innerHeight - headerHeight - padding - tagsHeaderHeight;
          setTagsListHeight(`${Math.max(remainingHeight, 200)}px`);
        }
      } else {
        // On medium+ screens, use auto height
        setSideMenuHeight("auto");
        setTagsListHeight("700px"); // Original max height
      }
    };

    // Calculate on mount and resize
    calculateHeights();
    window.addEventListener("resize", calculateHeights);

    return () => {
      window.removeEventListener("resize", calculateHeights);
    };
  }, []);

  return {
    sideMenuHeight,
    tagsListHeight,
    sideMenuRef,
    headerSectionRef
  };
};
