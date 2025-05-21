import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import Avatar from "./Avatar";
import { cloudinaryUpload } from "../cloudinaryUtils";
import MagicLinkSuccess from "../components/MagicLinkSuccess";
import Spinner from "../components/Spinner";

const CreateProfile = () => {
  const { loading: contextLoading, error, createUserProfile, clearError } = useUserContext();
  const { user } = useUserContext();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    avatarUrl: ""
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [magicLink, setMagicLink] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        location: user.location || "",
        website: user.website || ""
      });
    }
  }, [user]);
  
  useEffect(() => {
    clearError();
  }, []);
  
  const handleAvatarChange = (newAvatar) => {
    if (newAvatar === null) {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: ""
      }));
      setAvatarFile(null);
      return;
    }
    
    if (newAvatar.deleteRequested) {
      setAvatarFile(null);
      setFormData((prev) => ({
        ...prev,
        avatarUrl: ""
      }));
      return;
    }
    
    if (newAvatar.isNew) {
      setAvatarFile(newAvatar);
      setFormData((prev) => ({
        ...prev,
        avatarUrl: newAvatar.url
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: newAvatar
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === "username" && value.trim()) {
      setValidationErrors(prev => ({
      ...prev,
      username: null
      }));
    }

    if (name === "email" && value.trim()) {
      setValidationErrors(prev => ({
      ...prev,
      email: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let updatedFormData = { ...formData };
      
      if (avatarFile && avatarFile.isNew) {
        try {
          const result = await cloudinaryUpload(
            { file: avatarFile.file, url: avatarFile.url }, 
            "user-avatars"
          );
          
          if (!result.success && result.error) {
            throw new Error(result.error || "Failed to upload avatar");
          }
          
          updatedFormData.avatarUrl = result.secure_url;
        } catch (err) {
          console.error("Avatar upload failed:", err);
        }
      }
      
      const result = await createUserProfile(updatedFormData);
      
      if (result) {
        setSuccess(true);
        setMagicLink(result.magicLink);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (magicLink) {
      const fullUrl = magicLink.startsWith("http") 
        ? magicLink 
        : `http://${magicLink}`;
      window.location.href = fullUrl;
    }
  };
  
  if (contextLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }
  
  if (success) {
    return <MagicLinkSuccess magicLink={magicLink} onLogin={handleLogin} />;
  }

  const renderErrorMessage = (errorMsg) => {
    if (!errorMsg) return null;
    
    if (typeof errorMsg === "string") {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{errorMsg}</p>
        </div>
      );
    }
    
    if (Array.isArray(errorMsg)) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Errors</p>
          <ul className="list-disc pl-5">
            {errorMsg.map((err, index) => (
              <li key={index}>{err.msg || err.message || JSON.stringify(err)}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    if (typeof errorMsg === "object") {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{errorMsg.message || JSON.stringify(errorMsg)}</p>
        </div>
      );
    }
    
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">Error</p>
        <p>An unexpected error occurred</p>
      </div>
    );
  };
  
  return (
    <div className="max-w-screen-md w-full mx-auto p-6 md:min-w-[768px]">
      <h1 className="text-2xl font-bold mb-6">Create Your Profile</h1>
      
      {renderErrorMessage(error)}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex justify-center">
              <Avatar
                imageUrl={formData.avatarUrl}
                username={formData.username}
                size="large"
                onAvatarUpdated={handleAvatarChange}
              />
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              Click to add a profile picture
            </p>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Username: <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`border p-2 rounded w-full ${validationErrors.username ? "border-red-500" : ""}`}
                placeholder="Enter your username"
              />
              {validationErrors.username && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
              )}
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Email: <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`border p-2 rounded w-full ${validationErrors.email ? "border-red-500" : ""}`}
                placeholder="Enter your username"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Enter your location"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">About:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="border p-2 rounded w-full"
              placeholder="Tell us about yourself"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Website:</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Enter your website URL"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <Spinner width={4} height={4} />
                  Creating...
                </span>
              ) : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;