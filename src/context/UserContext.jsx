import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { produce } from "immer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  loading: false,
  error: null,
  showHeader: true,
  profileDeleted: false
};

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setState(produce(draft => {
          draft.user = parsedUser;
        }));
        
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

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

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("user");
    setState(produce(draft => {
      draft.user = null;
    }));
  };

  const value = {
    ...state,
    isGuest: Boolean(state.user?.guest),
    updateUserLocal,
    clearProfileDeleted,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };