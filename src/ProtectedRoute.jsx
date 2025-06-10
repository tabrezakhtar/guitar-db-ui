import { useEffect, useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Spinner from "./components/Spinner";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState(null);
  const { user, validateToken, isTokenValid, isValidatingToken } = useContext(UserContext);
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
        <Spinner />
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
              window.location.href = `${BASE_URL}/login`;
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