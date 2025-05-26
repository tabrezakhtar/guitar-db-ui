import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { cloudinaryUpload } from "../cloudinaryUtils";
import Avatar from "./Avatar";
import Breadcrumbs from "../components/Breadcrumbs";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, deleteAvatar } = useContext(UserContext);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatarUrl: "",
    location: "",
    website: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        location: user.location || "",
        website: user.website || ""
      });
      setOriginalAvatarUrl(user.avatarUrl || "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let updatedProfile = { ...profile };
      
      if (avatarDeleted && originalAvatarUrl) {
        await deleteAvatar();
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
      
      await updateUserProfile(updatedProfile);
      
      setAvatarFile(null);
      setAvatarDeleted(false);
      setOriginalAvatarUrl(updatedProfile.avatarUrl);
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md w-full mx-auto p-6 md:min-w-[768px]">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: "Edit Profile", url: "/edit-profile" }]} />
      </div>
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Profile updated successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-center">
            <Avatar
              imageUrl={profile.avatarUrl}
              username={profile.username}
              size="large"
              onAvatarUpdated={handleAvatarChange}
            />
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Click on the avatar to change your profile picture
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">Username: <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 mb-2">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="website" className="block text-gray-700 mb-2">Website:</label>
          <input
            type="text"
            id="website"
            name="website"
            value={profile.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="bio" className="block text-gray-700 mb-2">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate("/profile")}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;