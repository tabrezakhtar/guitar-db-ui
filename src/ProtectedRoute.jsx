import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "./context/UserContext";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState(null);
  const { user, validateToken, isTokenValid, isValidatingToken } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }
      
      try {
        const isValid = await validateToken();
        if (!isValid) {
          setAuthError("Your session has expired. Please login again.");
        }
      } catch (error) {
        setAuthError("Authentication error: " + (error.message || "Failed to validate token"));
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (isChecking || isValidatingToken) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Verifying authentication...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/create-profile" state={{ from: location }} replace />;
  }

  if (!isTokenValid) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Authentication Error</p>
          <p>{authError || "Your authentication token is invalid or expired."}</p>
          <p className="mt-2">Please login again.</p>
          <button 
            onClick={() => {
              window.location.href = "/create-profile";
            }}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;