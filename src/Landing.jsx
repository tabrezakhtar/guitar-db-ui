import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHeader } from "./context/HeaderContext";
import { EquipmentCarousel } from "./profile/EquipmentCard";
import Spinner from "./components/Spinner";
import Logo from "./Logo";
import Footer from "./Footer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Landing() {
  const { hideHeader, displayHeader } = useHeader();
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [popularEquipment, setPopularEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    hideHeader();
    
    if (!window.ParallaxBackground) {
      const existingScript = document.querySelector('script[src="/parallax-bg.js"]');
      
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "/parallax-bg.js";
        script.onload = () => {
          if (window.ParallaxBackground) {
            const parallaxInstance = window.ParallaxBackground.init({
              zIndex: -1,
              speeds: [200, 250, 180, 120]
            });
          }
        };
        document.head.appendChild(script);
      }
    } else {
      const parallaxInstance = window.ParallaxBackground.init({
        zIndex: -1,
        speeds: [200, 250, 180, 120]
      });
    }
    
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => {
      displayHeader();
      const container = document.querySelector(".parallax-bg-container");
      const styles = document.getElementById("parallax-bg-styles");
      if (container) container.remove();
      if (styles) styles.remove();
    };
  }, [hideHeader, displayHeader]);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const recentResponse = await fetch(`${BASE_URL}/api/equipment/list?page=1&limit=5&sortBy=date&sortOrder=desc`);
        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentEquipment(recentData.items || []);
        }

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

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  });

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
            View All
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <style>{`
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
        
        .gentle-hover img {
          transition: transform 0.3s ease-in-out;
        }
        
        .gentle-hover:hover img {
          transform: translateY(-4px);
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className={`mb-8 fade-in ${isVisible ? 'visible' : ''}`}>
              <Logo size="xlarge" />
            </div>
            <p className={`text-4xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed fade-in font-['Caveat'] ${isVisible ? 'visible' : ''}`}>
              Discover gear.  Celebrate stories.  Share your journey.
            </p>
            
            <p className={`text-3xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed fade-in font-['Caveat'] ${isVisible ? 'visible' : ''}`}>
              Explore guitars, amps, pedals, and musical treasures.  Upload your own gear, tell the story behind how it found you, and connect with a community that loves music as much as you do.
            </p>

            <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center sm:items-stretch mb-12 fade-in-bounce delay-300 ${isVisible ? 'visible' : ''}`}>
              <Link 
                to="/gallery" 
                className="flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2"
                style={{
                  backgroundImage: 'url(https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759240663/guitar_store_bpmexv.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderColor: '#EAAA00'
                }}
              >
                <div className="relative z-10 text-center">
                  <div className="bg-[rgba(31,41,55,0.3)] rounded-lg px-4 py-3">
                    <h3 className="text-white text-xl font-bold drop-shadow-lg mb-1">Explore Gallery</h3>
                    <p className="text-white text-sm drop-shadow-lg opacity-90">Browse amazing gear from our community</p>
                  </div>
                </div>
              </Link>
              <Link 
                to="/add" 
                className="flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2"
                style={{
                  backgroundImage: 'url(https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759240663/drums_keys_qosi6l.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderColor: '#EAAA00'
                }}
              >
                <div className="relative z-10 text-center">
                  <div className="bg-[rgba(31,41,55,0.3)] rounded-lg px-4 py-3">
                    <h3 className="text-white text-xl font-bold drop-shadow-lg mb-1">Add Your Gear</h3>
                    <p className="text-white text-sm drop-shadow-lg opacity-90">Share your instruments and tell their stories</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto fade-in-bounce delay-400 ${isVisible ? 'visible' : ''}`}>
              <div className="bg-[#202b3d] rounded-lg p-6 gentle-hover">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <img 
                      src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833181/guitar-outline-sm_vfinxb.png" 
                      alt="Guitar outline" 
                      className="w-16 h-16"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Guitars & Basses</h3>
                  <p className="text-gray-400 text-sm">Electric, acoustic, and bass guitars from all brands</p>
                </div>
              </div>
              <div className="bg-[#202b3d] rounded-lg p-6 gentle-hover">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <img 
                      src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833181/amp-outline-sm_svwske.png" 
                      alt="Amp outline" 
                      className="w-16 h-16"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Amps & Effects</h3>
                  <p className="text-gray-400 text-sm">Amplifiers, pedals, and sound processing equipment</p>
                </div>
              </div>
              <div className="bg-[#202b3d] rounded-lg p-6 gentle-hover">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <img 
                      src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759833180/mic-outline-sm_bbqskx.png" 
                      alt="Microphone outline" 
                      className="w-16 h-16"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Accessories</h3>
                  <p className="text-gray-400 text-sm">Picks, strings, cases, and other musical accessories</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </div>
      
      <Footer />
    </div>
  );
}

export default Landing;
