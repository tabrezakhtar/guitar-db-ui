import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SaveCredentials = () => {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const userStr = query.get("user");
    
    if (!token || !userStr) {
      setError("Missing authentication data in URL");
      return;
    }
    
    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setSaved(true);
      
      const timeout = setTimeout(() => {
        navigate("/gallery");
      }, 2000);

      return () => clearTimeout(timeout);
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("Invalid user data format");
    }
  }, [location, navigate]);
  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded shadow-md max-w-sm mx-auto mt-10">      
      {saved && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-green-500 text-3xl font-bold">✓</span>
            <h1 className="text-2xl font-bold">Account Verified!</h1>
          </div>
          <p className="text-gray-700 mb-1">Redirecting to Guitar DB...</p>
          <p className="text-gray-900 font-medium mb-4">
            Welcome, {JSON.parse(localStorage.getItem("user"))?.username || "User"}!
          </p>
          
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="h-4 w-4 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
            <span>Redirecting...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
          >
            Return to Login
          </button>
          
        </div>
      )}
    </div>
  );
};

export default SaveCredentials;