import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

function AvatarDisplayOnly({ imageUrl, username, size = "medium",  }) {
  const [image, setImage] = useState(imageUrl);
  const { user } = useUserContext();

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
      setImage(imageUrl);
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