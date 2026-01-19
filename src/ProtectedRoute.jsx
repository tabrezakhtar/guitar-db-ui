import { useState, useEffect } from "react";
import { ssrRedirect } from "./utils/urlUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/status`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.exists === true) {
            setIsAuthenticated(true);
          } else {
            ssrRedirect(`${BASE_URL}/login`, "/");
          }
        } else {
          ssrRedirect(`${BASE_URL}/login`, "/");
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        ssrRedirect(`${BASE_URL}/login`, "/");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Verifying authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // This shouldn't happen as we redirect, but just in case
  }

  return children;
};

export default ProtectedRoute;