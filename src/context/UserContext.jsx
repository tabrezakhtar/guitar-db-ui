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

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setState(initialState);
  };

  const updateUserLocal = (newData) => {
    setState(produce(draft => {
      Object.assign(draft.user, newData);
      localStorage.setItem("user", JSON.stringify(draft.user));
    }));
  };

  const clearProfileDeleted = () => {
    setState(produce(draft => {
      draft.profileDeleted = false;
    }));
  };

  const value = {
    ...state,
    isGuest: Boolean(state.user?.guest),
    logout,
    updateUserLocal,
    clearProfileDeleted,
    validateToken: handleTokenValidation
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };