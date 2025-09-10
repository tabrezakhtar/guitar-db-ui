import React from "react";
import { Link } from "react-router-dom";

function Footer({ compact = false }) {
  return (
    <footer className={`text-white ${compact ? 'py-3 px-0' : 'py-4 px-6'}`}>
      {compact ? (
        // Compact version for sidebar
        <>
          <hr className="border-gray-600 mb-3" />
          <div className="flex flex-col space-y-3">
            <div className="flex flex-wrap gap-3 justify-center text-xs">
              <Link 
                to="/privacy-policy" 
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                Terms
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="text-center">
              <span className="text-gray-400 text-xs">© {new Date().getFullYear()} Riffbook</span>
            </div>
          </div>
        </>
      ) : (
        // Full version for main layout
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-400">© {new Date().getFullYear()} Riffbook. All rights reserved.</span>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <Link 
              to="/privacy-policy" 
              className="text-gray-300 hover:text-white hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-300 hover:text-white hover:underline transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-white hover:underline transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
