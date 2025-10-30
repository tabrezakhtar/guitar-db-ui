import { NavLink } from "react-router-dom";
import Thumbnail from "../components/Thumbnail";

const EquipmentCarousel = ({ items, onClick, theme = "light", centered = false, cardSize = "medium" }) => {
  const containerClass = centered ? "flex gap-4 justify-center flex-wrap" : "flex gap-4 overflow-x-auto pb-4 scroll-smooth equipment-carousel";
  
  return (
    <div className="w-full bg-gray-800 p-5 rounded-lg overflow-hidden">
      <div 
        className={containerClass}
        style={!centered ? { 
          scrollbarWidth: "auto",
          scrollbarColor: "#cbd5e0 #f7fafc"
        } : {}}
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
        >
          {children}
        </div>
      );
    }
    
    return (
      <NavLink 
        to={`/view/${item._id}`}
        className={`w-full sm:w-[140px] ${widthClass} rounded-lg overflow-hidden hover:shadow-lg transition-all flex-shrink-0 ${cardBgClass}`}
      >
        {children}
      </NavLink>
    );
  };

  return (
    <CardWrapper>
      {item.images && item.images.length > 0 ? (
        <Thumbnail url={item.images[0]} alt={`${item.brand} ${item.name}`} />
      ) : (
        <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
          <img 
            src={`/${(item.__t || item.type)?.toLowerCase()}.png`}
            alt={item.__t || item.type}
            className="w-12 h-12 opacity-50"
          />
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