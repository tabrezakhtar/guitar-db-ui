import React from "react";
import { Link } from "react-router-dom";

function Footer({ compact = false }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <footer className={`text-[var(--color-text-muted)] ${compact ? 'py-3 px-0' : 'py-4 px-6'}`}>
      {compact ? (
        // Compact version for sidebar
        <>
          <hr className="border-gray-600 mb-3" />
          <div className="flex flex-col space-y-3">
            <div className="flex flex-wrap gap-3 justify-center text-xs">
              <a 
                href={`/privacy.html`}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy
              </a>
              <a 
                href={`/terms.html`}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              <a 
                href={`/contact.html`}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="text-center">
              <span className="text-[var(--color-text-muted)] text-xs">© {new Date().getFullYear()} rifftales</span>
              <div className="text-gray-400 text-xs mt-1">
                <a
                  href="https://www.melodyapps.co.uk"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Made with ❤️ by Melody Apps
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Full version for main layout
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center text-sm">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <span className="text-[var(--color-text-muted)]">© {new Date().getFullYear()} rifftales. All rights reserved.</span>
            <div className="text-gray-400 text-xs mt-1">
              <a
                href="https://www.melodyapps.co.uk"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Made with ❤️ by Melody Apps
              </a>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <a 
              href={`/privacy.html`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a 
              href={`/terms.html`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>
            <a 
              href={`/contact.html`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:underline transition-colors"
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
