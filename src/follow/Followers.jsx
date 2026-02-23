import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useProfileData } from "../profile/useProfileData";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";

const Followers = () => {
  const { user } = useContext(UserContext);
  const { userId } = useParams();
  const [followersList, setFollowersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileUsername, setProfileUsername] = useState(null);
  const [followingIds, setFollowingIds] = useState([]);
  const { followUser, unfollowUser } = useProfileData();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFollowers = async () => {
      const targetUserId = userId || user?._id;
      if (!targetUserId) return;
      setLoading(true);
      try {
        const endpoint = userId
          ? `${API_BASE_URL}/api/users/followers?userId=${userId}`
          : `${API_BASE_URL}/api/users/followers`;
        
        const response = await fetch(endpoint, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch followers list");
        }
        
        const data = await response.json();
        setFollowersList(data.followers || []);
        setProfileUsername(data.username || (userId ? "User" : user?.username));
        setFollowingIds(user?.following?.map(u => u._id) || []);
      } catch (err) {
        setError(err.message || "Error fetching followers list");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [userId, user, API_BASE_URL]);

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
        setFollowingIds(prev => prev.filter(id => id !== targetUserId));
      } else {
        await followUser(targetUserId);
        setFollowingIds(prev => [...prev, targetUserId]);
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
            <p className="leading-relaxed">Please login to view your followers list.</p>
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
        <Breadcrumbs items={[{ label: "Followers", url: "/followers" }]} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">{profileUsername}'s Followers</h1>
      </div>

      <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : followersList.length > 0 ? (
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
                {followersList.map((follower) => (
                  <tr key={follower._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <AvatarDisplayOnly
                        imageUrl={follower.avatarUrl}
                        username={follower.username}
                        size="small"
                      />
                    </td>
                    <td className="py-3 px-4 text-white">{follower.username}</td>
                    <td className="py-3 px-4 flex gap-6">
                      <Link
                        to={`/profile/${follower._id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      >
                        View Profile
                      </Link>
                      {user && (!userId || userId === user._id) && follower._id !== user._id && (
                        <button
                          onClick={() => {
                            const isFollowing = followingIds.includes(follower._id);
                            handleFollowToggle(follower._id, isFollowing);
                          }}
                          className={`px-4 py-2 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center ${
                            followingIds.includes(follower._id)
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {followingIds.includes(follower._id) ? "Unfollow" : "Follow"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">No followers yet.</p>
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

export default Followers;