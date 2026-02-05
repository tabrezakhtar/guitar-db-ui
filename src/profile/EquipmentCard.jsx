import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDraggable } from "react-use-draggable-scroll";
import Thumbnail from "../components/Thumbnail";
import { getCloudinaryThumbnail } from "../utils/cloudinaryUtils";
import SkeletonImage from "../components/SkeletonImage";

const EquipmentCarousel = ({ items, onClick, theme = "light", centered = false, cardSize = "medium" }) => {
  const ref = useRef();
  const { events } = useDraggable(ref);
  
  const containerClass = centered ? "flex gap-4 justify-center flex-wrap" : "flex gap-4 overflow-x-auto pb-4";
  
  const scrollContainerStyle = !centered ? {
    cursor: "grab",
    userSelect: "none",
    scrollbarWidth: "thin",
    scrollbarColor: "#4B5563 #1F2937"
  } : {};
  
  return (
    <div className="bg-gray-800 p-5 rounded-lg overflow-hidden">
      <style>
        {`
          .equipment-scroll-container::-webkit-scrollbar {
            height: 8px;
          }
          .equipment-scroll-container::-webkit-scrollbar-track {
            background: #1F2937;
            border-radius: 4px;
          }
          .equipment-scroll-container::-webkit-scrollbar-thumb {
            background: #4B5563;
            border-radius: 4px;
          }
          .equipment-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
          }
        `}
      </style>
      <div 
        ref={ref}
        {...(!centered ? events : {})}
        className={`${containerClass} ${!centered ? "equipment-scroll-container" : ""}`}
        style={scrollContainerStyle}
      >
        {items.map(item => (
          <EquipmentCard key={item._id} item={item} onClick={onClick} theme={theme} cardSize={cardSize} />
        ))}
      </div>
    </div>
  );
};

const EquipmentCard = ({ item, onClick, theme = "light", cardSize = "medium" }) => {
  const isDark = theme === "dark";
  const cardBgClass = isDark ? "bg-gray-700 border-gray-600" : "bg-white border";
  const textPrimaryClass = isDark ? "text-white" : "text-black";
  const textSecondaryClass = isDark ? "text-gray-300" : "text-black";
  const textMutedClass = isDark ? "text-gray-400" : "text-gray-500";
  
  // Card size classes
  const sizeClasses = {
    small: "w-[120px]",
    medium: "w-[140px]",
    large: "w-[180px]",
    full: "w-full"
  };
  
  const textSizeClasses = {
    small: { primary: "text-xs", secondary: "text-xs", muted: "text-xs" },
    medium: { primary: "text-sm", secondary: "text-xs", muted: "text-xs" },
    large: { primary: "text-base", secondary: "text-sm", muted: "text-sm" }
  };
  
  const paddingClass = cardSize === "large" ? "p-3" : "p-2";
  const widthClass = sizeClasses[cardSize] || sizeClasses.medium;
  const textSizes = textSizeClasses[cardSize] || textSizeClasses.medium;

  const CardWrapper = ({ children }) => {
    if (onClick) {
      return (
        <div 
          className={`${widthClass} rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all flex-shrink-0 ${cardBgClass}`}
          onClick={() => onClick(item._id)}
          onDragStart={(e) => e.preventDefault()}
        >
          {children}
        </div>
      );
    }
    
    return (
      <NavLink 
        to={`/view/${item._id}`}
        className={`w-full sm:w-[140px] ${widthClass} rounded-lg overflow-hidden hover:shadow-lg transition-all flex-shrink-0 ${cardBgClass}`}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </NavLink>
    );
  };  return (
    <CardWrapper>
      {item.images && item.images.length > 0 ? (
        <Thumbnail url={getCloudinaryThumbnail(item.images[0], 200)} alt={`${item.brand} ${item.name}`} draggable={false} />
      ) : (
        <div className="w-full aspect-square">
          <SkeletonImage />
        </div>
      )}
      <div className={paddingClass}>
        <p className={`font-medium truncate ${textPrimaryClass} ${textSizes.primary}`}>{item.brand}</p>
        <p className={`truncate ${textSecondaryClass} ${textSizes.secondary}`}>{item.name}</p>
        {item.__t && <p className={`truncate ${textMutedClass} ${textSizes.muted}`}>{item.__t}</p>}
      </div>
    </CardWrapper>
  );
};

export { EquipmentCarousel };
export default EquipmentCard;