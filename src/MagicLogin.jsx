import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Spinner from "./components/Spinner";

const MagicLogin = () => {
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyMagicToken, error: contextError } = useContext(UserContext);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Extract token from URL query parameter
        const query = new URLSearchParams(location.search);
        const token = query.get("token");
        
        // Use the verifyMagicToken function from UserContext
        const result = await verifyMagicToken(token);
        
        if (!result.success) {
          setStatus("error");
          setError(result.error);
          return;
        }
        
        setStatus("success");
        
        // Redirect to homepage after successful login
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        console.error("Magic link verification error:", err);
        setStatus("error");
        setError("An unexpected error occurred");
      }
    };

    verifyToken();
  }, []); // Add empty dependency array

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Magic Link Login</h2>
        
        {status === "verifying" && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-2">
              <Spinner />
            </div>
            <p className="text-gray-600">Verifying your login...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-4">
            <div className="text-4xl mb-2 text-green-500">✅</div>
            <p className="text-green-600">Login successful! Redirecting...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-4">
            <p className="text-red-600 mb-4">Error: {error || contextError}</p>
            <button 
              onClick={() => navigate("/login")} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagicLogin;