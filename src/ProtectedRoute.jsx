import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "./context/UserContext";

function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { user } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsValid(false);
          setIsChecking(false);
          return;
        }

        const decodedToken = decodeJWT(token);
        if (!decodedToken) {
          setIsValid(false);
          setIsChecking(false);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setIsValid(true);
        } else {
          setAuthError("Your session has expired. Please login again.");
          setIsValid(false);
        }
      } catch (error) {
        setAuthError("Authentication error: " + (error.message || "Failed to validate token"));
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    validateToken();
  }, [user]);
  
  if (isChecking) {
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

  if (!isValid) {
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