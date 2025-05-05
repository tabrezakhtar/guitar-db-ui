import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { resizeImage, getCombinedUrl } from "../imageUtils";
import { cloudinaryUpload } from "../cloudinaryUtils";

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
  selectedTags: []
};

export const GuitarContext = createContext(null);

export function GuitarProvider({ children }) {
  const [state, setState] = useState(initialState);

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

  const fetchEquipment = async (id, type) => {
    if (!id || !type) return;
    setLoading(true);
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await fetch(`${BASE_URL}/api/equipmentById?id=${id}&type=${type}`);
      
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
    
    const payload = {
      equipmentId,
      username,
      text: text.trim()
    };
    
    try {
      const response = await fetch(`${BASE_URL}/api/equipment/addComment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    return new Promise((resolve, reject) => {
      setState(prev => {
        const currentEquipment = prev.currentEquipment;
        
        console.log("addEquipment()", currentEquipment);
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
            
            const response = await fetch(`${BASE_URL}/api/equipment/add?type=${type}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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

  const updateEquipment = async (type) => {
    return new Promise((resolve, reject) => {
      setState((prev) => {
        const currentEquipment = prev.currentEquipment;

        if (!type || !currentEquipment?._id) {
          resolve(null);
          return prev;
        }

        (async () => {
          try {
            setState(innerPrev => ({
              ...innerPrev, 
              error: null
            }));
            
            const response = await fetch(`${BASE_URL}/api/equipment/update/${currentEquipment._id}?type=${type}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
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
              const updatedFilesToUpload = innerPrev.filesToUpload.map((fileObj, index) => {
                if (result.images[index]) {
                  return { ...fileObj, url: result.images[index] };
                }
                return fileObj;
              });

              const updatedEquipment = innerPrev.equipment.map(item => 
                item._id === result._id ? result : item
              );

              return {
                ...innerPrev,
                currentEquipment: result,
                equipment: updatedEquipment,
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
    const currentEquipment = state.currentEquipment;
    if (!currentEquipment?._id) {
      console.error("No equipment selected for deletion");
      return;
    }
    
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await fetch(`${BASE_URL}/api/equipment/remove/${currentEquipment._id}`, {
        method: "DELETE"
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

  const fetchEquipmentList = async (page, type) => {
    if (!type) return;
    setLoading(true);
    setState(prev => ({ ...prev, error: null }));
    
    try {
      const response = await fetch(`${BASE_URL}/api/equipmentList?page=${page}&limit=20&type=${type}`);
      
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
      const response = await fetch(`${BASE_URL}/api/equipment/deleteImage/${currentEquipment._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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

  const loadMore = (type) => {
    const nextPage = state.page + 1;
    fetchEquipmentList(nextPage, type);
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
    cloudinaryUpload: cloudinaryUploadForGuitar,
    deleteImage,
    loadMore,
    addComment,
    handleTagSelection,
    clearSelectedTags
  };

  return <GuitarContext.Provider value={value}>{children}</GuitarContext.Provider>;
}

GuitarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useGuitarContext() {
  const value = useContext(GuitarContext);
  if (!value) {
    throw new Error("useGuitarContext must be used within a GuitarProvider");
  }
  return value;
}