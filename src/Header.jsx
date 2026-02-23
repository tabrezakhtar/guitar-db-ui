import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { GuitarContext } from "./context/GuitarContext";
import { useHeader } from "./context/HeaderContext";
import AvatarDisplayOnly from "./profile/AvatarDisplayOnly";
import Logo from "./Logo";

function MenuContent({ user }) {
  return (
    <nav className="flex pr-5 items-center">
      {user ? (
        <Link 
          to="/profile" 
          className="ml-6 flex items-center text-[var(--color-text-header)] dark:text-[var(--color-text-dark)]"
        >
          <AvatarDisplayOnly imageUrl={user.avatarUrl} username={user.username} size="small"/>
          <span className="pl-2">{user.username}</span>
          {user.admin && (
            <img 
              src="/verified.svg" 
              alt="Verified" 
              className="w-4 h-4 ml-1"
            />
          )}
        </Link>
      ) : (
        <a 
          href={`${import.meta.env.VITE_API_BASE_URL}/register`} 
          className="ml-6 flex items-center text-[var(--color-text-header)] dark:text-[var(--color-text-dark)]"
        >
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium mr-2">
            +
          </div>
          <span>Create Profile</span>
        </a>
      )}
    </nav>
  );
}

function Header() {
  const location = useLocation();
  const { user } = useContext(UserContext) || {};
  const { setEquipmentType } = useContext(GuitarContext) || { setEquipmentType: () => {} };
  const { showHeader } = useHeader();
  
  if (location.pathname === "/" || !showHeader) return null;

  return (
    <header className="bg-[var(--color-toggle-bg)] text-[var(--color-text)] dark:text-[var(--color-text)] p-4 flex">
      <div className="flex justify-center md:justify-between items-center max-w-screen-xl mx-auto w-full">
        <div className="flex items-center md:pl-6 md:pr-0" >
          <Link to="/" className="text-lg font-bold hover:underline hover:decoration-red-500" onClick={() => setEquipmentType("")}>
            <Logo size="normal" />
          </Link>
        </div>
        
        <div className="hidden md:block">
          <MenuContent user={user} />
        </div>
      </div>
    </header>
  );
}

export default Header;