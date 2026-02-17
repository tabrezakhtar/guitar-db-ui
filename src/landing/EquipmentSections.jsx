import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { EquipmentCarousel } from "../profile/EquipmentCard";
import Spinner from "../components/Spinner";

function EquipmentSections({ recentEquipment, popularEquipment, loading, isVisible, isMobile }) {
  const shouldReduceMotion = useReducedMotion();
  const renderEquipmentSection = (items, title, emoji, linkTo, delay = 0) => {
    if (!items || items.length === 0) return null;
    
    return (
      <motion.div
        className="mb-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.34, 1.56, 0.64, 1], delay: shouldReduceMotion ? 0 : delay / 1000 }}
      >
        <div>
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
      </motion.div>
    );
  };

  return (
    <div className="">
      {loading ? (
        <motion.div
          className="flex justify-center items-center py-16"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.34, 1.56, 0.64, 1], delay: shouldReduceMotion ? 0 : 0.5 }}
        >
          <Spinner />
        </motion.div>
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