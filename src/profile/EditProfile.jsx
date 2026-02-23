import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useProfileData } from "./useProfileData";
import { cloudinaryUpload } from "../utils/cloudinaryUtils";
import Avatar from "./Avatar";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUserLocal } = useContext(UserContext);
  const { updateUserProfile, deleteAvatar, deleteProfile, loading: profileLoading, error: profileError } = useProfileData();
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
    location: "",
    website: "",
    youtubeChannelUrl: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        location: user.location || "",
        website: user.website || "",
        youtubeChannelUrl: user.youtubeChannelUrl || ""
      });
      setOriginalAvatarUrl(user.avatarUrl || "");
      setYoutubeInput(user.youtubeChannelUrl || "");
    }
  }, [user]);

  const handleAvatarChange = (newAvatar) => {
    if (newAvatar === null) {
      setProfile((prev) => ({
        ...prev,
        avatarUrl: ""
      }));
      setAvatarFile(null);
      return;
    }
    
    if (newAvatar.deleteRequested) {
      setAvatarDeleted(true);
      setAvatarFile(null);
      setProfile((prev) => ({
        ...prev,
        avatarUrl: ""
      }));
      return;
    }
    
    if (newAvatar.isNew) {
      setAvatarFile(newAvatar);
      setAvatarDeleted(false);
      setProfile((prev) => ({
        ...prev,
        avatarUrl: newAvatar.url
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        avatarUrl: newAvatar
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  function extractChannelIdOrHandleLocal(input) {
    if (!input) return null;
    const value = String(input).trim();

    const isChannelId = (str) => /^UC[A-Za-z0-9_-]{22}$/.test(str);
    const isHandle = (str) => /^[A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9]$/.test(str) && !/\.{2,}/.test(str);

    if (/^https?:\/\/(www\.)?youtube\.com/.test(value)) {
      const handleMatch = value.match(/youtube\.com\/@([A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9])(?:[/?#]|$)/);
      if (handleMatch) return { type: "handle", value: handleMatch[1] };

      const channelMatch = value.match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})(?:[/?#]|$)/);
      if (channelMatch) return { type: "id", value: channelMatch[1] };

      const customMatch = value.match(/youtube\.com\/c\/([A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9])(?:[/?#]|$)/);
      if (customMatch) return { type: "handle", value: customMatch[1] };

      const userMatch = value.match(/youtube\.com\/user\/([A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9])(?:[/?#]|$)/);
      if (userMatch) return { type: "handle", value: userMatch[1] };

      return null;
    }

    const cleaned = value.replace(/^@/, "");
    if (isChannelId(cleaned)) return { type: "id", value: cleaned };
    if (isHandle(cleaned)) return { type: "handle", value: cleaned };

    return null;
  }

  const handleYoutubeKeyUp = (e) => {
    const value = e.target.value || "";
    if (value.trim() === "") {
      setYoutubeError("");
      handleChange({ target: { name: "youtubeChannelUrl", value: "" } });
      return;
    }
    const parsed = extractChannelIdOrHandleLocal(value);
    if (parsed) {
      setYoutubeError("");
      handleChange({ target: { name: "youtubeChannelUrl", value } });
    } else {
      setYoutubeError("Invalid YouTube URL or handle");
    }
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let updatedProfile = { ...profile };
      
      if (avatarDeleted && originalAvatarUrl) {
        const result = await deleteAvatar(user);
        if (result) {
          updateUserLocal(result.user);
        }
        updatedProfile.avatarUrl = "";
      } else if (avatarFile && avatarFile.isNew) {
        const result = await cloudinaryUpload(
          { file: avatarFile.file, url: avatarFile.url }, 
          "user-avatars"
        );
        
        if (!result.success && result.error) {
          throw new Error(result.error || "Failed to upload avatar");
        }
        
        updatedProfile.avatarUrl = result.secure_url;
      }
      
      const result = await updateUserProfile(updatedProfile, user);
      if (result) {
        updateUserLocal(result.user);
      }
      
      setAvatarFile(null);
      setAvatarDeleted(false);
      setOriginalAvatarUrl(updatedProfile.avatarUrl);
      
      setSuccess(true);
    } catch (err) {
      setError(profileError || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteProfile = async () => {
    setDeleteLoading(true);
    setError(null);
    
    try {
      const result = await deleteProfile(user);      
      if (result) {
        // Clear user state and redirect
        updateUserLocal(null);
        setShowDeleteModal(false);
        window.location.href = "/gallery";
      }
    } catch (err) {
      setError(profileError || err.message || "Failed to delete profile");
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-screen-md w-full mx-auto p-6 md:min-w-[768px] bg-[var(--color-main-bg)] min-h-screen">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Edit Profile", url: "/edit-profile" }]} />
      </div>
      <h1 className="text-2xl font-bold mb-6 text-white">Edit Profile</h1>
      
      {success && (
        <div className="bg-green-900/30 border border-green-600 text-green-400 px-4 py-3 rounded mb-6">
          Profile updated successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-center">
            <Avatar
              imageUrl={profile.avatarUrl}
              username={profile.username}
              size="large"
              onAvatarUpdated={handleAvatarChange}
            />
          </div>
          <p className="text-sm text-gray-400 text-center mt-2">
            Click on the avatar to change your profile picture
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-300 mb-2">Username: <span className="text-red-400">*</span></label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-300 mb-2">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="website" className="block text-gray-300 mb-2">Website:</label>
          <input
            type="text"
            id="website"
            name="website"
            value={profile.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="youtube" className="block text-gray-300 mb-2">YouTube:</label>
          <div className={`flex items-center gap-3 px-3 py-2 rounded-md bg-gray-700 ${youtubeError ? "border border-red-600" : "border border-gray-600"}`}>
            <img src="/icons/youtube_icon.png" alt="YouTube" className="w-6 h-6 flex-shrink-0" />
            <input
              type="text"
              id="youtube"
              name="youtubeChannelUrl"
              placeholder="Paste in your YouTube URL or @handle"
              value={youtubeInput}
              onChange={(ev) => setYoutubeInput(ev.target.value)}
              onKeyUp={handleYoutubeKeyUp}
              aria-invalid={youtubeError ? "true" : "false"}
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>
          {youtubeError && (
            <p className="mt-1 text-sm text-red-400">
              {youtubeError}
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-300 mb-2">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
          />
        </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="order-2 sm:order-1">
            <button 
              type="button" 
              onClick={handleDeleteProfile}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 w-full sm:w-auto cursor-pointer"
            >
              Delete Profile
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 order-1 sm:order-2">
            <button 
              type="button" 
              onClick={() => navigate("/profile")}
              className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
            >
              Close
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>

      {showDeleteModal && (
        <Modal
          message={
            deleteLoading ? (
              <div className="text-center max-w-md mx-auto">
                <div className="text-red-400 text-6xl mb-6">🗑️</div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Deleting Your Profile...
                </h3>
                <p className="text-gray-300 mb-6 text-lg">
                  Please wait while we permanently delete your profile, images, and all equipment data.
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-300 border-t-red-400"></div>
                  </div>
                  <p className="text-sm text-gray-400 animate-pulse">
                    This may take a few moments...
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Are you sure you want to delete your profile?
                </h3>
                <p className="text-gray-300 mb-2">
                  This action will permanently delete your profile, all your uploaded images, and all your equipment data.
                </p>
                <p className="text-red-400 font-semibold">
                  This cannot be undone.
                </p>
              </div>
            )
          }
          onConfirm={deleteLoading ? undefined : confirmDeleteProfile}
          onCancel={deleteLoading ? undefined : () => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default EditProfile;