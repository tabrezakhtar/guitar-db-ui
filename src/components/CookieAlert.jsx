import { useState, useEffect } from "react";

function CookieAlert() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
    
    // Load Mixpanel tracking if function exists
    if (typeof window.mixPanelInit === "function") {
      window.mixPanelInit();
    }
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-opacity duration-300">
      <div className="bg-slate-800/90 text-white rounded-lg shadow-lg overflow-hidden w-72 sm:w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-600">
          <strong className="font-semibold">Cookie Notice 🍪</strong>
          <button 
            type="button" 
            className="text-white hover:text-gray-300" 
            onClick={handleClose}
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm">Allow cookies on this website?</p>
          <div className="mt-3 pt-2 border-t border-slate-600 flex justify-end gap-2">
            <button 
              type="button" 
              className="px-3 py-1 text-sm border border-white hover:bg-slate-700 text-white rounded transition-colors duration-150"
              onClick={handleReject}
            >
              Reject
            </button>
            <button 
              type="button" 
              className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-150"
              onClick={handleAccept}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieAlert;