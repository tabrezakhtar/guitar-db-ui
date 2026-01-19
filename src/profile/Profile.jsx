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
import Modal from "../components/Modal";
import ProfileSkeleton from "./ProfileSkeleton";

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
  const [ showLogoutModal, setShowLogoutModal ] = useState(false);
  const { user, logout } = useContext(UserContext);
  const { fetchUserEquipment, deleteComment, error: equipmentError, loading: equipmentLoading } = useContext(GuitarContext);
  const { fetchUserProfile, loading: profileLoading, error: profileError } = useProfileData();

  const navigate = useNavigate();
  
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    navigate("/gallery");
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      // Remove the deleted comment from local state
      setUserComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
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
      <div className="mb-6 bg-gray-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2 flex items-center text-white">
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
      <div className="p-6">
        <div className="flex p-5 bg-[rgba(33,172,232,0.12)] rounded-[15px] mb-6 w-full text-[#f7f9f9] font-['Nunito',sans-serif] text-[20px] font-normal">          <div className="flex-shrink-0 mr-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="font-bold mb-1">Error</p>
            <p className="leading-relaxed">{profileError || equipmentError}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <NavLink
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-semibold cursor-pointer"
              >
                ⬅️ Back to Home
              </NavLink>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center font-semibold cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileLoading || equipmentLoading) {
    return <ProfileSkeleton />;
  }

  if (!profileUser) {
    return (
      <div className="p-6">
        <div className="flex p-5 bg-[rgba(33,172,232,0.12)] rounded-[15px] mb-6 w-full text-[#f7f9f9] font-['Nunito',sans-serif] text-[20px] font-normal">
          <div className="flex-shrink-0 mr-4">
            <span className="text-2xl">🔍</span>
          </div>
          <div>
            <p className="font-bold mb-1">Not Found</p>
            <p className="leading-relaxed">User profile not found.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <NavLink
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-semibold cursor-pointer"
              >
                ⬅️ Back to Home
              </NavLink>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center font-semibold cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const { username, bio, location, website, createdAt } = profileUser;
  
  const isOwnProfile = !userId || (user && profileUser && user._id === profileUser._id);
  
  return (
    <div className="max-w-screen-xl mx-auto w-full p-6 bg-[#122634]">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Profile", url: "/profile" }]} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">User Profile</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {isOwnProfile && (
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center transition-colors"
            >
              ✏️ Edit Profile
            </button>
          )}
          {isOwnProfile && (
            <button 
              onClick={handleLogoutClick}
              className="text-blue-400 hover:text-blue-300 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
          <div className="relative w-24 h-24 mb-4 sm:mb-0 sm:mr-6">
            <AvatarDisplayOnly
              imageUrl={profileUser.avatarUrl}
              username={username}
              size="medium"
            />
          </div>
          <div className="text-center sm:text-left sm:ml-6">
            <div className="flex items-center justify-center sm:justify-start gap-1">
              <h2 className="text-2xl font-bold text-white">{username}</h2>
              {profileUser.admin && (
                <img 
                  src="/verified.svg" 
                  alt="Verified" 
                  className="w-5 h-5"
                />
              )}
            </div>
            <p className="text-gray-400 flex items-center justify-center sm:justify-start">
              📍 {location || "No location set"}
            </p>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-white">About</h3>
          <p className="text-gray-300">{bio || "No bio available"}</p>
        </div>
        
        <div className="mb-6 bg-gray-700 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Website</h3>
          {website ? (
            <a 
              href={website.startsWith("http") ? website : `https://${website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center"
            >
              🌐 {website}
            </a>
          ) : (
            <p className="text-gray-400">No website added</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-xl font-bold text-white">My Equipment</h3>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center transition-colors cursor-pointer w-full sm:w-auto"
            >
              ➕ Add Equipment
            </button>
          )}
        </div>
        
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
              <div className="bg-gray-700 p-4 rounded-md text-gray-400">
                <p className="text-center">No equipment added yet.</p>
              </div>
            )}
          </>
        )}

        {likedEquipment && likedEquipment.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 mt-6 text-white">My Liked Equipment</h3>
            <div className="mb-6 bg-gray-700 p-4 rounded-md">
              <EquipmentCarousel 
                items={likedEquipment} 
              />
            </div>
          </>
        )}

        {userComments && userComments.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 mt-6 text-white">My Recent Comments</h3>
            <div className="mb-6 bg-gray-700 p-4 rounded-md">
              <div className="space-y-4">
                {userComments.map(comment => (
                  <div key={comment._id} className="bg-gray-800 p-3 rounded-md shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <NavLink 
                        to={`/view/${comment.equipmentId._id}`}
                        className="text-blue-400 hover:underline text-sm"
                      >
                        💬 { comment.equipmentId.brand } { comment.equipmentId.name }
                      </NavLink>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">{formatDate(comment.date)}</p>
                        {isOwnProfile && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap break-words">{comment.text.slice(0, 100)}{comment.text.length > 100 ? "..." : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div className="bg-gray-700 p-4 rounded-md text-gray-400 text-sm mt-6">
          <p>🗓️ Member since {formatDate(createdAt)}</p>
        </div>
      </div>

      {showLogoutModal && (
        <Modal
          message="Are you sure you want to logout?"
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  );
};

export default Profile;