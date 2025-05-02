import { useState, useRef, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

function Avatar({ imageUrl, username, size = "medium", onAvatarUpdated }) {
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(imageUrl);
  const [localFile, setLocalFile] = useState(null);
  const fileInputRef = useRef(null);
  const { user, deleteAvatar } = useUserContext();

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

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const localImageUrl = URL.createObjectURL(file);
    
    // Store file for later upload
    setLocalFile({
      file,
      url: localImageUrl
    });
    
    // Update the image preview
    setImage(localImageUrl);
    
    // Notify parent component
    if (onAvatarUpdated) {
      onAvatarUpdated({
        file,
        url: localImageUrl,
        isNew: true
      });
    }
  };

  const handleClick = () => {
    if (isUploading || !fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleDeleteAvatar = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUploading) return;
    
    // If it's a local file that hasn't been uploaded yet
    if (localFile) {
      setLocalFile(null);
      setImage(null);
      if (onAvatarUpdated) {
        onAvatarUpdated(null);
      }
      return;
    }
    
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
        className={`${sizeClasses[size] || sizeClasses.medium} bg-blue-500 rounded-full flex items-center justify-center text-white overflow-hidden ${!isUploading ? "cursor-pointer" : ""}`}
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
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {!isUploading && (
          <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center text-xs py-1 opacity-0 hover:opacity-100 transition-opacity">
            Change
          </div>
        )}
      </div>
      
      {image && !isUploading && (
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