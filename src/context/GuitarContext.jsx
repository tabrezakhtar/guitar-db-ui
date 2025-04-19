import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { resizeImage, getCombinedUrl } from "../imageUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const initialState = {
  guitars: [],
  filesToUpload: [],
  currentGuitar: null,
  settings: {},
  loading: true,
  page: 1,
  totalGuitars: 0
};

const GuitarContext = createContext(null);

const GuitarProvider = ({ children }) => {
  console.log("GuitarProvider called");
  const [state, setState] = useState(initialState);

  const setLoading = (loading) => setState(prev => ({ ...prev, loading }));
  
  const setCurrentGuitar = (guitar) => setState(prev => ({ ...prev, currentGuitar: guitar }));
  
  const clearCurrentGuitar = () => setState(prev => ({ ...prev, currentGuitar: null }));
  
  const setFilesToUpload = (files) => setState(prev => ({ ...prev, filesToUpload: files }));
  
  const clearFilesToUpload = () => setState(prev => ({ ...prev, filesToUpload: null }));

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/guitar/settings`);
      const data = await response.json();
      setState(prev => ({ ...prev, settings: data.settings || {} }));
      return data.settings;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return {};
    }
  };

  const fetchGuitar = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/guitar?id=${id}`);
      const { guitar, settings } = await response.json();
      setState(prev => ({ 
        ...prev, 
        currentGuitar: guitar, 
        settings, 
        loading: false 
      }));
    } catch (error) {
      console.error("Error fetching guitar:", error);
      setLoading(false);
    }
  };

  const addGuitar = async () => {
    const currentGuitar = state.currentGuitar;
    try {
      const response = await fetch(`${BASE_URL}/api/guitars/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentGuitar),
      });

      if (!response.ok) {
        throw new Error('Failed to add new guitar');
      }

      const result = await response.json();
      setState(prev => ({ ...prev, currentGuitar: result, loading: false }));
      return result;
    } catch (e) {
      console.error("Error adding guitar:", e);
      throw e;
    }
  };

  const updateGuitar = async () => {
    const currentGuitar = state.currentGuitar;
    try {
      const response = await fetch(`${BASE_URL}/api/guitars/update/${currentGuitar._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentGuitar),
      });

      if (!response.ok) {
        throw new Error('Failed to update guitar');
      }

      setLoading(false);
      return currentGuitar;
    } catch (e) {
      console.error("Error updating guitar:", e);
      throw e;
    }
  };

  const deleteGuitar = async () => {
    const currentGuitar = state.currentGuitar;
    if (!currentGuitar || !currentGuitar._id) {
      console.error("No guitar selected for deletion");
      return;
    }

    try {
      await fetch(`${BASE_URL}/api/guitars/remove/${currentGuitar._id}`, {
        method: "DELETE",
      });
      console.log("Guitar deleted successfully");
      clearCurrentGuitar();
    } catch (e) {
      console.error("Error deleting guitar:", e);
    }
  };

  const fetchGuitars = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/guitars?page=${page}&limit=20`);
      const data = await response.json();
      setState(prev => ({
        ...prev,
        guitars: page === 1 ? data.guitars : [...prev.guitars, ...data.guitars],
        totalGuitars: page === 1 ? data.total : prev.totalGuitars,
        page,
        settings: data.settings,
        loading: false
      }));
    } catch (error) {
      console.error("Error fetching guitars:", error);
    }
  };

  const cloudinaryUpload = async (file) => {
    const cloudName = "x8d5hlk1";
    const apiKey = "124113443758435";
    const formData = new FormData();

    const resizedFile = await resizeImage(file.file);

    formData.append("file", resizedFile);
    formData.append("folder", "test"); 
    formData.append("upload_preset", "guitar-images");
    formData.append("api_key", apiKey);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.error) {
        console.error("Error uploading image:", data.error);
        return null;
      }

      const currentGuitar = state.currentGuitar;
      const updatedImages = currentGuitar.images.map(image =>
        getCombinedUrl(image) === file.url ? data.secure_url : image
      );
      
      setState(prev => ({ 
        ...prev, 
        currentGuitar: { ...prev.currentGuitar, images: updatedImages } 
      }));

      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const deleteImage = async (imageUrl) => {
    const currentGuitar = state.currentGuitar;
    if (!currentGuitar || !currentGuitar._id) {
      console.error("No guitar selected for deletion");
      return;
    }

    if (!imageUrl) {
      console.error("No image URL provided for deletion");
      return;
    }

    try {
      await fetch(`${BASE_URL}/api/guitars/deleteImage/${currentGuitar._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageUrl }),
      });
      console.log("Image deleted successfully");

      const updatedImages = currentGuitar.images.filter((image) => getCombinedUrl(image) !== imageUrl);
      setState(prev => ({ 
        ...prev, 
        currentGuitar: { ...prev.currentGuitar, images: updatedImages } 
      }));
    } catch (e) {
      console.error("Error deleting image:", e);
    }
  };

  const loadMore = () => {
    const nextPage = state.page + 1;
    fetchGuitars(nextPage);
  };

  const value = {
    ...state,
    setLoading,
    setCurrentGuitar,
    clearCurrentGuitar,
    setFilesToUpload,
    clearFilesToUpload,
    fetchSettings,
    fetchGuitar,
    addGuitar,
    updateGuitar,
    deleteGuitar,
    fetchGuitars,
    cloudinaryUpload,
    deleteImage,
    loadMore
  };

  return <GuitarContext.Provider value={value}>{children}</GuitarContext.Provider>;
};

GuitarProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useGuitarContext = () => {
  console.log("useGuitarContext called");
  const value = useContext(GuitarContext);

  if (!value) {
    throw new Error("🗣️ useGuitarContext hook used without GuitarContext");
  }

  return value;
};

export { GuitarProvider, GuitarContext, useGuitarContext };