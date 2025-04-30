import { Link } from "react-router-dom";
import { useUserContext } from "./context/UserContext";

function SideMenu() {
  const { user, logout } = useUserContext();
  
  return (
    <aside className="bg-gray-500 text-white w-full md:w-1/4 lg:w-1/5 p-4 bg-[url(/guitar-bg.svg)] bg-contain bg-top bg-no-repeat">
      <div className="flex justify-end mb-4">
        <Link to="/add" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add New
        </Link>
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold mb-2">Select Shape</div>
        <div className="flex space-x-2">
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <span className="w-6 h-6">All</span>
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/singlecut_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/stype_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/ttype_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
          <button className="w-8 h-8 border flex items-center justify-center hover:bg-gray-200">
            <img src="/shapes/v_outline.png" alt="Icon" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;