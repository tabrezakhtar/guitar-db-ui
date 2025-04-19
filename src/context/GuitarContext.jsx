import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { resizeImage, getCombinedUrl } from "../imageUtils";
import { apiRequest } from "../apiUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const initialState = {
  guitars: [],
  filesToUpload: [],
  currentGuitar: null,
  settings: {},
  loading: true,
  page: 1,
  totalGuitars: 0,
};

const GuitarContext = createContext(null);

const GuitarProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const setLoading = (loading) => setState((prev) => ({ ...prev, loading }));

  const setCurrentGuitar = (guitar) => setState((prev) => ({ ...prev, currentGuitar: guitar }));

  const clearCurrentGuitar = () => setState((prev) => ({ ...prev, currentGuitar: null }));

  const setFilesToUpload = (files) => setState((prev) => ({ ...prev, filesToUpload: files }));

  const clearFilesToUpload = () => setState((prev) => ({ ...prev, filesToUpload: null }));

  const fetchSettings = async () => {
    return apiRequest(
      `${BASE_URL}/api/guitar/settings`,
      {},
      (data) => setState((prev) => ({ ...prev, settings: data.settings || {} }))
    );
  };

  const fetchGuitar = async (id) => {
    if (!id) return;
    setLoading(true);
    return apiRequest(
      `${BASE_URL}/api/guitar?id=${id}`,
      {},
      ({ guitar, settings }) =>
        setState((prev) => ({
          ...prev,
          currentGuitar: guitar,
          settings,
          loading: false,
        })),
      () => setLoading(false)
    );
  };

  const addGuitar = async () => {
    const currentGuitar = state.currentGuitar;
    return apiRequest(
      `${BASE_URL}/api/guitars/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentGuitar),
      },
      (result) =>
        setState((prev) => ({
          ...prev,
          currentGuitar: result,
          loading: false,
        }))
    );
  };

  const updateGuitar = async () => {
    const currentGuitar = state.currentGuitar;
    return apiRequest(
      `${BASE_URL}/api/guitars/update/${currentGuitar._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentGuitar),
      },
      () => setLoading(false)
    );
  };

  const deleteGuitar = async () => {
    const currentGuitar = state.currentGuitar;
    if (!currentGuitar || !currentGuitar._id) {
      console.error("No guitar selected for deletion");
      return;
    }
    return apiRequest(
      `${BASE_URL}/api/guitars/remove/${currentGuitar._id}`,
      { method: "DELETE" },
      () => clearCurrentGuitar()
    );
  };

  const fetchGuitars = async (page) => {
    setLoading(true);
    return apiRequest(
      `${BASE_URL}/api/guitars?page=${page}&limit=20`,
      {},
      (data) =>
        setState((prev) => ({
          ...prev,
          guitars: page === 1 ? data.guitars : [...prev.guitars, ...data.guitars],
          totalGuitars: page === 1 ? data.total : prev.totalGuitars,
          page,
          settings: data.settings,
          loading: false,
        })),
      () => setLoading(false)
    );
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

    return apiRequest(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
      (data) => {
        if (data.error) {
          console.error("Error uploading image:", data.error);
          return null;
        }
        const currentGuitar = state.currentGuitar;
        const updatedImages = currentGuitar.images.map((image) =>
          getCombinedUrl(image) === file.url ? data.secure_url : image
        );
        setState((prev) => ({
          ...prev,
          currentGuitar: { ...prev.currentGuitar, images: updatedImages },
        }));
        return data.secure_url;
      }
    );
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
    return apiRequest(
      `${BASE_URL}/api/guitars/deleteImage/${currentGuitar._id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      },
      () => {
        const updatedImages = currentGuitar.images.filter(
          (image) => getCombinedUrl(image) !== imageUrl
        );
        setState((prev) => ({
          ...prev,
          currentGuitar: { ...prev.currentGuitar, images: updatedImages },
        }));
      }
    );
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
    loadMore,
  };

  return <GuitarContext.Provider value={value}>{children}</GuitarContext.Provider>;
};

GuitarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useGuitarContext = () => {
  const value = useContext(GuitarContext);
  if (!value) {
    throw new Error("useGuitarContext must be used within a GuitarProvider");
  }
  return value;
};

export { GuitarProvider, GuitarContext, useGuitarContext };