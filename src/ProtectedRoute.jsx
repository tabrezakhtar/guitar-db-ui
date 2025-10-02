import { useEffect, useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Spinner from "./components/Spinner";
import { ssrRedirect } from "./utils/urlUtils";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [hasRedirectedForDeletion, setHasRedirectedForDeletion] = useState(false);
  const { user, validateToken, isTokenValid, isValidatingToken, profileDeleted, clearProfileDeleted } = useContext(UserContext);
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
  if (!isTokenValid) {
    return (
      <div className="p-6">
        <div className="flex p-5 bg-[rgba(33,172,232,0.12)] rounded-[15px] mb-6 w-full text-[#f7f9f9] font-['Nunito',sans-serif] text-[20px] font-normal">
          <div className="flex-shrink-0 mr-4">
            <span className="text-2xl">📨</span>
          </div>
          <div>
            <p className="font-bold mb-1">Login Required</p>
            <p className="leading-relaxed">{authError || "Your credentials are either invalid or expired."}</p>
            <button 
              onClick={() => {
                ssrRedirect(`${BASE_URL}/login`, "/");
              }}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-semibold mt-4"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;