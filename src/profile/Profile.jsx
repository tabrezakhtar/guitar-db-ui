import { useEffect, useState, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { GuitarContext } from "../context/GuitarContext";
import { useProfileData } from "./useProfileData";
import { formatDate } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import AvatarDisplayOnly from "./AvatarDisplayOnly";
import { EquipmentCarousel } from "./EquipmentCard";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";

const Profile = () => {
  const { userId } = useParams();
  const [ profileUser, setProfileUser ] = useState(null);
  const [ likedEquipment, setLikedEquipment ] = useState([]);
  const [ userEquipment, setUserEquipment ] = useState({
    guitars: [],
    amps: [],
    pedals: []
  });
  const [ userComments, setUserComments ] = useState([]);
  const { user, logout } = useContext(UserContext);
  const { fetchUserEquipment, error: equipmentError, loading: equipmentLoading } = useContext(GuitarContext);
  const { fetchUserProfile, loading: profileLoading, error: profileError } = useProfileData();

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const userData = await fetchUserProfile(userId);
        if (userData) {
          setProfileUser(userData.user);
          setUserComments(userData.comments || []);
          setLikedEquipment(userData.likedEquipment || []);
        }
      } else {
        const userData = await fetchUserProfile(user._id);
        if (userData) {
          setUserComments(userData.comments || []);
          setLikedEquipment(userData.likedEquipment || []);
          setProfileUser(user);
        }
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!profileUser) return;
      
      const userToFetch = userId || (profileUser && profileUser._id);
      if (!userToFetch) return;
      
      try {
        const data = await fetchUserEquipment(userToFetch);
        
        if (data && data.items) {
          const guitars = [];
          const amps = [];
          const pedals = [];
          
          data.items.forEach(item => {
            const type = item.type?.toLowerCase();
            if (type === "guitar") {
              guitars.push(item);
            } else if (type === "amp") {
              amps.push(item);
            } else if (type === "pedal") {
              pedals.push(item);
            }
          });
          
          setUserEquipment({ guitars, amps, pedals });
        }
      } catch (error) {
        console.error("Error fetching user equipment:", error);
      } 
    };
    
    fetchEquipment();
  }, [profileUser, userId]);
  
  const renderEquipmentSection = (items, title, emoji) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2 flex items-center text-black dark:text-white">
          {emoji} {title} ({items.length})
        </h3>
        <EquipmentCarousel 
          items={items} 
          onClick={(id) => navigate(`/view/${id}`)}
        />
      </div>
    );
  };
  
    if (profileError || equipmentError) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mx-auto mt-6 max-w-2xl">
        <p>{profileError || equipmentError}</p>
        <NavLink
          to="/"
          className="inline-block mt-4 text-blue-500 dark:text-blue-400 hover:underline text-sm"
        >
          ⬅️ Back to Home
        </NavLink>
      </div>
    );
  }

  if (profileLoading || equipmentLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded mx-auto mt-6 max-w-2xl">
        <p>User profile not found.</p>
        <NavLink
          to="/"
          className="inline-block mt-4 text-blue-500 dark:text-blue-400 hover:underline text-sm"
        >
          ⬅️ Back to Home
        </NavLink>
      </div>
    );
  }
  
  const { username, bio, location, website, createdAt } = profileUser;
  
  const isOwnProfile = !userId || (user && profileUser && user._id === profileUser._id);
  
  return (
    <div className="max-w-screen-xl mx-auto w-full p-6 bg-white dark:bg-[#122634]">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Profile", url: "/profile" }]} />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">User Profile</h1>
        <div className="flex gap-4">
          {isOwnProfile && (
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              ✏️ Edit Profile
            </button>
          )}
          {isOwnProfile && (
            <button 
              onClick={() => {
                logout();
                navigate("/gallery");
              }} 
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 bg-transparent border-none cursor-pointer p-0 flex items-center"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24 mr-6">
            <AvatarDisplayOnly
              imageUrl={profileUser.avatarUrl}
              username={username}
              size="medium"
            />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">{username}</h2>
            <p className="text-gray-600 dark:text-gray-400 flex items-center">
              📍 {location || "No location set"}
            </p>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">About</h3>
          <p className="text-gray-700 dark:text-gray-300">{bio || "No bio available"}</p>
        </div>
        
        <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Website</h3>
          {website ? (
            <a 
              href={website.startsWith("http") ? website : `https://${website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:underline flex items-center"
            >
              🌐 {website}
            </a>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No website added</p>
          )}
        </div>

        <h3 className="text-xl font-bold mb-4 text-black dark:text-white">My Equipment</h3>
        
        {equipmentLoading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : (
          <>
            {renderEquipmentSection(userEquipment.guitars, "Guitars", "🎸")}
            {renderEquipmentSection(userEquipment.amps, "Amplifiers", "🔊")}
            {renderEquipmentSection(userEquipment.pedals, "Effects & Pedals", "🎛️")}
            
            {!userEquipment.guitars.length && !userEquipment.amps.length && !userEquipment.pedals.length && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-gray-600 dark:text-gray-400">
                <p className="text-center">No equipment added yet.</p>
              </div>
            )}
          </>
        )}

        {likedEquipment && likedEquipment.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 mt-6 text-black dark:text-white">My Liked Equipment</h3>
            <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <EquipmentCarousel 
                items={likedEquipment} 
              />
            </div>
          </>
        )}

        {userComments && userComments.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 mt-6 text-black dark:text-white">My Recent Comments</h3>
            <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <div className="space-y-4">
                {userComments.map(comment => (
                  <div key={comment._id} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <NavLink 
                        to={`/view/${comment.equipmentId._id}`}
                        className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
                      >
                        💬 { comment.equipmentId.brand } { comment.equipmentId.name }
                      </NavLink>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.date)}</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{comment.text.slice(0, 100)}{comment.text.length > 100 ? "..." : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-gray-600 dark:text-gray-400 text-sm mt-6">
          <p>🗓️ Member since {formatDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;