import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useHeader } from "../context/HeaderContext";
import Logo from "../Logo";
import Footer from "../Footer";
import EquipmentSections from "./EquipmentSections";
import ArticlesSection from "./ArticlesSection";
import EquipmentTypeGrid from "./EquipmentTypeGrid";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Landing() {
  const { hideHeader, displayHeader } = useHeader();
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [popularEquipment, setPopularEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        const landingResponse = await fetch(`${BASE_URL}/api/pages/landing`);
        if (landingResponse.ok) {
          const landingData = await landingResponse.json();
          setRecentEquipment(landingData.recent || []);
          setPopularEquipment(landingData.popular || []);
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

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Logo size="xlarge" />
            </motion.div>
            <motion.p
              className="text-4xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-['Caveat']"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              Discover gear.  Celebrate stories.  Share your journey.
            </motion.p>
            
            <motion.p
              className="text-3xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-['Caveat']"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              Explore guitars, amps, pedals, and musical treasures.  Upload your own gear, tell the story behind how it found you, and connect with a community that loves music as much as you do.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center sm:items-stretch mb-12"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 1.1 }}
              >
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
              </motion.div>
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
            </motion.div>
            
            <EquipmentTypeGrid isVisible={isVisible} />
          </div>
        </div>
      </div>
      
      <EquipmentSections 
        recentEquipment={recentEquipment}
        popularEquipment={popularEquipment}
        loading={loading}
        isVisible={isVisible}
        isMobile={isMobile}
      />

      <ArticlesSection isVisible={isVisible} />

      <Footer />
    </div>
  );
}

export default Landing;
