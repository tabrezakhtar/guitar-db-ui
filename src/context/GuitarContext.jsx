import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { resizeImage, getCombinedUrl } from "../imageUtils";
import { apiRequest } from "../apiUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const initialState = {
  equipment: [],
  filesToUpload: [],
  currentEquipment: null,
  settings: {},
  loading: true,
  page: 1,
  totalEquipment: 0,
};

const GuitarContext = createContext(null);

const GuitarProvider = ({ children }) => {
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

  const fetchSettings = async () => {
    return apiRequest(
      `${BASE_URL}/api/equipment/settings`,
      {},
      (data) => setState((prev) => ({ ...prev, settings: data.settings || {} }))
    );
  };

  const fetchEquipment = async (id, type) => {
    if (!id || !type) return;
    setLoading(true);
    return apiRequest(
      `${BASE_URL}/api/equipmentById?id=${id}&type=${type}`,
      {},
      ({ item, settings }) =>
        setState((prev) => ({
          ...prev,
          currentEquipment: item,
          settings,
          loading: false,
        })),
      () => setLoading(false)
    );
  };

  const addEquipment = async (type) => {
    return new Promise((resolve) => {
      setState(prev => {
        const currentEquipment = prev.currentEquipment;
        
        console.log("addEquipment()", currentEquipment);
        if (!type || !currentEquipment) {
          resolve(null);
          return prev;
        }
        
        apiRequest(
          `${BASE_URL}/api/equipment/add?type=${type}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentEquipment),
          },
          (result) => {
            setState(innerPrev => ({
              ...innerPrev,
              currentEquipment: result,
              loading: false,
            }));
            resolve(result);
          }
        );
        
        return prev;
      });
    });
  };

  const updateEquipment = async (type) => {
    return new Promise((resolve) => {
      setState((prev) => {
        const currentEquipment = prev.currentEquipment;

        if (!type || !currentEquipment?._id) {
          resolve(null);
          return prev;
        }

        apiRequest(
          `${BASE_URL}/api/equipment/update/${currentEquipment._id}?type=${type}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentEquipment),
          },
          (result) => {
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
              };
            });
            resolve(result);
          }
        );

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
    return apiRequest(
      `${BASE_URL}/api/equipment/remove/${currentEquipment._id}`,
      { method: "DELETE" },
      () => clearCurrentEquipment()
    );
  };

  const fetchEquipmentList = async (page, type) => {
    if (!type) return;
    setLoading(true);
    return apiRequest(
      `${BASE_URL}/api/equipmentList?page=${page}&limit=20&type=${type}`,
      {},
      (data) =>
        setState((prev) => ({
          ...prev,
          equipment: page === 1 ? data.items : [...prev.equipment, ...data.items],
          totalEquipment: page === 1 ? data.total : prev.totalEquipment,
          page,
          settings: data.settings,
          loading: false,
        })),
      () => setLoading(false)
    );
  };

  const cloudinaryUpload = async (file) => {
    if (!file.url.startsWith("blob:http")) {
      return file.url;
    }
  
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
  
        setState((prev) => {
          const updatedImages = prev.currentEquipment.images.map((image) =>
            getCombinedUrl(image) === file.url ? data.secure_url : image
          );
  
          const updatedFilesToUpload = prev.filesToUpload.map((fileObj) =>
            fileObj.url === file.url ? { ...fileObj, url: data.secure_url } : fileObj
          );
  
          return {
            ...prev,
            currentEquipment: { ...prev.currentEquipment, images: updatedImages },
            filesToUpload: updatedFilesToUpload,
          };
        });
  
        return data.secure_url;
      }
    );
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
      }));
      return;
    }
  
    return apiRequest(
      `${BASE_URL}/api/equipment/deleteImage/${currentEquipment._id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      },
      () => {
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
        }));
      }
    );
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
    fetchEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    fetchEquipmentList,
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