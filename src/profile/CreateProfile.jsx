import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import Avatar from "./Avatar";
import { cloudinaryUpload } from "../cloudinaryUtils";

const CreateProfile = () => {
  const { loading: contextLoading, error, createUserProfile, clearError } = useUserContext();
  const { user } = useUserContext();
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
    website: "",
    avatarUrl: ""
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [magicLink, setMagicLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
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
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = "Username is required";
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
  
  const handleCopy = () => {
    navigator.clipboard.writeText(magicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  if (contextLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-auto mt-6 max-w-2xl">
        <p className="font-bold mb-3">🎸 Profile created successfully!</p>
        <p className="mb-4">Your profile has been generated. Please save this magic link to log in later:</p>
        
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={magicLink}
              readOnly
              className="border p-2 rounded flex-grow bg-white text-gray-800"
            />
            <button 
              onClick={handleCopy}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded flex items-center"
            >
              {copied ? "✅" : "📋"}
            </button>
          </div>
          <p className="text-sm mt-2 text-amber-700">
            ⚠️ Please save this link somewhere safe or bookmark this page. You'll need it to log in.
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center"
          >
            <span className="mr-2">🪄</span> Login Now
          </button>
        </div>
      </div>
    );
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
              <label className="block text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
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
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Location</label>
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
            <label className="block text-gray-700 mb-1">About</label>
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
            <label className="block text-gray-700 mb-1">Website</label>
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
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
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