import { useState, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { ssrRedirect } from "./utils/urlUtils";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// TODO: check the user using an endpoint
const ProtectedRoute = ({ children }) => {
  const [hasRedirectedForDeletion, setHasRedirectedForDeletion] = useState(false);
  const { user, profileDeleted, clearProfileDeleted } = useContext(UserContext);

  if (!user) {
    if (profileDeleted && !hasRedirectedForDeletion) {
      setHasRedirectedForDeletion(true);
      clearProfileDeleted();
      window.location.href = window.location.origin;
      return null;
    }
    
    if (!hasRedirectedForDeletion) {
      ssrRedirect(`${BASE_URL}/login`, "/")
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;