import { useState } from "react";
import SideMenu from "./sidemenu/SideMenu";
import Grid from "./guitars/Grid";

function ContentContainer() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row max-w-screen-xl mx-auto w-full relative">
      {/* Hamburger Menu Button - Only visible on small screens */}
      <button
        onClick={toggleSideMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile - Only visible when menu is open */}
      {isSideMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={toggleSideMenu}
        />
      )}

      {/* Side Menu - Slides in from left on mobile */}
      <div
        className={`
          md:relative md:translate-x-0 md:block md:w-96 md:h-screen md:sticky md:top-0
          fixed md:static top-0 left-0 h-full md:h-auto z-40 w-80
          transform transition-all duration-500 ease-in-out
          ${isSideMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SideMenu />
      </div>

      {/* Main Content - Scrollable Grid */}
      <main className="flex-1 bg-white p-4 overflow-y-auto">
        <Grid />
      </main>
    </div>
  );
}

export default ContentContainer;