import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { GuitarContext } from "./context/GuitarContext";
import AvatarDisplayOnly from "./profile/AvatarDisplayOnly";

function MenuContent({ isOpen, onClose, isMobile, user }) {
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  
  if (!isOpen && isMobile) return null;
  
  return (
    <>
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={onClose}
        />
      )}
      <nav 
        ref={menuRef}
        className={`${isMobile ? (isOpen ? "flex" : "hidden") : "flex"} ${isMobile ? "absolute top-16 right-0 bg-gray-800 w-full z-50 flex-col items-start p-4 shadow-lg" : "pr-5 items-center"}`}
      >
        <ul className={`${isMobile ? "flex-col w-full" : "flex"} space-y-${isMobile ? "4" : "0"} space-x-${isMobile ? "0" : "4"} items-${isMobile ? "start" : "center"}`}>
          <li className={isMobile ? "w-full border-b border-gray-700 pb-2" : ""}>
            <Link to="/" className="hover:underline block py-2" onClick={() => isMobile && onClose()}>Home</Link>
          </li>
          <li className={isMobile ? "w-full border-b border-gray-700 pb-2" : ""}>
            <Link to="/contact" className="hover:underline block py-2" onClick={() => isMobile && onClose()}>Contact</Link>
          </li>
          <li className={isMobile ? "w-full border-b border-gray-700 pb-2" : ""}>
            <Link to="/about" className="hover:underline block py-2" onClick={() => isMobile && onClose()}>About</Link>
          </li>
        </ul>
        
        {user ? (
          <Link 
            to="/profile" 
            className={`${isMobile ? "mt-4 w-full" : "ml-6"} flex items-center hover:text-gray-300`}
            onClick={() => isMobile && onClose()}
          >
            <AvatarDisplayOnly imageUrl={user.avatarUrl} username={user.username} size="small"/>
            <span className="pl-2">{user.username}</span>
          </Link>
        ) : (
          <Link 
            to="/create-profile" 
            className={`${isMobile ? "mt-4 w-full" : "ml-6"} flex items-center hover:text-gray-300`}
            onClick={() => isMobile && onClose()}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium mr-2">
              +
            </div>
            <span>Create Profile</span>
          </Link>
        )}
      </nav>
    </>
  );
}

function Header() {
  const { user, showHeader } = useContext(UserContext);
  const { setEquipmentType } = useContext(GuitarContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef(null);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!showHeader) return null;

  return (
    <header className="bg-gray-800 text-white p-4 flex">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
        <div className="flex items-center pl-6 animate__animated animate__rubberBand" >
          <Link to="/" className="text-lg font-bold hover:underline" onClick={() => setEquipmentType("")}>Guitar Explorer</Link>
          <span>🔥</span>
        </div>
        
        <div className="md:hidden pr-5">
          <button 
            onClick={toggleMenu} 
            className="text-2xl focus:outline-none p-1"
            aria-label="Toggle menu"
            ref={buttonRef}
          >
            {isMenuOpen ? (
              <div className="relative w-6 h-6">
                <div className="absolute w-6 h-0.5 bg-white transform rotate-45 top-1/2"></div>
                <div className="absolute w-6 h-0.5 bg-white transform -rotate-45 top-1/2"></div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </div>
            )}
          </button>
        </div>
        
        <MenuContent 
          isOpen={isMenuOpen}
          onClose={closeMenu}
          isMobile={isMobile}
          user={user}
        />
      </div>
    </header>
  );
}

export default Header;