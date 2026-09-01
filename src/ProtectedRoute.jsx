import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/status`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();
        if (data.exists === true) {
          setIsAuthenticated(true);
        } else {
          navigate("/login");
        }

      } catch (error) {
        console.error("Error checking user status:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  });

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