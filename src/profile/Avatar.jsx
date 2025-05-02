import { useState, useRef, useEffect } from "react";
import { cloudinaryUpload } from "../cloudinaryUtils";
import { useUserContext } from "../context/UserContext";

function Avatar({ imageUrl, username, size = "medium", readonly = false, onAvatarUpdated }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [image, setImage] = useState(imageUrl);
  const fileInputRef = useRef(null);
  const { user, updateUserLocal, deleteAvatar } = useUserContext();

  const sizeClasses = {
    small: "w-12 h-12 text-lg",
    medium: "w-24 h-24 text-3xl",
    large: "w-32 h-32 text-4xl"
  };

  const getInitial = (name) => {
    return name && name.length > 0 ? name[0].toUpperCase() : "?";
  };

  useEffect(() => {
    if (imageUrl) {
      setImage(imageUrl);
    }
  }, [user, imageUrl]);

  const handleFileChange = async (e) => {
    if (readonly || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileObj = {
      file,
      url: URL.createObjectURL(file)
    };
    
    setIsUploading(true);
    
    try {
      const result = await cloudinaryUpload(fileObj, "user-avatars");

      updateUserLocal({ avatarUrl: result.secure_url });
      if (onAvatarUpdated) {
        onAvatarUpdated(result.secure_url);
      }

    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    if (readonly || isUploading || !fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleDeleteAvatar = async (e) => {
    e.preventDefault()
    e.stopPropagation();
    
    if (readonly || isUploading) return;
    
    try {
      const result = await deleteAvatar();
      if (result) {
        setImage(null);
        if (onAvatarUpdated) {
          onAvatarUpdated(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete avatar:", error);
    }
  };

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses[size] || sizeClasses.medium} bg-blue-500 rounded-full flex items-center justify-center text-white overflow-hidden ${!isUploading && !readonly ? "cursor-pointer" : ""}`}
        onClick={handleClick}
      >
        {image ? (
          <img 
            src={image} 
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitial(username)}</span>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-white text-xs">{uploadProgress}%</span>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading || readonly}
        />
        
        {!isUploading && !readonly && (
          <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center text-xs py-1 opacity-0 hover:opacity-100 transition-opacity">
            Change
          </div>
        )}
      </div>
      
      {!readonly && image && !isUploading && (
        <button 
          onClick={handleDeleteAvatar}
          className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-7 h-7 flex items-center justify-center"
          title="Delete avatar"
        >
          <span className="text-white text-sm">❌</span>
        </button>
      )}
    </div>
  );
}

export default Avatar;