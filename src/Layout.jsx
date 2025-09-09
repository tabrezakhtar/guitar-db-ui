import { useState } from "react";
import SideMenu from "./sidemenu/SideMenu";

function Layout({ hideMenu, children }) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
                isSideMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-black transform transition-all duration-300 ease-in-out ${
                isSideMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-black transform transition-all duration-300 ease-in-out ${
                isSideMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
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
        <div          className={`            md:relative md:translate-x-0 md:block md:w-96 md:sticky md:top-0
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
      <main className="flex-1 bg-white dark:bg-[#122634] p-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;
