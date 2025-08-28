import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHeader } from "./context/HeaderContext";

function Landing() {
  const { hideHeader, displayHeader } = useHeader();

  useEffect(() => {
    hideHeader();
    return () => {
      displayHeader();
    };
  }, [hideHeader, displayHeader]);
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Guitar Explorer
          </h1>
          <span className="text-4xl">🔥</span>
        </div>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover, showcase, and explore an amazing collection of guitars, amps, pedals, and musical equipment. 
          Join our community of music enthusiasts and gear lovers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            to="/gallery" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors duration-200 min-w-[200px]"
          >
            🎸 Explore Gallery
          </Link>
          <Link 
            to="/add" 
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-200 min-w-[200px]"
          >
            ➕ Add Your Gear
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">🎸</div>
            <h3 className="text-lg font-semibold mb-2">Guitars & Basses</h3>
            <p className="text-gray-400 text-sm">Electric, acoustic, and bass guitars from all brands</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔊</div>
            <h3 className="text-lg font-semibold mb-2">Amps & Effects</h3>
            <p className="text-gray-400 text-sm">Amplifiers, pedals, and sound processing equipment</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-lg font-semibold mb-2">Accessories</h3>
            <p className="text-gray-400 text-sm">Picks, strings, cases, and other musical accessories</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
