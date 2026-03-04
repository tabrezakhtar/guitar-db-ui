import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useHeader } from "../context/HeaderContext";
import Logo from "../Logo";
import EquipmentSections from "./EquipmentSections";
import ArticlesSection from "./ArticlesSection";
import EquipmentTypeGrid from "./EquipmentTypeGrid";
import HandwrittenText from "./HandwrittenText";
import RecentUsers from "../components/RecentUsers";
import LiveAndUpcoming from "../schedule/LiveAndUpcoming";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Landing() {
  const shouldReduceMotion = useReducedMotion();
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
    if (window.innerWidth >= 768) {
      if (!window.ParallaxBackground) {
        const existingScript = document.querySelector('script[src="/parallax-bg.js"]');
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = "/parallax-bg.js";
          script.onload = () => {
            if (window.ParallaxBackground) {
              window.ParallaxBackground.init({
                zIndex: -1,
                speeds: [200, 250, 180, 120],
                animate: true
              });
            }
          };
          document.head.appendChild(script);
        }
      } else {
        window.ParallaxBackground.init({
          zIndex: -1,
          speeds: [200, 250, 180, 120],
          animate: true
        });
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-[var(--color-text)] dark:text-[var(--color-text)] p-8">
      
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="mb-8"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: "easeInOut" }}
            >
              <Logo size="xlarge" />
            </motion.div>
            <HandwrittenText
              text="Discover gear.  Celebrate stories.  Share your journey."
              className="text-4xl text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed font-['Caveat']"
              delay={500}
              speed={30}
              isVisible={isVisible}
            />
            
            <HandwrittenText
              text="Explore guitars, amps, pedals, and musical treasures.  Upload your own gear, tell the story behind how it found you, and connect with a community that loves music as much as you do."
              className="hidden sm:block text-3xl text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed font-['Caveat']"
              delay={500}
              speed={20}
              isVisible={isVisible}
            />

            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center sm:items-stretch mb-8"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.34, 1.56, 0.64, 1], delay: shouldReduceMotion ? 0 : 0.3 }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: shouldReduceMotion ? 1 : [1, 1.1, 1] }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut", delay: shouldReduceMotion ? 0 : 1.1 }}
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
                  <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                    <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Explore Gallery</h3>
                    <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Browse amazing gear from our community</p>
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
                  <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                    <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Add Your Gear</h3>
                    <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Share your instruments and tell their stories</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* <EquipmentTypeGrid isVisible={isVisible} /> */}

            <div className="max-w-3xl mt-8 space-y-6">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.6 }}
              >
                <Link 
                  to="/guide" 
                  className="flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2 mx-auto"
                  style={{
                    backgroundImage: 'url(https://res.cloudinary.com/dx8d5hlk1/image/upload/v1772648199/tvguidebg_thumb_gmlgqs.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderColor: '#EAAA00'
                  }}
                >
                  {/* <div className="relative z-10 text-center">
                    <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                      <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Live Streamer Guide</h3>
                      <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Check out when your favorite guitarists are streaming</p>
                    </div>
                  </div> */}
                </Link>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.7 }}
              >
                <LiveAndUpcoming />
              </motion.div>
              <RecentUsers />
            </div>
          </div>
        </div>
      </div>

      <ArticlesSection isVisible={isVisible} />

      <EquipmentSections 
        recentEquipment={recentEquipment}
        popularEquipment={popularEquipment}
        loading={loading}
        isVisible={isVisible}
        isMobile={isMobile}
      />

      {/* <Footer /> */}
    </div>
  );
}

export default Landing;
