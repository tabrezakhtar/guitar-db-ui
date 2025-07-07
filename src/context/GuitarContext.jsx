import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getCombinedUrl } from "../utils/cloudinaryUtils";
import { cloudinaryUpload } from "../utils/cloudinaryUtils";
import { validateToken } from "../utils/tokenUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const initialState = {
  equipment: [],
  filesToUpload: [],
  currentEquipment: null,
  settings: {},
  loading: true,
  page: 1,
  totalEquipment: 0,
  error: null,
  tags: [],
  filteredTags: [],
  tagSearchTerm: "",
  selectedTags: [],
  sortBy: "date",
  sortOrder: "desc",
  searchTerm: "",
  equipmentType: "",
};

const GuitarContext = createContext(null);

function GuitarProvider({ children }) {
  const [state, setState] = useState(initialState);

  const handleAuthError = (errorMsg) => {
    setState(prev => ({
      ...prev,
      error: "Authentication error: " + errorMsg
    }));
  };

  const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));

  const setCurrentEquipment = (equipment) => setState((prev) => ({ ...prev, currentEquipment: equipment }));

  const clearCurrentEquipment = () => setState((prev) => ({ ...prev, currentEquipment: null }));

  const setFilesToUpload = (files) => {
    setState((prev) => ({
      ...prev,
      filesToUpload: typeof files === "function" ? files(prev.filesToUpload) : files
    }));
  };

  const clearFilesToUpload = () => setState((prev) => ({ ...prev, filesToUpload: null }));

  const handleTagSelection = (tag) => {
    setState(prev => {
      const isSelected = prev.selectedTags.some(t => t._id === tag._id);
      if (isSelected) {
        return {
          ...prev,
          selectedTags: prev.selectedTags.filter(t => t._id !== tag._id)
        };
      } else {
        return {
          ...prev,
          selectedTags: [...prev.selectedTags, tag]
        };
      }
    });
  };

  const clearSelectedTags = () => {
    setState(prev => ({
      ...prev,
      selectedTags: []
    }));
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/equipment/settings`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.errors
        }));
        return {
          success: false,
          error: data.errors
        };
      }

      setState((prev) => ({
        ...prev,
        settings: data.settings || {},
        error: null
      }));
      return data;
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    }
  };

  const fetchTags = async () => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const response = await fetch(`${BASE_URL}/api/equipment/tags`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        setState(prev => ({
          ...prev,
          error: data.errors
        }));
        return {
          success: false,
          error: data.errors
        };
      }

      const tagsData = data.tags || [];
      setState((prev) => ({
        ...prev,
        tags: tagsData,
        filteredTags: tagsData,
        error: null
      }));
      return data;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    }
  };

  const searchTags = (searchTerm) => {
    setState(prev => {
      const filtered = searchTerm.trim() === ""
        ? prev.tags
        : prev.tags.filter(tag =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return {
        ...prev,
        filteredTags: filtered,
        tagSearchTerm: searchTerm
      };
    });
  };

  const addComment = async (username, equipmentId, text) => {
    if (!equipmentId || !text) {
      console.error("Missing equipmentId or text for comment");
      return null;
    }

    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setState(prev => ({
        ...prev,
        error: "Your session has expired. Please login again."
      }));
      return null;
    }

    const payload = {
      equipmentId,
      text: text.trim()
    };

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/equipment/addComment`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.errors) {
        setState(prev => ({
          ...prev,
          error: result.errors
        }));
        return {
          success: false,
          error: result.errors
        };
      }

      setState((prev) => {
        if (prev.currentEquipment && prev.currentEquipment._id === equipmentId) {
          const updatedComments = prev.currentEquipment.comments
            ? [result, ...prev.currentEquipment.comments]
            : [result];

          return {
            ...prev,
            currentEquipment: {
              ...prev.currentEquipment,
              comments: updatedComments
            },
            error: null
          };
        }
        return prev;
      });

      return result;
    } catch (error) {
      console.error("Failed to add comment:", error);
      setState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    }
  };

  const toggleLike = async (equipmentId) => {
    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setState(prev => ({
        ...prev,
        error: "Your session has expired. Please login again."
      }));
      return null;
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      const token = localStorage.getItem("token");
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/equipment/toggleLike/${equipmentId}`, {
        method: "POST",
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.errors) {
        setState(prev => ({
          ...prev,
          error: result.errors
        }));
        return {
          success: false,
          error: result.errors
        };
      }

      setState(prev => {
        const updatedEquipment = prev.equipment.map(item => {
          if (item._id === equipmentId) {
            return { ...item, likesCount: result.likes };
          }
          return item;
        });

        const updatedCurrentEquipment = prev.currentEquipment && prev.currentEquipment._id === equipmentId
          ? { ...prev.currentEquipment, likesCount: result.likes }
          : prev.currentEquipment;

        return {
          ...prev,
          equipment: updatedEquipment,
          currentEquipment: updatedCurrentEquipment
        };
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    }
  };

  const setSortOptions = (sortBy, sortOrder) => {
    setState(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  };

  const setEquipmentType = (equipmentType) => {
    setState(prev => ({
      ...prev,
      equipmentType
    }));
  };

  const fetchUserEquipment = async (userId) => {
    if (!userId) return null;

    setState(prev => ({ ...prev, error: null }));

    try {
      const response = await fetch(`${BASE_URL}/api/equipment/user/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        setState(prev => ({
          ...prev,
          error: data.errors
        }));
        return {
          success: false,
          error: data.errors
        };
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch user equipment:", error);
      setState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const value = {
    ...state,
    setLoading,
    setCurrentEquipment,
    clearCurrentEquipment,
    setFilesToUpload,
    clearFilesToUpload,
    fetchSettings,
    fetchTags,
    searchTags,
    fetchUserEquipment,
    addComment,
    handleTagSelection,
    clearSelectedTags,
    setSortOptions,
    validateToken: (callback) => validateToken(callback || handleAuthError),
    toggleLike,
    setEquipmentType
  };

  return <GuitarContext.Provider value={value}>{children}</GuitarContext.Provider>;
}

GuitarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { GuitarContext, GuitarProvider };