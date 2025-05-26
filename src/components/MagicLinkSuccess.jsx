import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

const MagicLinkSuccess = ({ magicLink, onLogin }) => {
  const [copied, setCopied] = useState(false);
  const { setHeaderVisibility } = useContext(UserContext);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(magicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  useEffect(() => {
    // Hide header when component mounts
    setHeaderVisibility(false);
    
    // Show header when component unmounts
    return () => {
      setHeaderVisibility(true);
    };
  }, []);
  
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-auto mt-6 max-w-2xl">
      <p className="font-bold mb-3">🎸 Profile created successfully!</p>
      <p className="mb-4">Your profile has been generated. Please save this magic link to log in later:</p>
      
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={magicLink}
            readOnly
            className="border p-2 rounded flex-grow bg-white text-gray-800"
          />
          <button 
            onClick={handleCopy}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded flex items-center"
          >
            {copied ? "✅" : "📋"}
          </button>
        </div>
        <p className="text-sm mt-2 text-amber-700">
          ⚠️ Please save this link somewhere safe or bookmark this page. You'll need it to log in.
        </p>
      </div>
      
      <div className="flex gap-3 flex-wrap">
        <button 
          onClick={onLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center"
        >
          <span className="mr-2">🪄</span> Login Now
        </button>
      </div>
    </div>
  );
};

export default MagicLinkSuccess;