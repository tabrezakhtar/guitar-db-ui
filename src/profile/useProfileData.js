import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/users/profile?userId=${userId}`, {
        credentials: "include",
      });

      const data = await response.json();
      
      if (data && data.errors) {
        setError(data.errors);
        return null;
      }
      
      if (!response.ok) {
        setError(data.message || "Failed to fetch user profile");
        return null;
      }
      
      return data;
    } catch (error) {
      setError(error.message || "Failed to fetch user profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData, currentUser) => {
    setLoading(true);
    setError(null);

    try {
      const headers = { 
        "Content-Type": "application/json"
      };

      const updatedUser = { ...currentUser, ...userData };

      const response = await fetch(`${BASE_URL}/api/users/updateProfile`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedUser),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setError(data.errors);
        return null;
      }
      
      if (!response.ok) {
        setError(data.message || "Failed to update user profile");
        return null;
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      setError(error.message || "Failed to update user profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async (currentUser) => {
    setLoading(true);
    setError(null);

    try {
      const headers = { 
        "Content-Type": "application/json"
      };

      const response = await fetch(`${BASE_URL}/api/users/deleteAvatar`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ avatarUrl: currentUser?.avatarUrl, userId: currentUser?._id }),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setError(data.errors);
        return null;
      }
      
      if (!response.ok) {
        setError(data.message || "Failed to delete avatar");
        return null;
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      setError(error.message || "Failed to delete avatar");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (currentUser) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/users/deleteProfile`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ userId: currentUser?._id }),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setError(data.errors);
        return null;
      }
      
      if (!response.ok) {
        setError(data.message || "Failed to delete profile");
        return null;
      }

      return data;
    } catch (error) {
      setError(error.message || "Failed to delete profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    deleteAvatar,
    deleteProfile,
  };
};
