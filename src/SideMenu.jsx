import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGuitarContext } from "./context/GuitarContext";
import Tag from "./components/Tag";
import TagSearch from "./components/TagSearch";

function SideMenu() {
  const { 
    fetchTags, 
    filteredTags, 
    selectedTags, 
    handleTagSelection, 
    clearSelectedTags 
  } = useGuitarContext();
  
  useEffect(() => {
    fetchTags();
  }, [])

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

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold flex items-center">
            Select Tags
          </div>
          <div>
            {selectedTags.length > 0 && (
              <button 
                onClick={clearSelectedTags}
                className="text-xs ml-2 px-2 py-1 bg-blue-600 hover:bg-gray-700 rounded"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
        <TagSearch />

        <div className="relative">
          <div className="flex flex-wrap max-h-[700px] overflow-y-auto pr-1 pb-16 scrollbar-hide" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {filteredTags.map((tag) => (
              <Tag 
                key={tag._id} 
                tag={tag} 
                selected={selectedTags.some(t => t._id === tag._id)}
                onClick={handleTagSelection}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-500 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;