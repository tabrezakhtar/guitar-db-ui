import { Link } from "react-router-dom";
import { useUserContext } from "./context/UserContext";

function Header() {
  const { user } = useUserContext();
  
  const getInitial = (username) => {
    return username && username.length > 0 ? username[0].toUpperCase() : "?";
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
        <div className="flex items-center pl-6">
          <Link to="/" className="text-lg font-bold hover:underline">Guitar Explorer</Link>
          <span>🔥</span>
        </div>
        
        <nav className="pr-5 flex items-center">
          <ul className="flex space-x-4 items-center">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
          </ul>
          
          {user && (
            <Link to="/profile" className="flex items-center ml-6 hover:text-gray-300">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
                {getInitial(user.username)}
              </div>
              <span>{user.username}</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;