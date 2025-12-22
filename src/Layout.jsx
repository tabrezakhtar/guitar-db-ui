import { useState, useContext } from "react";
import SideMenu from "./sidemenu/SideMenu";
import { useHeader } from "./context/HeaderContext";
import { UserContext } from "./context/UserContext";
import { ssrRedirect } from "./utils/urlUtils";

function Layout({ hideMenu, children }) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { showHeader } = useHeader();
  const { isGuest } = useContext(UserContext) || {};
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row max-w-screen-xl mx-auto w-full relative">
      {/* Hamburger Menu Button - Only visible on small screens and when menu is not hidden */}
      {!hideMenu && (
        <button
          onClick={toggleSideMenu}
          className="md:hidden fixed top-2 left-2 z-50 bg-white p-2 rounded-md shadow-lg"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
            <span
              className={`block h-0.5 w-6 bg-black transform transition-all duration-300 ease-in-out ${
                isSideMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transform transition-all duration-300 ease-in-out ${
                isSideMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transform transition-all duration-300 ease-in-out ${
                isSideMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      )}

      {/* Overlay for mobile - Only visible when menu is open and not hidden */}
      {!hideMenu && isSideMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={toggleSideMenu}
        />
      )}

      {/* Side Menu - Slides in from left on mobile, hidden when hideMenu is true */}
      {!hideMenu && (
        <div
          className={`
            md:relative md:translate-x-0 md:block md:w-96 md:sticky md:top-0
            fixed md:static top-0 left-0 h-screen md:h-auto z-40 w-80
            transform transition-all duration-500 ease-in-out
            ${isSideMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            overflow-y-auto md:overflow-visible custom-scrollbar
          `}
        >
          <SideMenu />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white dark:bg-[#122634] overflow-y-auto">
        {isGuest && showHeader && (
          <div className="w-full bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 border-b border-yellow-300 dark:border-yellow-700 rounded-md mb-4">
            <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
              <span>👋 You are browsing as a guest - some features are limited. Sign up for the full experience.</span>
              <button onClick={() => ssrRedirect(`${BASE_URL}/register`)} className="bg-orange-400 hover:bg-orange-600 text-white px-3 py-1 rounded cursor-pointer">
                <span className="[text-shadow:1px_1px_0_gray]">Register</span>
              </button>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

export default Layout;
