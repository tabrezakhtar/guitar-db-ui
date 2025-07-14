import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key, defaultValue = "") => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);

  const getArrayParam = useCallback((key, defaultValue = []) => {
    const value = searchParams.get(key);
    return value ? value.split(",").filter(Boolean) : defaultValue;
  }, [searchParams]);

  const updateParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(","));
      } else {
        newParams.set(key, value.toString());
      }
    });

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const clearParams = useCallback((keys) => {
    const newParams = new URLSearchParams(searchParams);
    keys.forEach(key => newParams.delete(key));
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return {
    getParam,
    getArrayParam,
    updateParams,
    clearParams,
    searchParams
  };
};
