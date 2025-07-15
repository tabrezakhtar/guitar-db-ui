import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { validateToken } from "../utils/tokenUtils";
import { produce } from "immer";

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
  sortBy: "date",
  sortOrder: "desc",
  searchTerm: "",
  equipmentType: "",
};

const GuitarContext = createContext(null);

function GuitarProvider({ children }) {
  const [state, setState] = useState(initialState);

  const handleAuthError = (errorMsg) => {
    setState(produce(draft => {
      draft.error = "Authentication error: " + errorMsg;
    }));
  };

  const setLoading = (loading) => setState(produce(draft => {
    draft.loading = loading;
  }));

  const setCurrentEquipment = (equipment) => setState(produce(draft => {
    draft.currentEquipment = equipment;
  }));

  const clearCurrentEquipment = () => setState(produce(draft => {
    draft.currentEquipment = null;
  }));

  const setFilesToUpload = (files) => {
    setState(produce(draft => {
      draft.filesToUpload = typeof files === "function" ? files(draft.filesToUpload) : files;
    }));
  };

  const clearFilesToUpload = () => setState(produce(draft => {
    draft.filesToUpload = null;
  }));

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/equipment/settings`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        setState(produce(draft => {
          draft.loading = false;
          draft.error = data.errors;
        }));
        return {
          success: false,
          error: data.errors
        };
      }

      setState(produce(draft => {
        draft.settings = data.settings || {};
        draft.error = null;
      }));
      return data;
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setState(produce(draft => {
        draft.loading = false;
        draft.error = error.message;
      }));
      throw error;
    }
  };

  const addComment = async (username, equipmentId, text) => {
    if (!equipmentId || !text) {
      console.error("Missing equipmentId or text for comment");
      return null;
    }

    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setState(produce(draft => {
        draft.error = "Your session has expired. Please login again.";
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
        setState(produce(draft => {
          draft.error = result.errors;
        }));
        return {
          success: false,
          error: result.errors
        };
      }

      setState(produce(draft => {
        if (draft.currentEquipment && draft.currentEquipment._id === equipmentId) {
          if (draft.currentEquipment.comments) {
            draft.currentEquipment.comments.unshift(result);
          } else {
            draft.currentEquipment.comments = [result];
          }
          draft.error = null;
        }
      }));

      return result;
    } catch (error) {
      console.error("Failed to add comment:", error);
      setState(produce(draft => {
        draft.error = error.message;
      }));
      throw error;
    }
  };

  const toggleLike = async (equipmentId) => {
    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setState(produce(draft => {
        draft.error = "Your session has expired. Please login again.";
      }));
      return null;
    }

    setState(produce(draft => {
      draft.error = null;
    }));

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
        setState(produce(draft => {
          draft.error = result.errors;
        }));
        return {
          success: false,
          error: result.errors
        };
      }

      setState(produce(draft => {
        draft.equipment = draft.equipment.map(item => {
          if (item._id === equipmentId) {
            return { ...item, likesCount: result.likes };
          }
          return item;
        });

        if (draft.currentEquipment && draft.currentEquipment._id === equipmentId) {
          draft.currentEquipment.likesCount = result.likes;
        }
      }));

      return result;
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setState(produce(draft => {
        draft.error = error.message;
      }));
      throw error;
    }
  };

  const setSortOptions = (sortBy, sortOrder) => {
    setState(produce(draft => {
      draft.sortBy = sortBy;
      draft.sortOrder = sortOrder;
    }));
  };

  const setEquipmentType = (equipmentType) => {
    setState(produce(draft => {
      draft.equipmentType = equipmentType;
    }));
  };

  const fetchUserEquipment = async (userId) => {
    if (!userId) return null;

    setState(produce(draft => {
      draft.error = null;
    }));

    try {
      const response = await fetch(`${BASE_URL}/api/equipment/user/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        setState(produce(draft => {
          draft.error = data.errors;
        }));
        return {
          success: false,
          error: data.errors
        };
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch user equipment:", error);
      setState(produce(draft => {
        draft.error = error.message;
      }));
      throw error;
    } finally {
      setState(produce(draft => {
        draft.loading = false;
      }));
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
    fetchUserEquipment,
    addComment,
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