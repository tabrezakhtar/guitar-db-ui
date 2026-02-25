import { useEffect, useState, useContext } from "react";
import { useParams, NavLink, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { GuitarContext } from "../context/GuitarContext";
import { useProfileData } from "./useProfileData";
import { formatDate, getTimeFromNow } from "../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import AvatarDisplayOnly from "./AvatarDisplayOnly";
import { EquipmentCarousel } from "./EquipmentCard";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";
import ProfileSkeleton from "./ProfileSkeleton";
import YouTubeGrid from "./YouTubeGrid";import Share from "./Share";
import { hasAdminAccess } from "../utils/roleUtils";

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
  const [ expandedComments, setExpandedComments ] = useState(false);
  const { user, logout } = useContext(UserContext);
  const { fetchUserEquipment, deleteComment, error: equipmentError, loading: equipmentLoading } = useContext(GuitarContext);
  const { fetchUserProfile, loading: profileLoading, error: profileError, followUser, unfollowUser } = useProfileData();

  const navigate = useNavigate();
  
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const testyoutube = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/youtube/channel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: "https://www.youtube.com/@andertons" })
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
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
      setUserComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !profileUser) return;
    
    const isFollowing = profileUser.followers?.some(follower => follower._id === user._id);
    
    if (isFollowing) {
      const result = await unfollowUser(profileUser._id);
      if (result) {
        setProfileUser(prev => ({
          ...prev,
          followers: prev.followers.filter(follower => follower._id !== user._id)
        }));
      }
    } else {
      const result = await followUser(profileUser._id);
      if (result) {
        setProfileUser(prev => ({
          ...prev,
          followers: [...(prev.followers || []), { _id: user._id, username: user.username }]
        }));
      }
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
        if (user) {
          const userData = await fetchUserProfile(user._id);
          if (userData) {
            setUserComments(userData.comments || []);
            setLikedEquipment(userData.likedEquipment || []);
            setProfileUser(userData.user);
          }
        }
      }
    };
    fetchData();
  }, [user, userId]);

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
  }, [profileUser?._id, userId]);
  
  const renderEquipmentSection = (items, title, emoji) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-6 bg-[var(--color-grid-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2 flex items-center text-[var(--color-text-header)]">
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
        <div className="flex p-5 bg-[var(--color-card-bg)] rounded-[15px] mb-6 w-full text-[#f7f9f9] font-['Nunito',sans-serif] text-[20px] font-normal">          <div className="flex-shrink-0 mr-4">
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
        <div className="flex p-5 bg-[var(--color-card-bg)] rounded-[15px] mb-6 w-full text-[#f7f9f9] font-['Nunito',sans-serif] text-[20px] font-normal">
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
    <div className="max-w-screen-xl mx-auto w-full p-6 bg-[var(--color-main-bg)]">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Profile", url: "/profile" }]} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-header)]">User Profile</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {isOwnProfile && (
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center transition-colors cursor-pointer"
            >
              ✏️ Edit Profile
            </button>
          )}
          <Share userId={profileUser._id} username={profileUser.username} />
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

      <div className="bg-[var(--color-panel-bg)] rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <AvatarDisplayOnly
                imageUrl={profileUser.avatarUrl}
                username={username}
                size="medium"
              />
            </div>
          </div>
          <div className="text-center sm:text-left sm:ml-6">
            <div className="flex items-center justify-center sm:justify-start gap-1">
              <h2 className="text-2xl font-bold text-[var(--color-text-header)]">{username}</h2>
              {hasAdminAccess(profileUser) && (
                <img 
                  src="/verified.svg" 
                  alt="Verified" 
                  className="w-5 h-5"
                />
              )}
            </div>
            <p className="text-[var(--color-text-muted)] flex items-center justify-center sm:justify-start">
              📍 {location || "No location set"}
            </p>
            <div className="flex justify-center sm:justify-start gap-4 mt-2">
              <Link to={`/following/${userId || user?._id}`} className="flex gap-2 text-blue-500 hover:text-blue-400 transition-colors cursor-pointer underline">
                <span className="font-bold">{profileUser.following?.length} Following</span>
                {/* <span>Following</span> */}
              </Link>
              <Link to={`/followers/${userId || user?._id}`} className="flex gap-2 text-blue-500 hover:text-blue-400 transition-colors cursor-pointer underline">
                <span className="font-bold">{profileUser.followers?.length} Followers</span>
                {/* <span>Followers</span> */}
              </Link>
            </div>
            {user && !isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                className={`cursor-pointer gap-2 mt-2 px-4 py-2 rounded text-white transition-colors ${
                  profileUser.followers?.some(follower => follower._id === user._id)
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {profileUser.followers?.some(follower => follower._id === user._id) ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
        
        <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-header)]">About</h3>
          <p className="text-[var(--color-text-muted)]">{bio || "No bio available"}</p>
        </div>
        
        <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-header)]">Website</h3>
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
            <p className="text-[var(--color-text-muted)]">No website added</p>
          )}
        </div>
        { (profileUser.youtubeChannelHandle || profileUser.youtubeChannelId) && (
          <YouTubeGrid
            userId={profileUser._id}
            handle={profileUser.youtubeChannelHandle}
            avatar={profileUser.youtubeChannelAvatar || profileUser.avatarUrl}
            channelId={profileUser.youtubeChannelId}
            maxResults={12}
          />
        )}
        {/* <div className="mb-6">
          <button
            onClick={testyoutube}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center transition-colors"
          >
            ▶️ Test YouTube
          </button>
        </div> */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-xl font-bold text-[var(--color-text-header)]">My Equipment</h3>
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
              <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md text-[var(--color-text-muted)]">
                <p className="text-center">No equipment added yet.</p>
              </div>
            )}
          </>
        )}

        {likedEquipment && likedEquipment.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 mt-6 text-[var(--color-text-header)]">My Liked Equipment</h3>
            <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] rounded-sm">
              <EquipmentCarousel 
                items={likedEquipment}
              />
            </div>
          </>
        )}

        {userComments && userComments.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 mt-6 text-[var(--color-text-header)]">My Recent Comments</h3>
            <div className="mb-6 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
              <div className="space-y-4">
                {(expandedComments ? userComments : userComments.slice(0, 5)).map(comment => (
                  <div key={comment._id} className="bg-[var(--color-card-bg)] dark:bg-[var(--color-card-dark)] rounded-lg p-4 border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] shadow-sm">
                    <div className="flex">
                      <div className="mr-3 self-center">
                        <AvatarDisplayOnly imageUrl={comment.user?.avatarUrl} username={comment.user?.username} size="xsmall" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1">
                            <NavLink 
                              to={`/profile/${comment.user?._id}`}
                              className="font-medium text-[var(--color-text-header)] hover:text-blue-400 transition-colors"
                            >
                              {comment.user?.username?.substring(0, 32)}
                            </NavLink>
                            {hasAdminAccess(comment.user) && (
                              <img 
                                src="/verified.svg" 
                                alt="Verified" 
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--color-text-muted)]" title={formatDate(comment.date)}>{getTimeFromNow(comment.date)}</span>
                            {user && user._id === comment.user?._id && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="bg-red-600 hover:bg-red-700 text-[var(--color-text)] text-xs px-2 py-1 rounded transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[var(--color-text-header)] leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {userComments.length > 5 && (
                <button 
                  className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
                  onClick={() => setExpandedComments(!expandedComments)}
                >
                  {expandedComments ? "Show Less" : `Show All (${userComments.length}) Comments`} 
                </button>
              )}
            </div>
          </>
        )}
        
        <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md text-[var(--color-text-muted)] text-sm mt-6">
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