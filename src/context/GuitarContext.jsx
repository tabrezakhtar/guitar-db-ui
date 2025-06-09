import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { resizeImage, getCombinedUrl } from "../utils/imageUtils";
import { cloudinaryUpload } from "../utils/cloudinaryUtils";

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

function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

function GuitarProvider({ children }) {
  const [state, setState] = useState(initialState);

  const validateToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const decodedToken = decodeJWT(token);
      if (!decodedToken) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        return true;
      } else {
        return await refreshToken();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: "Authentication error: " + (error.message || "Failed to validate token")
      }));
      return false;
    }
  };

  const refreshToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`${BASE_URL}/api/auth/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: data.message || "Session expired"
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: "Authentication failed"
      }));
      return false;
    }
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

  const fetchEquipment = async (id, type="") => {
    if (!id) return;
    setLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      const response = await fetch(`${BASE_URL}/api/equipment/byid?id=${id}&type=${type}`);

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
        currentEquipment: data.item,
        settings: data.settings,
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    }
  };

  const addComment = async (username, equipmentId, text) => {
    if (!equipmentId || !text) {
      console.error("Missing equipmentId or text for comment");
      return null;
    }

    const isValid = await validateToken();
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

  const addEquipment = async (type) => {
    const isValid = await validateToken();
    if (!isValid) {
      setState(prev => ({
        ...prev,
        error: "Your session has expired. Please login again.",
        loading: false
      }));
      return null;
    }

    return new Promise((resolve, reject) => {
      setState(prev => {
        const currentEquipment = prev.currentEquipment;

        if (!type || !currentEquipment) {
          resolve(null);
          return prev;
        }

        (async () => {
          try {
            setState(innerPrev => ({
              ...innerPrev,
              error: null
            }));

            const token = localStorage.getItem("token");
            const headers = {
              "Content-Type": "application/json"
            };

            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${BASE_URL}/api/equipment/add?type=${type}`, {
              method: "POST",
              headers,
              body: JSON.stringify(currentEquipment),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result && result.errors) {
              setState(innerPrev => ({
                ...innerPrev,
                loading: false,
                error: result.errors
              }));
              resolve({
                success: false,
                error: result.errors
              });
              return;
            }

            setState(innerPrev => ({
              ...innerPrev,
              currentEquipment: result,
              loading: false,
              error: null
            }));

            resolve(result);
          } catch (error) {
            console.error("Failed to add equipment:", error);
            setState(innerPrev => ({
              ...innerPrev,
              loading: false,
              error: error.message
            }));
            reject(error);
          }
        })();

        return prev;
      });
    });
  };

  const updateEquipment = async () => {
    const isValid = await validateToken();
    if (!isValid) {
      setState(prev => ({
        ...prev,
        error: "Your session has expired. Please login again.",
        loading: false
      }));
      return null;
    }

    return new Promise((resolve, reject) => {
      setState((prev) => {
        const currentEquipment = prev.currentEquipment;

        if (!currentEquipment?._id) {
          resolve(null);
          return prev;
        }

        (async () => {
          try {
            setState(innerPrev => ({
              ...innerPrev,
              error: null
            }));

            const token = localStorage.getItem("token");
            const headers = {
              "Content-Type": "application/json"
            };

            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${BASE_URL}/api/equipment/update/${currentEquipment._id}`, {
              method: "PUT",
              headers,
              body: JSON.stringify(currentEquipment),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result && result.errors) {
              setState(innerPrev => ({
                ...innerPrev,
                loading: false,
                error: result.errors
              }));
              resolve({
                success: false,
                error: result.errors
              });
              return;
            }

            setState((innerPrev) => {
              const updatedFilesToUpload = innerPrev.filesToUpload?.map((fileObj, index) => {
                if (result.images && result.images[index]) {
                  return { ...fileObj, url: result.images[index] };
                }
                return fileObj;
              }) || [];

              return {
                ...innerPrev,
                currentEquipment: result,
                filesToUpload: updatedFilesToUpload,
                loading: false,
                error: null
              };
            });

            resolve(result);
          } catch (error) {
            console.error("Failed to update equipment:", error);
            setState(innerPrev => ({
              ...innerPrev,
              loading: false,
              error: error.message
            }));
            reject(error);
          }
        })();

        return prev;
      });
    });
  };

  const deleteEquipment = async () => {
    const isValid = await validateToken();
    if (!isValid) {
      setState(prev => ({
        ...prev,
        error: "Your session has expired. Please login again.",
        loading: false
      }));
      return null;
    }

    const currentEquipment = state.currentEquipment;
    if (!currentEquipment?._id) {
      console.error("No equipment selected for deletion");
      return;
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      const token = localStorage.getItem("token");
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/equipment/remove/${currentEquipment._id}`, {
        method: "DELETE",
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

      clearCurrentEquipment();
      return result;
    } catch (error) {
      console.error("Failed to delete equipment:", error);
      setState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    }
  };

  const fetchEquipmentList = async (page) => {
    setLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      let url = `${BASE_URL}/api/equipment/list?page=${page}&limit=20&type=${state.equipmentType}&sortBy=${state.sortBy}&sortOrder=${state.sortOrder}`;

      if (state.selectedTags.length > 0) {
        const tagsParam = JSON.stringify(state.selectedTags.map(tag => tag._id));
        url += `&tags=${encodeURIComponent(tagsParam)}`;
      }

      const response = await fetch(url);

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
        equipment: page === 1 ? data.items : [...prev.equipment, ...data.items],
        totalEquipment: page === 1 ? data.total : prev.totalEquipment,
        page,
        settings: data.settings,
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      console.error("Failed to fetch equipment list:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    }
  };

  const cloudinaryUploadForGuitar = async (file) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const result = await cloudinaryUpload(file, "guitars");

      if (typeof result === "string" && result.includes("res.cloudinary.com")) {
        return true;
      }

      if (!result.success && result.error) {
        setState(prev => ({
          ...prev,
          error: result.error
        }));
        return result;
      }

      setState((prev) => {
        const updatedImages = prev.currentEquipment.images.map((image) =>
          getCombinedUrl(image) === file.url ? result.secure_url : image
        );

        const updatedFilesToUpload = prev.filesToUpload.map((fileObj) =>
          fileObj.url === file.url ? { ...fileObj, url: result.secure_url } : fileObj
        );

        return {
          ...prev,
          currentEquipment: { ...prev.currentEquipment, images: updatedImages },
          filesToUpload: updatedFilesToUpload,
          error: null
        };
      });

      return result.secure_url;
    } catch (error) {
      console.error("Failed to upload to cloudinary:", error);
      setState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    }
  };

  const deleteImage = async (imageUrl) => {
    const isValid = await validateToken();
    if (!isValid) {
      setState(prev => ({
        ...prev,
        error: "Your session has expired. Please login again."
      }));
      return null;
    }

    const currentEquipment = state.currentEquipment;
    if (!currentEquipment) {
      console.error("No equipment selected for deletion");
      return;
    }
    if (!imageUrl) {
      console.error("No image URL provided for deletion");
      return;
    }

    if (imageUrl.startsWith("blob:http")) {
      const updatedImages = currentEquipment.images.filter(
        (image) => getCombinedUrl(image) !== imageUrl
      );
      const updatedFilesToUpload = state.filesToUpload.filter(
        (fileObj) => fileObj.url !== imageUrl
      );
      setState((prev) => ({
        ...prev,
        currentEquipment: { ...prev.currentEquipment, images: updatedImages },
        filesToUpload: updatedFilesToUpload,
        error: null
      }));
      return;
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/equipment/deleteImage/${currentEquipment._id}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ imageUrl }),
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

      const updatedImages = currentEquipment.images.filter(
        (image) => getCombinedUrl(image) !== imageUrl
      );
      const updatedFilesToUpload = state.filesToUpload.filter(
        (fileObj) => fileObj.url !== imageUrl
      );
      setState((prev) => ({
        ...prev,
        currentEquipment: { ...prev.currentEquipment, images: updatedImages },
        filesToUpload: updatedFilesToUpload,
        error: null
      }));

      return result;
    } catch (error) {
      console.error("Failed to delete image:", error);
      setState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    }
  };

  const toggleLike = async (equipmentId) => {
    const isValid = await validateToken();
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

  const loadMore = () => {
    const nextPage = state.page + 1;
    fetchEquipmentList(nextPage);
  };

  const setSortOptions = (sortBy, sortOrder) => {
    setState(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  };

  const setSearchTerm = (searchTerm) => {
    setState(prev => ({
      ...prev,
      searchTerm
    }));
  };

  const setEquipmentType = (equipmentType) => {
    setState(prev => ({
      ...prev,
      equipmentType
    }));
  };

  const searchEquipment = async (searchTerm) => {
    setLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      const url = `${BASE_URL}/api/equipment/searchByText?q=${encodeURIComponent(searchTerm)}&sortBy=${state.sortBy}&sortOrder=${state.sortOrder}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        throw new Error(data.errors.join(", "));
      }

      setState((prev) => ({
        ...prev,
        equipment: data.items || [],
        totalEquipment: data.total || 0,
        page: 1,
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      console.error("Failed to search equipment:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    }
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
    fetchEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    fetchEquipmentList,
    fetchUserEquipment,
    cloudinaryUpload: cloudinaryUploadForGuitar,
    deleteImage,
    loadMore,
    addComment,
    handleTagSelection,
    clearSelectedTags,
    setSortOptions,
    validateToken,
    toggleLike,
    setSearchTerm,
    setEquipmentType,
    searchEquipment
  };

  return <GuitarContext.Provider value={value}>{children}</GuitarContext.Provider>;
}

GuitarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { GuitarContext, GuitarProvider };