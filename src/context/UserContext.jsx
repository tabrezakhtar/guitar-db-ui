import { createContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { produce } from "immer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  loading: true,
  error: null,
  showHeader: true,
  profileDeleted: false,
  hasVisitedLandingPage: false
};

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const location = useLocation();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (location.pathname === "/") {
      setState(produce(draft => {
        draft.loading = false;
      }));
      return;
    }

    if (hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;

    const fetchUser = async () => {
      setState(produce(draft => {
        draft.loading = true;
      }));

      try {
        const res = await fetch(`${BASE_URL}/api/users/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.banned) {
            await logout();
            navigate("/login");
            return;
          }
          throw new Error("Not authenticated");
        }

        const user = await res.json();

        setState(produce(draft => {
          draft.user = user;
          draft.loading = false;
        }));
      } catch {
        setState(produce(draft => {
          draft.user = null;
          draft.loading = false;
        }));
      }
    };

    fetchUser();
  }, [location.pathname]);

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

  const setHasVisitedLandingPage = (value) => {
    setState(produce(draft => {
      draft.hasVisitedLandingPage = value;
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
    setHasVisitedLandingPage,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };