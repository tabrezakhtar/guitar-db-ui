import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

const EditProfile = () => {
  const { user, loading, error, updateUserProfile, clearError } = useUserContext();
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
    website: ""
  });
  
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    clearError();
    
    // Fill the form with user data if available
    if (user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || ""
      });
    }
  }, [user]);
  
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
    
    const result = await updateUserProfile(formData);
    
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="max-w-screen-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      
      {renderErrorMessage(error)}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">🎸 Profile updated successfully!</p>
          <p>Your profile has been updated.</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
              {formData.username.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="ml-6 flex-1">
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
                  Updating...
                </span>
              ) : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;