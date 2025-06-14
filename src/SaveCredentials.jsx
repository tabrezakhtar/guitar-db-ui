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
      
      navigate("/profile");
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("Invalid user data format");
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded shadow-md max-w-sm mx-auto mt-10">      
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