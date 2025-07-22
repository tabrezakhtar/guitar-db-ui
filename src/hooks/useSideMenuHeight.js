import { useState, useEffect, useRef } from "react";

export const useSideMenuHeight = () => {
  const [sideMenuHeight, setSideMenuHeight] = useState("auto");
  const [tagsListHeight, setTagsListHeight] = useState("auto");
  const sideMenuRef = useRef(null);
  const headerSectionRef = useRef(null);

  useEffect(() => {
    const calculateHeights = () => {
      const isSmallScreen = window.innerWidth < 768;
      
      if (isSmallScreen) {
        setSideMenuHeight(`${window.innerHeight}px`);

        if (headerSectionRef.current) {
          const headerHeight = headerSectionRef.current.offsetHeight;
          const padding = 48;
          const tagsHeaderHeight = 60;
          const remainingHeight = window.innerHeight - headerHeight - padding - tagsHeaderHeight;
          setTagsListHeight(`${Math.max(remainingHeight, 200)}px`);
        }
      } else {
        setSideMenuHeight("auto");
        setTagsListHeight("700px");
      }
    };

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
