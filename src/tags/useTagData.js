import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useTagData = () => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTags = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/equipment/tags`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        throw new Error(data.errors.join(", "));
      }

      const tagsData = data.tags || [];
      setTags(tagsData);
      setFilteredTags(tagsData);
      setError(null);
      setLoading(false);
      
      return data;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const searchTags = (searchTerm) => {
    const filtered = searchTerm.trim() === ""
      ? tags
      : tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredTags(filtered);
    setTagSearchTerm(searchTerm);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    filteredTags,
    tagSearchTerm,
    loading,
    error,
    fetchTags,
    searchTags
  };
};
