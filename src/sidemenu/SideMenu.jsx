import { useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GuitarContext } from "../context/GuitarContext";
import Tag from "../components/Tag";
import TagSearch from "../components/TagSearch";

function SideMenu() {
  const { 
    fetchTags, 
    filteredTags, 
    selectedTags, 
    handleTagSelection, 
    clearSelectedTags 
  } = useContext(GuitarContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    fetchTags();
  }, [])

  const handleTypeClick = (type) => {
    const params = new URLSearchParams();
    params.set("type", type);
    navigate(`?${params.toString()}`);
  };

  return (
    <aside className="bg-gray-500 text-white w-full md:w-1/4 lg:w-1/5 p-4 bg-[url(/guitar-bg.svg)] bg-contain bg-top bg-no-repeat">
      <div className="flex justify-end mb-4">
        <Link to="/add" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Add a new instrument">
          Add New
        </Link>
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold mb-2">Select Equipment</div>
        <div className="grid grid-cols-3 gap-2 justify-items-center">
          <button className="flex items-center justify-center group cursor-pointer" title="Guitar" onClick={() => handleTypeClick("guitar")}> 
            <img className="w-14 h-14 transition-transform duration-200 group-hover:scale-130" src="/guitar.png" alt="Guitar" />
          </button>
          <button className="flex items-center justify-center group cursor-pointer" title="Bass" onClick={() => handleTypeClick("bass")}> 
            <img className="w-14 h-14 transition-transform duration-200 group-hover:scale-130" src="/bass.png" alt="Bass" />
          </button>
          <button className="flex items-center justify-center group cursor-pointer" title="Acoustic" onClick={() => handleTypeClick("acoustic")}> 
            <img className="w-14 h-14 transition-transform duration-200 group-hover:scale-130" src="/acoustic.png" alt="Acoustic" />
          </button>
          <button className="flex items-center justify-center group cursor-pointer" title="Amp" onClick={() => handleTypeClick("amp")}> 
            <img className="w-14 h-14 transition-transform duration-200 group-hover:scale-130" src="/amp.png" alt="Amp" />
          </button>
          <button className="flex items-center justify-center group cursor-pointer" title="Pedal" onClick={() => handleTypeClick("pedal")}> 
            <img className="w-14 h-14 transition-transform duration-200 group-hover:scale-130" src="/pedal.png" alt="Pedal" />
          </button>
          <button className="flex items-center justify-center group cursor-pointer" title="Accessory / Parts" onClick={() => handleTypeClick("accessory")}> 
            <img className="w-14 h-14 transition-transform duration-200 group-hover:scale-130" src="/accessory.png" alt="Accessory / Parts" />
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
                title="Clear selected tags"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
        <TagSearch />

        <div className="relative">
          <div className="flex flex-wrap max-h-[250px] sm:max-h-[250px] md:max-h-[500px] lg:max-h-[700px] overflow-y-auto pr-1 pb-16 scrollbar-hide">
            {filteredTags.map((tag) => (
              <Tag 
                key={tag._id} 
                tag={tag} 
                selected={selectedTags.some(t => t._id === tag._id)}
                onClick={handleTagSelection}
                title={tag.name}
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