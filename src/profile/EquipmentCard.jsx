import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDraggable } from "react-use-draggable-scroll";
import Thumbnail from "../components/Thumbnail";
import { getCloudinaryThumbnail } from "../utils/cloudinaryUtils";
import SkeletonImage from "../components/SkeletonImage";

const EquipmentCarousel = ({ items, onClick, centered = false, cardSize = "medium" }) => {
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
    <div className="bg-[var(--color-grid-bg)] dark:bg-[var(--color-card-bg)] p-5 rounded-lg overflow-hidden">
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
          <EquipmentCard key={item._id} item={item} onClick={onClick} cardSize={cardSize} />
        ))}
      </div>
    </div>
  );
};

const EquipmentCard = ({ item, onClick, cardSize = "medium" }) => {
  
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
    const wrapperClasses = `${widthClass} rounded-lg overflow-hidden hover:shadow-lg transition-all flex-shrink-0 bg-[var(--color-card-bg)] dark:bg-[var(--color-card-dark)] border border-transparent dark:border-[var(--color-card-dark-hover)] cursor-pointer`;
    if (onClick) {
      return (
        <div 
          className={wrapperClasses}
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
        className={`w-full sm:w-[140px] ${wrapperClasses}`}
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
        <p className={`font-medium truncate text-[var(--color-text-header)] ${textSizes.primary}`}>{item.brand}</p>
        <p className={`truncate text-[var(--color-text-muted)] ${textSizes.secondary}`}>{item.name}</p>
        {item.__t && <p className={`truncate text-[var(--color-text-muted-dark)] ${textSizes.muted}`}>{item.__t}</p>}
      </div>
    </CardWrapper>
  );
};

export { EquipmentCarousel };
export default EquipmentCard;