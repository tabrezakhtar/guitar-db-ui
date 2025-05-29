import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";

function Avatar({ imageUrl, username, size = "medium", onAvatarUpdated }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [image, setImage] = useState(imageUrl);
  const [localFile, setLocalFile] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useContext(UserContext);

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
    
    setLocalFile({
      file,
      url: localImageUrl
    });
    
    setImage(localImageUrl);
    
    if (onAvatarUpdated) {
      onAvatarUpdated({
        file,
        url: localImageUrl,
        isNew: true
      });
    }
  };

  const handleClick = () => {
    if (isDeleting || !fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleDeleteAvatar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      setImage(null);
      
      if (onAvatarUpdated) {
        onAvatarUpdated({
          deleteRequested: true,
          originalUrl: image
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses[size] || sizeClasses.medium} bg-blue-500 rounded-full flex items-center justify-center text-white overflow-hidden ${!isDeleting ? "cursor-pointer" : ""}`}
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
        
        {isDeleting && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Spinner width={8} height={8} />
            <span className="ml-2 text-white text-xs">Deleting...</span>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isDeleting}
        />
        
        {!isDeleting && (
          <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center text-xs py-1 opacity-0 hover:opacity-100 transition-opacity">
            Change
          </div>
        )}
      </div>
      
      {image && !isDeleting && (
        <button 
          onClick={handleDeleteAvatar}
          className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-7 h-7 flex items-center justify-center"
          title="Delete avatar"
          disabled={isDeleting}
        >
          <span className="text-white text-sm">❌</span>
        </button>
      )}
    </div>
  );
}

export default Avatar;