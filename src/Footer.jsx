import React from "react";
import { Link } from "react-router-dom";

function Footer({ compact = false }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  return (
    <footer className={`text-white ${compact ? 'py-3 px-0' : 'py-4 px-6'}`}>
      {compact ? (
        // Compact version for sidebar
        <>
          <hr className="border-gray-600 mb-3" />
          <div className="flex flex-col space-y-3">
            <div className="flex flex-wrap gap-3 justify-center text-xs">
              <a 
                href={`${API_BASE_URL}/privacy`}
                className="text-gray-300 hover:text-white hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy
              </a>
              <a 
                href={`${API_BASE_URL}/terms`}
                className="text-gray-300 hover:text-white hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              <a 
                href={`/contact.html`}
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="text-center">
              <span className="text-gray-400 text-xs">© {new Date().getFullYear()} Rifftales</span>
            </div>
          </div>
        </>
      ) : (
        // Full version for main layout
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-400">© {new Date().getFullYear()} Rifftales. All rights reserved.</span>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <a 
              href={`${API_BASE_URL}/privacy`}
              className="text-gray-300 hover:text-white hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a 
              href={`${API_BASE_URL}/terms`}
              className="text-gray-300 hover:text-white hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>
            <a 
              href={`/contact.html`}
              className="text-gray-300 hover:text-white hover:underline transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
    )}
    </footer>
  );
}

export default Footer;
