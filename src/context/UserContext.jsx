import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

const initialState = {
  user: null,
  loading: false,
  error: null,
  showHeader: true,
  isTokenValid: false,
  isValidatingToken: false
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setState(prev => ({ ...prev, user: parsedUser }));
        
        if (token) {
          validateToken();
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState(prev => ({ ...prev, isTokenValid: false }));
      return false;
    }

    setState(prev => ({ ...prev, isValidatingToken: true }));
    
    try {
      const decodedToken = decodeJWT(token);
      if (!decodedToken) {
        setState(prev => ({ 
          ...prev, 
          isTokenValid: false,
          isValidatingToken: false
        }));
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        setState(prev => ({ 
          ...prev, 
          isTokenValid: true,
          isValidatingToken: false
        }));
        return true;
      } else {
        return await refreshToken();
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setState(prev => ({ 
        ...prev, 
        isTokenValid: false,
        isValidatingToken: false,
        error: "Authentication failed"
      }));
      return false;
    }
  };

  const refreshToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
      const response = await fetch(`${BASE_URL}/api/users/refreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setState(prev => ({ 
          ...prev, 
          isTokenValid: true,
          isValidatingToken: false
        }));
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          isTokenValid: false,
          isValidatingToken: false,
          error: data.message || "Session expired"
        }));
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      setState(prev => ({ 
        ...prev, 
        isTokenValid: false,
        isValidatingToken: false,
        error: "Authentication failed"
      }));
      return false;
    }
  };

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
    const isValid = await validateToken();
    if (!isValid) {
      setState(prev => ({ 
        ...prev, 
        error: "Your session has expired. Please login again.", 
        loading: false 
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
 
      const updatedUser = { ...state.user, ...userData };

      const response = await fetch(`${BASE_URL}/api/users/updateProfile`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedUser),
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
      
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setState(prev => ({ 
        ...prev, 
        user: data.user, 
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

  const deleteAvatar = async () => {
    const isValid = await validateToken();
    if (!isValid) {
      setState(prev => ({ 
        ...prev, 
        error: "Your session has expired. Please login again.", 
        loading: false 
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${BASE_URL}/api/users/deleteAvatar`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ avatarUrl: state.user?.avatarUrl, userId: state.user?._id })
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
          error: data.message || "Failed to delete avatar", 
          loading: false 
        }));
        return null;
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setState(prev => ({ 
        ...prev, 
        user: data.user, 
        loading: false 
      }));
      return data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || "Failed to delete avatar", 
        loading: false 
      }));
      return null;
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

  const updateUserLocal = (newData) => {
    setState(prev => {
      const updatedUser = { ...prev.user, ...newData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  const setHeaderVisibility = (visible) => {
    setState(prev => ({ ...prev, showHeader: visible }));
  };

  const value = {
    ...state,
    fetchUserProfile,
    createUserProfile,
    updateUserProfile,
    verifyMagicToken,
    logout,
    clearError,
    updateUserLocal,
    deleteAvatar,
    setHeaderVisibility,
    validateToken,
    refreshToken
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