import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function RecentUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0, placement: "top" });
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const hoveredElRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/users/recent`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load users");
        const { users: data } = await res.json();
        setUsers(data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!hoveredUser || isMobile) return;
    const updatePosition = () => {
      if (!hoveredElRef.current) return;
      setPopupPosition(calculatePosition(hoveredElRef.current.getBoundingClientRect(), 300));
    };
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [hoveredUser, isMobile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-[var(--color-text-header)]">Featured members</h3>
          {/* <Link to="/profile" className="text-sm text-blue-400 hover:underline">See all</Link> */}
        </div>
        <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] text-center">No featured members</div>
      </div>
    );
  }

  const calculatePosition = (rect, popupHeight) => {
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const placement = spaceAbove < popupHeight && spaceBelow > spaceAbove ? "bottom" : "top";
    const y = placement === "top" ? rect.top - 10 : rect.bottom + 10;

    return { x: rect.left + rect.width / 2, y, placement };
  };

  const handleMouseEnter = (user, e) => {
    if (isMobile) return;
    hoveredElRef.current = e.currentTarget;
    setPopupPosition(calculatePosition(e.currentTarget.getBoundingClientRect(), 300));
    setHoveredUser(user);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hoveredElRef.current = null;
    setHoveredUser(null);
  };

  const handleClick = (user, e) => {
    if (!isMobile) return;
    e.preventDefault();
    if (hoveredUser?.id === user.id) {
      setHoveredUser(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const popupHeight = 350;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      const placement = spaceAbove < popupHeight && spaceBelow > spaceAbove ? "bottom" : "top";
      const y = placement === "top" ? rect.top - 10 : rect.bottom + 10;
      
      setPopupPosition({ x: window.innerWidth / 2, y, placement });
      setHoveredUser(user);
    }
  };

  const closePopup = () => {
    hoveredElRef.current = null;
    setHoveredUser(null);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const ta = a && a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b && b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  return (
    <div>
      {hoveredUser && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closePopup}
        />
      )}
      
      <div className="flex items-center justify-center mb-3">
        <h3 className="text-2xl font-bold text-[var(--color-text-header)] text-center">Featured members</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {sortedUsers.map((u, index) => (
          <motion.div 
            key={u.id}
            className="relative"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut"
            }}
            onMouseEnter={(e) => handleMouseEnter(u, e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(u, e)}
          >
            <Link 
              to={`/profile/${u.id}`} 
              className="group flex flex-col items-center gap-2 p-2 rounded-md hover:bg-[var(--color-card-dark)] transition-colors cursor-pointer"
              onClick={(e) => {
                if (isMobile && hoveredUser) {
                  e.preventDefault();
                }
              }}
            >
              <AvatarDisplayOnly imageUrl={u.avatarUrl} username={u.username} size="small" />
              <div className="text-[var(--color-text-header)] group-hover:text-[var(--color-text-header)] dark:group-hover:text-white text-xs sm:text-sm font-medium truncate w-full text-center">{u.username}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {hoveredUser && (
        <motion.div 
          className="fixed z-50 pointer-events-none"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: popupPosition.placement === "top" ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
          style={{
            left: isMobile ? '50%' : `${popupPosition.x}px`,
            top: popupPosition.placement === "top" ? 'auto' : `${popupPosition.y}px`,
            bottom: popupPosition.placement === "top" ? `${window.innerHeight - popupPosition.y}px` : 'auto',
            transform: isMobile ? 'translateX(-50%)' : 'translateX(-50%)',
          }}
        >
          <div className="bg-[var(--color-card-dark)] dark:bg-[var(--color-card-dark)] rounded-2xl shadow-2xl p-6 w-80 max-w-[90vw] pointer-events-auto">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <AvatarDisplayOnly imageUrl={hoveredUser.avatarUrl} username={hoveredUser.username} size="large" />
              </div>
              <h4 className="text-[var(--color-text-header)] font-bold text-lg mb-2">@{hoveredUser.username}</h4>
              <p className="text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] text-sm text-center leading-relaxed line-clamp-4">
                {(hoveredUser.bio && hoveredUser.bio.length > 100) ? `${hoveredUser.bio.slice(0, 100)}...` : (hoveredUser.bio || "No bio available")}
              </p>
              {isMobile && (
                <button
                  onClick={closePopup}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RecentUsers;