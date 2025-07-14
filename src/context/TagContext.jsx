import { createContext, useContext, useState, useEffect, useCallback } from "react";

const TagContext = createContext();

export const useTagContext = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
};

export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  const fetchTags = async () => {
    if (tags.length > 0 || loading) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/equipment/tags`);
      if (response.ok) {
        const data = await response.json();
        const tagsData = data.tags || [];
        setTags(tagsData);
      } else {
        throw new Error("Failed to fetch tags");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  });

  const setSelectedTagsByIds = useCallback((tagIds) => {
    const selectedTags = tags.filter(tag => tagIds.includes(tag.id));
    return selectedTags;
  }, [tags]);

  const setSelectedTagsByNames = useCallback((tagNames) => {
    const selectedTags = tags.filter(tag => tagNames.includes(tag.name));
    return selectedTags;
  }, [tags]);

  const searchTags = useCallback((searchTerm) => {
    setTagSearchTerm(searchTerm);
    if (!searchTerm) {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter((tag) => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [tags]);

  useEffect(() => {
    setFilteredTags(tags);
  }, [tags]);

  const value = {
    tags,
    loading,
    error,
    fetchTags,
    setTags,
    setSelectedTagsByIds,
    setSelectedTagsByNames,
    tagSearchTerm,
    filteredTags,
    searchTags
  };

  return (
    <TagContext.Provider value={value}>
      {children}
    </TagContext.Provider>
  );
};