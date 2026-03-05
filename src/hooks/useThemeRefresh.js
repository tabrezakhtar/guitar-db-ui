import { useEffect } from "react";

const useThemeRefresh = () => {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => window.location.reload();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
};

export default useThemeRefresh;
