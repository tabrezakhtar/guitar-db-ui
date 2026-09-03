// useDataApi.js
import { useContext, useEffect, useRef, useState } from "react";
import { GuitarContext } from "../context/GuitarContext";
import { useTagContext } from "../context/TagContext";
import { getQueryStringParam } from "../utils/urlUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GRID_STATE_KEY = "equipment-grid-state";

const getSavedGridState = () => {
  try {
    return JSON.parse(sessionStorage.getItem(GRID_STATE_KEY));
  } catch {
    return null;
  }
};

export const useEquipmentGridData = () => {
  const { 
    setLoading,
    sortBy,
    sortOrder,
    equipmentType,
    error,
    setEquipmentType
  } = useContext(GuitarContext);

  const { selectedTags } = useTagContext();
  const savedGridState = useRef(getSavedGridState()).current;
  const shouldRestoreGrid = useRef(Boolean(savedGridState?.equipment?.length));

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchError, setSearchError] = useState(null);
  const [equipment, setEquipment] = useState(savedGridState?.equipment || []);
  const [totalEquipment, setTotalEquipment] = useState(savedGridState?.totalEquipment || 0);
  const [page, setPage] = useState(savedGridState?.page || 1);
  const [loading, setIsLoading] = useState(false);
  const [equipmentError, setEquipmentError] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      setSearchResults([]);
      setSearchTotal(0);
      setSearchError(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSearchTotal(0);
    setSearchError(null);
  };

  const searchEquipment = async (searchTerm) => {
    setIsLoading(true);
    setSearchError(null);

    try {
      const url = `${BASE_URL}/api/equipment/searchByText?q=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        throw new Error(data.errors.join(", "));
      }

      setSearchResults(data.items || []);
      setSearchTotal(data.total || 0);
      setIsLoading(false);

      return data;
    } catch (error) {
      console.error("Failed to search equipment:", error);
      setSearchError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const fetchEquipmentList = async (currentPage) => {
    setIsLoading(true);
    setEquipmentError(null)

    try {
      const urlType = getQueryStringParam("type") || equipmentType;
      let url = `${BASE_URL}/api/equipment/list?page=${currentPage}&limit=20&type=${urlType}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

      if (selectedTags.length > 0) {
        const tagsParam = JSON.stringify(selectedTags.map(tag => tag._id));
        url += `&tags=${encodeURIComponent(tagsParam)}`;
      }

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        throw new Error(data.errors.join(", "));
      }

      setEquipment(prev => currentPage === 1 ? data.items : [...prev, ...data.items]);
      setTotalEquipment(currentPage === 1 ? data.total : totalEquipment);
      setPage(currentPage);
      setIsLoading(false);

      return data;
    } catch (error) {
      console.error("Failed to fetch equipment list:", error);
      setIsLoading(false);
      setEquipmentError(true);
      throw error;
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    return fetchEquipmentList(nextPage);
  };

  const saveGridState = () => {
    sessionStorage.setItem(
      GRID_STATE_KEY,
      JSON.stringify({
        equipment,
        totalEquipment,
        page,
        scrollPosition: window.scrollY,
      }),
    );
  };

  useEffect(() => {
    if (searchTerm.trim()) return;
    if (shouldRestoreGrid.current) {
      shouldRestoreGrid.current = false;
      return;
    }
    setEquipment([]);
    fetchEquipmentList(1);
  }, [sortBy, sortOrder, selectedTags, equipmentType, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    const timeoutId = setTimeout(() => {
      searchEquipment(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const currentEquipment = searchTerm.trim() ? searchResults : equipment;
  const currentTotal = searchTerm.trim() ? searchTotal : totalEquipment;
  const currentError = searchTerm.trim() ? searchError : error;

  return { 
    searchTerm,
    handleSearch,
    clearSearch,
    searchEquipment,
    fetchEquipmentList,
    loadMore,
    equipment: currentEquipment,
    totalEquipment: currentTotal,
    error: currentError,
    loading,
    page,
    equipmentError,
    saveGridState,
    restoredScrollPosition: savedGridState?.scrollPosition || 0
  };
};
