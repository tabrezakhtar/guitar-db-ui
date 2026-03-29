import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useHeader } from "../context/HeaderContext";
import { UserContext } from "../context/UserContext";
import Logo from "../Logo";
import EquipmentSections from "./EquipmentSections";
import ArticlesSection from "./ArticlesSection";
import HandwrittenText from "./HandwrittenText";
import RecentUsers from "../components/RecentUsers";
import LiveAndUpcoming from "../schedule/LiveAndUpcoming";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Landing() {
  const shouldReduceMotion = useReducedMotion();
  const { hideHeader, displayHeader } = useHeader();
  const { hasVisitedLandingPage, setHasVisitedLandingPage } = useContext(UserContext);
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

    const visitTimer = setTimeout(() => {
      setHasVisitedLandingPage(true);
    }, 500);

    return () => {
      clearTimeout(visitTimer);
      displayHeader();
      const container = document.querySelector(".parallax-bg-container");
      const styles = document.getElementById("parallax-bg-styles");
      if (container) container.remove();
      if (styles) styles.remove();
    };
  }, [hideHeader, displayHeader, setHasVisitedLandingPage]);

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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-neutral-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-[var(--color-text)] dark:text-[var(--color-text)] p-8">
      
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
              delay={hasVisitedLandingPage ? 0 : 500}
              speed={hasVisitedLandingPage ? 0 : 30}
              isVisible={isVisible}
            />
            
            <HandwrittenText
              text="Explore guitars, amps, pedals, and musical treasures.  Upload your own gear, tell the story behind how it found you, and connect with a community that loves music as much as you do."
              className="hidden sm:block text-3xl text-[var(--color-text-muted)] mb-8 max-w-2xl mx-auto leading-relaxed font-['Caveat']"
              delay={hasVisitedLandingPage ? 0 : 500}
              speed={hasVisitedLandingPage ? 0 : 20}
              isVisible={isVisible}
            />

            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center sm:items-stretch mb-8"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30, scale: isVisible ? 1 : 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.34, 1.56, 0.64, 1], delay: shouldReduceMotion ? 0 : 0.3 }}
            >
              <Link 
                to="/gallery" 
                className="flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2"
                style={{
                  borderColor: '#EAAA00'
                }}
              >
                <img
                  src="https://res.cloudinary.com/dx8d5hlk1/image/upload/f_auto/v1759240663/guitar_store_bpmexv.jpg"
                  alt="Explore Gallery"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="relative z-10 text-center">
                  <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                    <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Explore Gallery</h3>
                    <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Browse amazing gear from our community</p>
                  </div>
                </div>
              </Link>
              <Link 
                to="/add" 
                className="flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2"
                style={{
                  borderColor: '#EAAA00'
                }}
              >
                <img
                  src="https://res.cloudinary.com/dx8d5hlk1/image/upload/f_auto/v1759240663/drums_keys_qosi6l.jpg"
                  alt="Add Your Gear"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
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
                    borderColor: '#EAAA00'
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1774667590/live-streamer_uiafvv.webp"
                    alt="Live Streamer Guide"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="relative z-10 text-center">
                    <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                      <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Live Streamer Guide</h3>
                      <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Stay up to date with your favourite streamers</p>
                    </div>
                  </div>
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
