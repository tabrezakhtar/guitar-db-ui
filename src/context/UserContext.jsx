import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiRequest } from "../apiUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const fetchUserProfile = async (userId) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiRequest(`${BASE_URL}/api/users/profile?userId=${userId}`, {});
      setState(prev => ({ 
        ...prev, 
        user: data, 
        loading: false 
      }));
      return data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: "Failed to load user profile", 
        loading: false 
      }));
      return null;
    }
  };

  const value = {
    ...state,
    fetchUserProfile,
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