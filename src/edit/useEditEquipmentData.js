import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { validateToken } from "../utils/tokenUtils";
import { cloudinaryUpload } from "../utils/cloudinaryUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useEditEquipmentData = (id, mode = "edit") => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const [equipment, setEquipmentState] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filesToUpload, setFilesToUploadState] = useState([]);

  const fetchEquipment = async (equipmentId) => {
    if (!equipmentId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/equipment/byid?id=${equipmentId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        throw new Error(data.errors.join(", "));
      }

      // Verify user can edit this equipment
      const canEdit = user && data.item.user && user._id === data.item.user._id;
      if (!canEdit) {
        navigate("/");
        throw new Error("You don't have permission to edit this equipment");
      }

      setEquipmentState(data.item);
      setSettings(data.settings || {});
      setIsLoading(false);

      return data;
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const handleAuthError = (errorMsg) => {
    setError("Authentication error: " + errorMsg);
  };

  const updateEquipment = async (equipmentData = null) => {
    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setError("Your session has expired. Please login again.");
      setIsLoading(false);
      return null;
    }

    const dataToSend = equipmentData || equipment;

    return new Promise((resolve, reject) => {
      if (!dataToSend?._id) {
        resolve(null);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json"
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        fetch(`${BASE_URL}/api/equipment/update/${dataToSend._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(dataToSend),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(result => {
            if (result && result.errors) {
              setError(result.errors.join(", "));
              setIsLoading(false);
              resolve({
                success: false,
                error: result.errors
              });
              return;
            }

            const updatedFilesToUpload = filesToUpload?.map((fileObj, index) => {
              if (result.images && result.images[index]) {
                return { ...fileObj, url: result.images[index] };
              }
              return fileObj;
            }) || [];

            setEquipmentState(result);
            setFilesToUploadState(updatedFilesToUpload);
            setIsLoading(false);
            setError(null);

            resolve(result);
          })
          .catch(error => {
            console.error("Failed to update equipment:", error);
            setError(error.message);
            setIsLoading(false);
            reject(error);
          });
      } catch (error) {
        console.error("Failed to update equipment:", error);
        setError(error.message);
        setIsLoading(false);
        reject(error);
      }
    });
  };

  const addEquipment = async (type, equipmentData = null) => {
    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setError("Your session has expired. Please login again.");
      setIsLoading(false);
      return null;
    }

    const dataToSend = equipmentData || equipment;

    return new Promise((resolve, reject) => {
      if (!type || !dataToSend) {
        resolve(null);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json"
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        fetch(`${BASE_URL}/api/equipment/add?type=${type}`, {
          method: "POST",
          headers,
          body: JSON.stringify(dataToSend),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(result => {
            if (result && result.errors) {
              setError(result.errors.join(", "));
              setIsLoading(false);
              resolve({
                success: false,
                error: result.errors
              });
              return;
            }

            setEquipmentState(result);
            setIsLoading(false);
            setError(null);

            resolve(result);
          })
          .catch(error => {
            console.error("Failed to add equipment:", error);
            setError(error.message);
            setIsLoading(false);
            reject(error);
          });
      } catch (error) {
        console.error("Failed to add equipment:", error);
        setError(error.message);
        setIsLoading(false);
        reject(error);
      }
    });
  };

  const deleteEquipment = async () => {
    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setError("Your session has expired. Please login again.");
      setIsLoading(false);
      return null;
    }

    if (!equipment?._id) {
      console.error("No equipment selected for deletion");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/equipment/remove/${equipment._id}`, {
        method: "DELETE",
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.errors) {
        setError(result.errors.join(", "));
        return {
          success: false,
          error: result.errors
        };
      }

      setEquipmentState(null);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error("Failed to delete equipment:", error);
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const cloudinaryUploadForGuitar = async (file, currentEquipmentData = null) => {
    setError(null);

    const equipmentToUse = currentEquipmentData || equipment;

    try {
      const result = await cloudinaryUpload(file, "guitars");

      if (typeof result === "string" && result.includes("res.cloudinary.com")) {
        return true;
      }

      if (!result.success && result.error) {
        setError(result.error);
        return result;
      }

      if (equipmentToUse && equipmentToUse.images) {
        const updatedImages = equipmentToUse.images.map((image) =>
          image === file.url ? result.secure_url : image
        );

        const updatedFilesToUpload = filesToUpload.map((fileObj) =>
          fileObj.url === file.url ? { ...fileObj, url: result.secure_url } : fileObj
        );

        const updatedEquipment = { ...equipmentToUse, images: updatedImages };
        setEquipmentState(updatedEquipment);
        setFilesToUploadState(updatedFilesToUpload);
        
        return result.secure_url;
      }

      return result.secure_url;
    } catch (error) {
      console.error("Failed to upload to cloudinary:", error);
      setError(error.message);
      throw error;
    }
  };

  const deleteImage = async (imageUrl) => {
    const isValid = await validateToken(handleAuthError);
    if (!isValid) {
      setError("Your session has expired. Please login again.");
      return null;
    }

    if (!equipment) {
      console.error("No equipment selected for deletion");
      return;
    }
    if (!imageUrl) {
      console.error("No image URL provided for deletion");
      return;
    }

    if (imageUrl.startsWith("blob:http")) {
      const updatedImages = equipment.images.filter(
        (image) => image !== imageUrl
      );
      const updatedFilesToUpload = filesToUpload.filter(
        (fileObj) => fileObj.url !== imageUrl
      );
      setEquipmentState({ ...equipment, images: updatedImages });
      setFilesToUploadState(updatedFilesToUpload);
      return;
    }

    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api/equipment/deleteImage/${equipment._id}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.errors) {
        setError(result.errors.join(", "));
        return {
          success: false,
          error: result.errors
        };
      }

      const updatedImages = equipment.images.filter(
        (image) => image !== imageUrl
      );
      const updatedFilesToUpload = filesToUpload.filter(
        (fileObj) => fileObj.url !== imageUrl
      );
      
      setEquipmentState({ ...equipment, images: updatedImages });
      setFilesToUploadState(updatedFilesToUpload);

      return result;
    } catch (error) {
      console.error("Failed to delete image:", error);
      setError(error.message);
      throw error;
    }
  };

  const setFilesToUpload = (files) => {
    setFilesToUploadState(typeof files === "function" ? files(filesToUpload) : files);
  };

  const clearFilesToUpload = () => setFilesToUploadState([]);

  const clearCurrentEquipment = () => setEquipmentState(null);

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchEquipment(id);
    } else {
      setIsLoading(false);
    }
  }, [id, mode]);

  return {
    equipment,
    setEquipment: setEquipmentState,
    settings,
    loading,
    error,
    fetchEquipment,
    updateEquipment,
    addEquipment,
    deleteEquipment,
    cloudinaryUpload: cloudinaryUploadForGuitar,
    deleteImage,
    filesToUpload,
    setFilesToUpload,
    clearFilesToUpload,
    clearCurrentEquipment
  };
};
