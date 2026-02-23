import { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useProfileData } from "../profile/useProfileData";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";

const Following = () => {  const { user } = useContext(UserContext);
  const { userId } = useParams();
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileUsername, setProfileUsername] = useState(null);
  const { followUser, unfollowUser } = useProfileData();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFollowing = async () => {
      const targetUserId = userId || user?._id;
      if (!targetUserId) return;
      setLoading(true);
      try {
        const endpoint = userId
          ? `${API_BASE_URL}/api/users/following?userId=${userId}`
          : `${API_BASE_URL}/api/users/following`;
        
        const response = await fetch(endpoint, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch following list");
        }

        const data = await response.json();
        setFollowingList(data.following || []);
        setProfileUsername(data.username || (userId ? "User" : user?.username));
      } catch (err) {
        setError(err.message || "Error fetching following list");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [userId, user, API_BASE_URL]);

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
        setFollowingList(prev => prev.filter(u => u._id !== targetUserId));
      } else {
        await followUser(targetUserId);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  if (!userId && !user) {
    return (
      <div className="p-6">
        <div className="flex p-5 bg-[var(--color-card-bg)] rounded-[15px] mb-6 w-full text-[#f7f9f9] font-['Nunito',sans-serif] text-[20px] font-normal">
          <div className="flex-shrink-0 mr-4">
            <span className="text-2xl">🔒</span>
          </div>
          <div>
            <p className="font-bold mb-1">Login Required</p>
            <p className="leading-relaxed">Please login to view your following list.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-semibold cursor-pointer"
              >
                ⬅️ Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex p-5 bg-[var(--color-card-bg)] rounded-[15px] mb-6 w-full text-[#f7f9f9] font-['Nunito',sans-serif] text-[20px] font-normal">
          <div className="flex-shrink-0 mr-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="font-bold mb-1">Error</p>
            <p className="leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                to="/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-semibold cursor-pointer"
              >
                ⬅️ Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full p-6 bg-[var(--color-main-bg)]">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Following", url: "/following" }]} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">{profileUsername} Follows</h1>
      </div>

      <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : followingList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Avatar</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Username</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {followingList.map((followingUser) => (
                  <tr key={followingUser._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <AvatarDisplayOnly
                        imageUrl={followingUser.avatarUrl}
                        username={followingUser.username}
                        size="small"
                      />
                    </td>
                    <td className="py-3 px-4 text-white">{followingUser.username}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex justify-center gap-6">
                        <Link
                          to={`/profile/${followingUser._id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                        >
                          View Profile
                        </Link>

                        {user && (!userId || userId === user._id) && followingUser._id !== user._id && (
                          <button
                            onClick={() => handleFollowToggle(followingUser._id, true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          >
                            Unfollow
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No users being followed yet.</p>
            <Link
              to="/gallery"
              className="mt-4 inline-flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              Explore Gallery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;