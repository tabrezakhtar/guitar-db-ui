// useEquipmentData.js
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useEquipmentData = (id, type = "") => {

  const [equipment, setEquipment] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEquipment = async (equipmentId, equipmentType = "") => {
    if (!equipmentId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/equipment/byid?id=${equipmentId}&type=${equipmentType}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.errors) {
        throw new Error(data.errors.join(", "));
      }

      setEquipment(data.item);
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
    if (id) {
      fetchEquipment(id, type);
    }
  }, [id, type]);

  return {
    equipment,
    settings,
    loading,
    error,
    fetchEquipment,
    setEquipment
  };
};
