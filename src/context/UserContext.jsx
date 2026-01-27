import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { produce } from "immer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  loading: true,
  error: null,
  showHeader: true,
  profileDeleted: false
};

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const user = await res.json();

        setState(produce(draft => {
          draft.user = user;
        }));
      } catch {
        setState(produce(draft => {
          draft.user = null;
        }));
      } finally {
        setState(produce(draft => {
          draft.loading = false;
        }));
      }
    };

    fetchUser();
  }, []);

  const updateUserLocal = (newData) => {
    setState(produce(draft => {
      Object.assign(draft.user, newData);
    }));
  };

  const setUser = (user) => {
    setState(produce(draft => {
      draft.user = user;
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
    setState(produce(draft => {
      draft.user = null;
    }));
  };

  const value = {
    ...state,
    isGuest: Boolean(state.user?.guest),
    updateUserLocal,
    setUser,
    clearProfileDeleted,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };