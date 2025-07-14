import { useState, useEffect } from "react";
import { useTagContext } from "../context/TagContext";

export const useTagData = () => {
  const { tags, loading, error } = useTagContext();
  const [filteredTags, setFilteredTags] = useState([]);
  const [tagSearchTerm, setTagSearchTerm] = useState("");

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
    setFilteredTags(tags);
  });

  return {
    tags,
    filteredTags,
    tagSearchTerm,
    loading,
    error,
    searchTags
  };
};
