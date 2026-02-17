import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

const optimizeCloudinaryAvatar = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return url;
  
  const before = url.substring(0, uploadIndex + 8);
  const after = url.substring(uploadIndex + 8);
  
  return `${before}w_150,h_150,c_fill,g_auto,q_auto,f_auto/${after}`;
};

function AvatarDisplayOnly({ imageUrl, username, size = "medium",  }) {
  const [image, setImage] = useState(optimizeCloudinaryAvatar(imageUrl));
  const { user } = useContext(UserContext);

  const sizeClasses = {
    xsmall: "w-8 h-8 text-sm",
    small: "w-12 h-12 text-lg",
    medium: "w-24 h-24 text-3xl",
    large: "w-32 h-32 text-4xl"
  };

  const getInitial = (name) => {
    return name && name.length > 0 ? name[0].toUpperCase() : "?";
  };

  useEffect(() => {
    if (imageUrl) {
      setImage(optimizeCloudinaryAvatar(imageUrl));
    }
  }, [user, imageUrl]);

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses[size] || sizeClasses.medium} bg-blue-500 rounded-full flex items-center justify-center text-white overflow-hidden`}>
        {image ? (
          <img 
            src={image} 
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitial(username)}</span>
        )}
      </div>
    </div>
  );
};

export default AvatarDisplayOnly;