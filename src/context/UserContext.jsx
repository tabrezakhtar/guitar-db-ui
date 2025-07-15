import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { validateToken } from "../utils/tokenUtils";
import { produce } from "immer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  loading: false,
  error: null,
  showHeader: true,
  isTokenValid: false,
  isValidatingToken: false,
  profileDeleted: false
};

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setState(produce(draft => {
          draft.user = parsedUser;
        }));
        
        if (token) {
          handleTokenValidation();
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);
  
  const handleTokenValidation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState(produce(draft => {
        draft.isTokenValid = false;
      }));
      return false;
    }

    setState(produce(draft => {
      draft.isValidatingToken = true;
    }));
    
    const isValid = await validateToken(handleAuthError);
    
    setState(produce(draft => {
      draft.isTokenValid = isValid;
      draft.isValidatingToken = false;
    }));
    
    return isValid;
  };
  
  const handleAuthError = (errorMsg) => {
    console.error("Auth error:", errorMsg);
    setState(produce(draft => {
      draft.isTokenValid = false;
      draft.isValidatingToken = false;
      draft.error = errorMsg || "Authentication failed";
    }));
  };

  const fetchUserProfile = async (userId) => {
    setState(produce(draft => {
      draft.loading = true;
      draft.error = null;
    }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      
      const response = await fetch(`${BASE_URL}/api/users/profile?userId=${userId}`, {
        headers
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setState(produce(draft => {
          draft.error = data.errors;
          draft.loading = false;
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(produce(draft => {
          draft.error = data.message || "Failed to fetch user profile";
          draft.loading = false;
        }));
        return null;
      }
      
      return data;
    } catch (error) {
      setState(produce(draft => {
        draft.error = error.message || "Failed to fetch user profile";
        draft.loading = false;
      }));
      return null;
    } finally {
      setState(produce(draft => {
        draft.loading = false;
      }));
    }
  };

  const createUserProfile = async (userData) => {
    setState(produce(draft => {
      draft.loading = true;
      draft.error = null;
    }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${BASE_URL}/api/auth/createProfile`, {
        method: "POST",
        headers,
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data && data.errors) {
        setState(produce(draft => {
          draft.error = data.errors;
          draft.loading = false;
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(produce(draft => {
          draft.error = data.message || "Failed to create user profile";
          draft.loading = false;
        }));
        return null;
      }
      
      setState(produce(draft => {
        draft.user = data;
        draft.loading = false;
      }));
      return data;
    } catch (error) {
      setState(produce(draft => {
        draft.error = error.message || "Failed to create user profile";
        draft.loading = false;
      }));
      return null;
    }
  };

  const updateUserProfile = async (userData) => {
    const isValid = await handleTokenValidation();
    if (!isValid) {
      setState(produce(draft => {
        draft.error = "Your session has expired. Please login again.";
        draft.loading = false;
      }));
      return null;
    }

    setState(produce(draft => {
      draft.loading = true;
      draft.error = null;
    }));
    
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
        setState(produce(draft => {
          draft.error = data.errors;
          draft.loading = false;
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(produce(draft => {
          draft.error = data.message || "Failed to update user profile";
          draft.loading = false;
        }));
        return null;
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setState(produce(draft => {
        draft.user = data.user;
        draft.loading = false;
      }));
      return data;
    } catch (error) {
      setState(produce(draft => {
        draft.error = error.message || "Failed to update user profile";
        draft.loading = false;
      }));
      return null;
    }
  };

  const verifyMagicToken = async (token) => {
    setState(produce(draft => {
      draft.loading = true;
      draft.error = null;
    }));
    
    try {
      if (!token) {
        setState(produce(draft => {
          draft.loading = false;
          draft.error = "No token found in URL";
        }));
        return { success: false, error: "No token found in URL" };
      }

      const response = await fetch(`${BASE_URL}/api/auth/verifyMagicLink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data && data.errors) {
        setState(produce(draft => {
          draft.loading = false;
          draft.error = data.errors;
        }));
        return { 
          success: false, 
          error: data.errors 
        };
      }

      if (!response.ok) {
        setState(produce(draft => {
          draft.loading = false;
          draft.error = data.message || "Authentication failed";
        }));
        return { 
          success: false, 
          error: data.message || "Authentication failed" 
        };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setState(produce(draft => {
        draft.user = data.user;
        draft.loading = false;
      }));

      return { success: true };
    } catch (err) {
      console.error("Magic link verification error:", err);
      setState(produce(draft => {
        draft.loading = false;
        draft.error = "An unexpected error occurred";
      }));
      return { 
        success: false, 
        error: "An unexpected error occurred" 
      };
    }
  };

  const deleteAvatar = async () => {
    const isValid = await handleTokenValidation();
    if (!isValid) {
      setState(produce(draft => {
        draft.error = "Your session has expired. Please login again.";
        draft.loading = false;
      }));
      return null;
    }

    setState(produce(draft => {
      draft.loading = true;
      draft.error = null;
    }));
    
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
        setState(produce(draft => {
          draft.error = data.errors;
          draft.loading = false;
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(produce(draft => {
          draft.error = data.message || "Failed to delete avatar";
          draft.loading = false;
        }));
        return null;
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setState(produce(draft => {
        draft.user = data.user;
        draft.loading = false;
      }));
      return data;
    } catch (error) {
      setState(produce(draft => {
        draft.error = error.message || "Failed to delete avatar";
        draft.loading = false;
      }));
      return null;
    }
  };

  const deleteProfile = async () => {
    const isValid = await handleTokenValidation();
    if (!isValid) {
      setState(produce(draft => {
        draft.error = "Your session has expired. Please login again.";
        draft.loading = false;
      }));
      return null;
    }

    setState(produce(draft => {
      draft.loading = true;
      draft.error = null;
    }));
    
    try {
      const token = localStorage.getItem("token");
      const headers = { 
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${BASE_URL}/api/users/deleteProfile`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ userId: state.user?._id })
      });
      
      const data = await response.json();
      
      if (data && data.errors) {
        setState(produce(draft => {
          draft.error = data.errors;
          draft.loading = false;
        }));
        return null;
      }
      
      if (!response.ok) {
        setState(produce(draft => {
          draft.error = data.message || "Failed to delete profile";
          draft.loading = false;
        }));
        return null;
      }
      
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      setState(produce(draft => {
        Object.assign(draft, initialState);
        draft.profileDeleted = true;
      }));
      return data;
    } catch (error) {
      setState(produce(draft => {
        draft.error = error.message || "Failed to delete profile";
        draft.loading = false;
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
    setState(produce(draft => {
      draft.error = null;
    }));
  };

  const updateUserLocal = (newData) => {
    setState(produce(draft => {
      Object.assign(draft.user, newData);
      localStorage.setItem("user", JSON.stringify(draft.user));
    }));
  };

  const setHeaderVisibility = (visible) => {
    setState(produce(draft => {
      draft.showHeader = visible;
    }));
  };

  const clearProfileDeleted = () => {
    setState(produce(draft => {
      draft.profileDeleted = false;
    }));
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
    deleteProfile,
    setHeaderVisibility,
    clearProfileDeleted,
    validateToken: handleTokenValidation
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };