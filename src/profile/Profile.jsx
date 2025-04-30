import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { formatDate } from "../dateUtils";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  const [ profileUser, setProfileUser ] = useState(null);
  const { user, loading, error, fetchUserProfile, logout } = useUserContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const userData = await fetchUserProfile(userId);
        setProfileUser(userData);
      } else {
        setProfileUser(user)
      }
    };
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto mt-6 max-w-2xl">
        <p>{error}</p>
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-auto mt-6 max-w-2xl">
        <p>User profile not found.</p>
      </div>
    );
  }
  
  const { username, bio, location, website, createdAt } = profileUser;
  
  return (
    <div className="max-w-screen-md w-full mx-auto p-6 md:min-w-[768px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        {!userId && (
          <button 
            onClick={() => {
              logout();
              navigate("/");
            }} 
            className="text-blue-500 hover:text-blue-600 bg-transparent border-none cursor-pointer p-0 flex items-center"
          >
            Logout
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-gray-600 flex items-center">
              📍 {location}
            </p>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-gray-700">{bio}</p>
        </div>
        
        {website && (
          <div className="mb-6 bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Website</h3>
            <a 
              href={website.startsWith("http") ? website : `https://${website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
            >
              🌐 {website}
            </a>
          </div>
        )}
        
        <div className="bg-gray-100 p-4 rounded-md text-gray-600 text-sm">
          <p>🗓️ Member since {formatDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;