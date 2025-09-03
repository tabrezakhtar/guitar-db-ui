import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHeader } from "./context/HeaderContext";
import { EquipmentCarousel } from "./profile/EquipmentCard";
import Spinner from "./components/Spinner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Landing() {
  const { hideHeader, displayHeader } = useHeader();
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [popularEquipment, setPopularEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    hideHeader();
    
    // Load parallax background script
    const script = document.createElement("script");
    script.src = "/src/lib/parallax-bg.js";
    script.onload = () => {
      // Initialize parallax background after script loads
      const parallaxInstance = window.ParallaxBackground.init({
        zIndex: -1,
        speeds: [200, 250, 180, 120]
      });
    };
    document.head.appendChild(script);
    
    // Trigger animations after a short delay
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => {
      displayHeader();
      // Clean up parallax background when component unmounts
      const container = document.querySelector(".parallax-bg-container");
      const styles = document.getElementById("parallax-bg-styles");
      if (container) container.remove();
      if (styles) styles.remove();
      // Remove script
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [hideHeader, displayHeader]);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        // Fetch recent equipment (last 5, sorted by date)
        const recentResponse = await fetch(`${BASE_URL}/api/equipment/list?page=1&limit=5&sortBy=date&sortOrder=desc`);
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentEquipment(recentData.items || []);
        }

        // Fetch popular equipment (sorted by likes count)
        const popularResponse = await fetch(`${BASE_URL}/api/equipment/list?page=1&limit=5&sortBy=likesCount&sortOrder=desc`);
        if (popularResponse.ok) {
          const popularData = await popularResponse.json();
          setPopularEquipment(popularData.items || []);
        }
      } catch (error) {
        console.error("Error fetching landing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const renderEquipmentSection = (items, title, emoji, linkTo, delay = 0) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className={`mb-8 fade-in-bounce delay-${delay} ${isVisible ? 'visible' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center">
            {emoji} {title}
          </h3>
          <Link 
            to={linkTo} 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <EquipmentCarousel 
            items={items.slice(0, 5)} 
            theme="dark"
            centered={true}
            cardSize="large"
          />
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">      <style jsx>{`
        .fade-in-bounce {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .fade-in-bounce.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .fade-in {
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }
        
        .fade-in.visible {
          opacity: 1;
        }
        
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }
        .delay-500 { transition-delay: 0.5s; }
        .delay-600 { transition-delay: 0.6s; }
        .delay-700 { transition-delay: 0.7s; }
        .delay-800 { transition-delay: 0.8s; }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className={`mb-8 fade-in ${isVisible ? 'visible' : ''}`}>
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Guitar Explorer
              </h1>
              <span className="text-4xl">🔥</span>
            </div>
            
            <p className={`text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed fade-in ${isVisible ? 'visible' : ''}`}>
              Discover, showcase, and explore an amazing collection of guitars, amps, pedals, and musical equipment. 
              Join our community of music enthusiasts and gear lovers.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 fade-in-bounce delay-300 ${isVisible ? 'visible' : ''}`}>
              <Link 
                to="/gallery" 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors duration-200 min-w-[200px]"
              >
                🎸 Explore Gallery
              </Link>
              <Link 
                to="/add" 
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-200 min-w-[200px]"
              >
                ➕ Add Your Gear
              </Link>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto fade-in-bounce delay-400 ${isVisible ? 'visible' : ''}`}>
              <div className="text-center">
                <div className="text-4xl mb-4">🎸</div>
                <h3 className="text-lg font-semibold mb-2">Guitars & Basses</h3>
                <p className="text-gray-400 text-sm">Electric, acoustic, and bass guitars from all brands</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔊</div>
                <h3 className="text-lg font-semibold mb-2">Amps & Effects</h3>
                <p className="text-gray-400 text-sm">Amplifiers, pedals, and sound processing equipment</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-lg font-semibold mb-2">Accessories</h3>
                <p className="text-gray-400 text-sm">Picks, strings, cases, and other musical accessories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Sections */}
        <div className="py-16">
          {loading ? (
            <div className={`flex justify-center items-center py-16 fade-in-bounce delay-500 ${isVisible ? 'visible' : ''}`}>
              <Spinner />
            </div>
          ) : (
            <>
              {renderEquipmentSection(
                recentEquipment, 
                "Recently Added", 
                "🆕", 
                "/gallery?sort=date&order=desc",
                600
              )}
              
              {renderEquipmentSection(
                popularEquipment, 
                "Most Popular", 
                "⭐", 
                "/gallery?sort=likesCount&order=desc",
                700
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
