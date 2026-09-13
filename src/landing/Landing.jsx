import { useEffect, useState, useContext, useMemo, use, Suspense } from "react";
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
import Spinner from "../components/Spinner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LANDING_VIDEO_URL = "https://ik.imagekit.io/wxq5d3bho/final_loop2.mp4";

const fetchLandingData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/pages/landing`);
    if (response.ok) {
      const data = await response.json();
      return {
        recent: data.recent || [],
        popular: data.popular || []
      };
    }
    throw new Error("Failed to fetch landing data");
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return { recent: [], popular: [] };
  }
};

function LandingDataDisplay({ landingPromise, isVisible, isMobile }) {
  const landingData = use(landingPromise);
  
  return (
    <EquipmentSections 
      recentEquipment={landingData.recent}
      popularEquipment={landingData.popular}
      loading={false}
      isVisible={isVisible}
      isMobile={isMobile}
    />
  );
}

function Landing() {
  const shouldReduceMotion = useReducedMotion();
  const { hideHeader, displayHeader } = useHeader();
  const { hasVisitedLandingPage, setHasVisitedLandingPage } = useContext(UserContext);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const landingPromise = useMemo(() => fetchLandingData(), []);

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
    let heroTimer;
    let contentTimer;
    let videoTimer;
    let isActive = true;
    hideHeader();
    const initializeParallax = () => {
      if (!isActive || window.innerWidth < 768) {
        return undefined;
      }

      if (!window.ParallaxBackground) {
        const existingScript = document.querySelector('script[src="/parallax-bg.js"]');
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = "/parallax-bg.js";
          script.onload = () => {
            if (isActive && window.ParallaxBackground) {
              window.ParallaxBackground.init({
                zIndex: -1
              });
            }
          };
          document.head.appendChild(script);
        }

        return undefined;
      }

      return window.ParallaxBackground.init({
        zIndex: -1
      });
    };

    heroTimer = setTimeout(() => {
      setIsHeroVisible(true);
    }, 80);

    videoTimer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 220);

    contentTimer = setTimeout(() => {
      setIsContentVisible(true);
    }, hasVisitedLandingPage ? 240 : 700);

    let idleCallbackId;
    let parallaxTimer;

    if (window.requestIdleCallback) {
      idleCallbackId = window.requestIdleCallback(() => {
        initializeParallax();
      }, { timeout: 1500 });
    } else {
      parallaxTimer = setTimeout(() => {
        initializeParallax();
      }, 1200);
    }

    const visitTimer = setTimeout(() => {
      setHasVisitedLandingPage(true);
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(heroTimer);
      clearTimeout(contentTimer);
      clearTimeout(videoTimer);
      clearTimeout(parallaxTimer);
      clearTimeout(visitTimer);
      if (idleCallbackId && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleCallbackId);
      }
      displayHeader();
      if (window.__parallaxBackgroundInstance) {
        window.__parallaxBackgroundInstance.destroy();
        window.__parallaxBackgroundInstance = null;
      }
    };
  }, [hideHeader, displayHeader, hasVisitedLandingPage, setHasVisitedLandingPage]);



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
    <>
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0
        }}
      >
        rifftales - Discover gear, celebrate stories, and share your journey
      </h1>
      <section className="relative w-full overflow-hidden flex items-center justify-center">
        {shouldLoadVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src={LANDING_VIDEO_URL} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 sm:h-64 bg-gradient-to-b from-transparent to-[var(--color-main-bg)]" style={{ background: "linear-gradient(to bottom, transparent 0%, var(--color-main-bg) 100%)" }} />

        <div className="relative z-10 text-center px-6 py-16 w-full">
          <motion.div
            className="mb-8"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: isHeroVisible ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: "easeInOut" }}
          >
            <Logo size="xlarge" />
          </motion.div>
          <div className="mb-8 max-w-2xl mx-auto space-y-2">
            <HandwrittenText
              text="Discover gear.  Celebrate stories."
              className="text-4xl text-[var(--color-text-handwritten)] leading-relaxed font-['Caveat'] bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3 inline-block"
              delay={hasVisitedLandingPage ? 0 : 500}
              speed={hasVisitedLandingPage ? 0 : 30}
              isVisible={isHeroVisible}
            />
            <HandwrittenText
              text="Share your journey."
              className="text-4xl text-[var(--color-text-handwritten)] leading-relaxed font-['Caveat'] bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3 inline-block"
              delay={hasVisitedLandingPage ? 0 : 500}
              speed={hasVisitedLandingPage ? 0 : 30}
              isVisible={isHeroVisible}
            />
          </div>
        </div>
      </section>

      <div className="min-h-screen text-[var(--color-text)] dark:text-[var(--color-text)] p-8">
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="flex items-center justify-center">
            <div className="text-center">

              <motion.div
                className="flex flex-col sm:flex-row gap-8 justify-center items-center sm:items-stretch mb-8"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: isContentVisible ? 1 : 0, y: isContentVisible ? 0 : 30, scale: isContentVisible ? 1 : 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.34, 1.56, 0.64, 1], delay: shouldReduceMotion ? 0 : 0.3 }}
            >
              <motion.div
                animate={isContentVisible && !shouldReduceMotion ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 1 }}
              >
                <Link 
                  to="/gallery" 
                  className="group flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2"
                  style={{
                    borderColor: '#EAAA00'
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dx8d5hlk1/image/upload/f_auto/v1759240663/guitar_store_bpmexv.jpg"
                    alt="Explore Gear"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="low"
                  />
                  <div className="relative z-10 text-center">
                    <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                      <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Explore Gear</h3>
                      <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Browse amazing gear from our community</p>
                      <span className="inline-flex items-center mt-3 rounded-full bg-[#EAAA00] px-4 py-2 text-sm font-bold text-gray-900 shadow-md transition-colors duration-200 group-hover:bg-[#F5C242]">View Gear &rarr;</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
              <Link 
                to="/add" 
                className="group flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2"
                style={{
                  borderColor: '#EAAA00'
                }}
              >
                <img
                  src="https://res.cloudinary.com/dx8d5hlk1/image/upload/f_auto/v1759240663/drums_keys_qosi6l.jpg"
                  alt="Add Your Gear"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="low"
                />
                <div className="relative z-10 text-center">
                  <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                    <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Add Your Gear</h3>
                    <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Share your instruments and tell their stories</p>
                      <span className="inline-flex items-center mt-3 rounded-full bg-[#EAAA00] px-4 py-2 text-sm font-bold text-gray-900 shadow-md transition-colors duration-200 group-hover:bg-[#F5C242]">Add Your Gear &rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* <EquipmentTypeGrid isVisible={isVisible} /> */}

            <div className="max-w-3xl mt-8 space-y-6">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: isContentVisible ? 1 : 0, y: isContentVisible ? 0 : 20 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.6 }}
              >
                <Link 
                  to="/guide" 
                  className="group flex flex-col items-center justify-center rounded-xl font-semibold transition-all duration-200 w-72 h-52 relative overflow-hidden text-lg hover:scale-105 border-2 mx-auto"
                  style={{
                    borderColor: '#EAAA00'
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dx8d5hlk1/image/upload/v1774667590/live-streamer_uiafvv.webp"
                    alt="Live Streamer Guide"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="low"
                  />
                  <div className="relative z-10 text-center">
                    <div className="bg-[var(--color-overlay-dark)] rounded-lg px-4 py-3">
                      <h3 className="text-[var(--color-text)] text-xl font-bold drop-shadow-lg mb-1">Live Streamer Guide</h3>
                      <p className="text-[var(--color-text)] text-sm drop-shadow-lg">Stay up to date with your favourite streamers</p>
                      <span className="inline-flex items-center mt-3 rounded-full bg-[#EAAA00] px-4 py-2 text-sm font-bold text-gray-900 shadow-md transition-colors duration-200 group-hover:bg-[#F5C242]">View Guide &rarr;</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
              <motion.div
                className="mt-12"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: isContentVisible ? 1 : 0, y: isContentVisible ? 0 : 20 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.7 }}
              >
                <LiveAndUpcoming />
              </motion.div>

              <div className="mt-12">
                <RecentUsers />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ArticlesSection isVisible={isContentVisible} />
      </div>

      <Suspense fallback={<div className="flex justify-center py-8"><Spinner /></div>}>
        <LandingDataDisplay 
          landingPromise={landingPromise}
          isVisible={isContentVisible}
          isMobile={isMobile}
        />
      </Suspense>

      {/* <Footer /> */}
    </div>
    </>
  );
}

export default Landing;
