import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { GuitarContext } from "./context/GuitarContext";
import { useHeader } from "./context/HeaderContext";
import AvatarDisplayOnly from "./profile/AvatarDisplayOnly";

function MenuContent({ user }) {
  return (
    <nav className="flex pr-5 items-center">
      <ul className="flex space-x-4 items-center">
        <li>
          <Link to="/" className="hover:underline block py-2">Home</Link>
        </li>
        <li>
          <Link to="/contact" className="hover:underline block py-2">Contact</Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline block py-2">About</Link>
        </li>
      </ul>
      
      {user ? (
        <Link 
          to="/profile" 
          className="ml-6 flex items-center hover:text-gray-300"
        >
          <AvatarDisplayOnly imageUrl={user.avatarUrl} username={user.username} size="small"/>
          <span className="pl-2">{user.username}</span>
        </Link>
      ) : (
        <a 
          href={`${import.meta.env.VITE_API_BASE_URL}/register`} 
          className="ml-6 flex items-center hover:text-gray-300"
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
  const { user } = useContext(UserContext);
  const { setEquipmentType } = useContext(GuitarContext);
  const { showHeader } = useHeader();
  
  if (!showHeader) return null;

  return (
    <header className="bg-gray-800 text-white p-4 flex">
      <div className="flex justify-center md:justify-between items-center max-w-screen-xl mx-auto w-full">
        <div className="flex items-center md:pl-6 md:pr-0" >
          <Link to="/gallery" className="text-lg font-bold hover:underline" onClick={() => setEquipmentType("")}>Guitar Explorer</Link>
          <span>🔥</span>
        </div>
        
        <div className="hidden md:block">
          <MenuContent user={user} />
        </div>
      </div>
    </header>
  );
}

export default Header;