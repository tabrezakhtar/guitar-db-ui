import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { produce } from "immer";

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
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  const fetchTags = async (force = false) => {
    if ((tags.length > 0 || loading) && !force) {
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

  const refetchTags = useCallback(() => {
    fetchTags(true);
  }, []);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagSelection = (tag) => {
    setSelectedTags(produce(draft => {
      const isSelected = draft.some(t => t._id === tag._id);
      if (isSelected) {
        const index = draft.findIndex(t => t._id === tag._id);
        draft.splice(index, 1);
      } else {
        draft.push(tag);
      }
    }));
  };

  const clearSelectedTags = () => {
    setSelectedTags([]);
  };

  const setSelectedTagsByIds = useCallback((tagIds, allTags = tags) => {
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      clearSelectedTags();
      return;
    }
    
    const selectedTagsData = allTags.filter(tag => tagIds.includes(tag._id));
    setSelectedTags(selectedTagsData);
  }, [tags]);

  const setSelectedTagsByNames = useCallback((tagNames, allTags = tags) => {
    if (!Array.isArray(tagNames) || tagNames.length === 0) {
      clearSelectedTags();
      return;
    }
    
    const selectedTagsData = allTags.filter(tag => tagNames.includes(tag.name));
    setSelectedTags(selectedTagsData);
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
    selectedTags,
    loading,
    error,
    fetchTags,
    refetchTags,
    setTags,
    handleTagSelection,
    clearSelectedTags,
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