// useEditEquipmentData.js
import { useContext, useEffect, useState } from "react";
import { GuitarContext } from "../context/GuitarContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useEditEquipmentData = (id, mode = "edit") => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { 
    setLoading, 
    setCurrentEquipment, 
    clearCurrentEquipment, 
    updateEquipment, 
    addEquipment, 
    deleteEquipment,
    cloudinaryUpload,
    filesToUpload
  } = useContext(GuitarContext);
  
  const [equipment, setEquipmentState] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setCurrentEquipment(data.item);  // Update context
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

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchEquipment(id);
    } else {
      setIsLoading(false);
    }
  }, [id, mode]);

  return {
    equipment,
    setEquipment: (newEquipment) => {
      setEquipmentState(newEquipment);
      setCurrentEquipment(newEquipment);
    },
    settings,
    loading,
    error,
    fetchEquipment,
    updateEquipment,
    addEquipment,
    deleteEquipment,
    cloudinaryUpload,
    filesToUpload,
    clearCurrentEquipment
  };
};
