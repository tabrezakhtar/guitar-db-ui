// useDataApi.js
import { useContext, useEffect, useState } from "react";
import { GuitarContext } from "../context/GuitarContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useDataApi = () => {
  const { 
    setLoading,
    fetchEquipmentList,
    sortBy,
    sortOrder,
    selectedTags,
    equipmentType,
    equipment,
    totalEquipment,
    error
  } = useContext(GuitarContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchError, setSearchError] = useState(null);

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
    setLoading(true);
    setSearchError(null);

    try {
      const url = `${BASE_URL}/api/equipment/searchByText?q=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        throw new Error(data.errors.join(", "));
      }

      setSearchResults(data.items || []);
      setSearchTotal(data.total || 0);
      setLoading(false);

      return data;
    } catch (error) {
      console.error("Failed to search equipment:", error);
      setSearchError(error.message);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) return;
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
    equipment: currentEquipment,
    totalEquipment: currentTotal,
    error: currentError
  };
};
