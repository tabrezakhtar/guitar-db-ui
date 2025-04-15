import { useGuitarContext } from "./context/GuitarContext";
import Select from "react-select";
import { Link } from "react-router-dom";

function SideMenu() {
  const { settings, loading } = useGuitarContext();

  const createOptions = (items) =>
    items?.map((item) => ({ value: item, label: item })) || [];

  const capitalize = (str) => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

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

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {Object.keys(settings).map((key) => {
            if (Array.isArray(settings[key])) {
              return (
                <div key={key} className="mt-4">
                  <div className="text-sm font-semibold mb-2">{capitalize(key)}</div>
                  <Select
                    options={createOptions(settings[key])}
                    placeholder={capitalize(key)}
                    isClearable
                    className="text-gray-800"
                  />
                </div>
              );
            }
            return null;
          })}
        </>
      )}
    </aside>
  );
}

export default SideMenu;