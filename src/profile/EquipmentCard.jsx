import { NavLink } from "react-router-dom";
import Thumbnail from "../Thumbnail";

const EquipmentCarousel = ({ items, onClick }) => {
  return (
    <div className="w-full">
      <div 
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth equipment-carousel"
        style={{ 
          scrollbarWidth: "auto",
          scrollbarColor: "#cbd5e0 #f7fafc"
        }}
      >
        {items.map(item => (
          <EquipmentCard key={item._id} item={item} onClick={onClick} />
        ))}
      </div>
    </div>
  );
};

const EquipmentCard = ({ item, onClick }) => {
  const CardWrapper = ({ children }) => {
    if (onClick) {
      return (
        <div 
          className="w-[140px] border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all bg-white flex-shrink-0"
          onClick={() => onClick(item._id)}
        >
          {children}
        </div>
      );
    }
    
    return (
      <NavLink 
        to={`/view/${item._id}`}
        className="w-[140px] border rounded-lg overflow-hidden hover:shadow-lg transition-all bg-white flex-shrink-0"
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
      <div className="p-2">
        <p className="font-medium text-sm truncate">{item.brand}</p>
        <p className="text-xs truncate">{item.name}</p>
        {item.__t && <p className="text-xs text-gray-500 truncate">{item.__t}</p>}
      </div>
    </CardWrapper>
  );
};

export { EquipmentCarousel };
export default EquipmentCard;