import { Link } from "react-router-dom";
import { EquipmentCarousel } from "../profile/EquipmentCard";
import Spinner from "../components/Spinner";

function EquipmentSections({ recentEquipment, popularEquipment, loading, isVisible, isMobile }) {
  const renderEquipmentSection = (items, title, emoji, linkTo, delay = 0) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className={`mb-8 fade-in-bounce delay-${delay} ${isVisible ? 'visible' : ''}`}>
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center justify-center">
            {emoji} {title}
          </h3>
        </div>
        <div className="rounded-lg p-4 flex justify-center">
          <EquipmentCarousel 
            items={items.slice(0, 5)} 
            theme="dark"
            cardSize="medium"
            centered={!isMobile}
          />
        </div>
        <div className="mt-4 text-center">
          <Link 
            to={linkTo} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="py-16">
      {loading ? (
        <div className={`flex justify-center items-center py-16 fade-in-bounce delay-500 ${isVisible ? 'visible' : ''}`}>
          <Spinner />
        </div>
      ) : (
        <>
          {renderEquipmentSection(
            recentEquipment, 
            "See what's new", 
            "", 
            "/gallery?sort=date&order=desc",
            600
          )}
          
          {renderEquipmentSection(
            popularEquipment, 
            "Most popular gear", 
            "", 
            "/gallery?sort=likesCount&order=desc",
            700
          )}
        </>
      )}
    </div>
  );
}

export default EquipmentSections;