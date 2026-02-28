import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useScheduleData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSchedule = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/schedule?userId=${userId}`, {
        credentials: "include"
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (scheduleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(scheduleData)
      });

      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/schedule`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        let message = "Failed to delete schedule";
        try {
          const data = await response.json();
          if (data && data.error) {
            message = data.error;
          }
        } catch {}
        throw new Error(message);
      }

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSchedule,
    updateSchedule,
    deleteSchedule
  };
};
