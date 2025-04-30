import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setState(prev => ({ ...prev, user: parsedUser }));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      
      const response = await fetch(`${BASE_URL}/api/users/profile?userId=${userId}`, {
        headers
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setState(prev => ({ 
          ...prev, 
          error: data.errors, 
          loading: false 
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(prev => ({ 
          ...prev, 
          error: data.message || "Failed to fetch user profile", 
          loading: false 
        }));
        return null;
      }
      
      return data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to fetch user profile", 
        loading: false 
      }));
      return null;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const createUserProfile = async (userData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${BASE_URL}/api/users/createProfile`, {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setState(prev => ({ 
          ...prev, 
          error: data.errors, 
          loading: false 
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(prev => ({ 
          ...prev, 
          error: data.message || "Failed to create user profile", 
          loading: false 
        }));
        return null;
      }
      
      setState(prev => ({ 
        ...prev, 
        user: data, 
        loading: false 
      }));
      return data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to create user profile", 
        loading: false 
      }));
      return null;
    }
  };

  const updateUserProfile = async (userData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        setState(prev => ({ 
          ...prev, 
          error: "Authorization required", 
          loading: false 
        }));
        return null;
      }
      
      const response = await fetch(`${BASE_URL}/api/users/updateProfile`, {
        method: "PUT",
        headers,
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setState(prev => ({ 
          ...prev, 
          error: data.errors, 
          loading: false 
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(prev => ({ 
          ...prev, 
          error: data.message || "Failed to update user profile", 
          loading: false 
        }));
        return null;
      }
      
      // Update local storage with updated user data
      localStorage.setItem("user", JSON.stringify(data));
      
      setState(prev => ({ 
        ...prev, 
        user: data, 
        loading: false 
      }));
      return data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to update user profile", 
        loading: false 
      }));
      return null;
    }
  };

  const verifyMagicToken = async (token) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      if (!token) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: "No token found in URL"
        }));
        return { success: false, error: "No token found in URL" };
      }

      const response = await fetch(`${BASE_URL}/api/users/verifyMagicLink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

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

      if (!response.ok) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || "Authentication failed"
        }));
        return { 
          success: false, 
          error: data.message || "Authentication failed" 
        };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setState(prev => ({
        ...prev,
        user: data.user,
        loading: false
      }));

      return { success: true };
    } catch (err) {
      console.error("Magic link verification error:", err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "An unexpected error occurred"
      }));
      return { 
        success: false, 
        error: "An unexpected error occurred" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setState(initialState);
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value = {
    ...state,
    fetchUserProfile,
    createUserProfile,
    updateUserProfile,
    verifyMagicToken,
    logout,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserContext = () => {
  const value = useContext(UserContext);
  if (!value) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return value;
};