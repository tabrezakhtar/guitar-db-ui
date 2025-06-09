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
    clearSelectedTags,
    setEquipmentType,
    fetchEquipmentList
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

    setEquipmentType(type);
    fetchEquipmentList(1);
  };

  return (
    <aside className="bg-gray-800 text-white w-full md:w-1/4 p-6 shadow-lg min-h-[400px] flex flex-col gap-6 bg-[url('/guitar-bg.svg')] bg-contain bg-top bg-no-repeat">
      <div className="mb-4">
        <Link to="/add" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold" title="Add a new instrument">
          + Add New Equipment
        </Link>
      </div>
      <div>
        <div className="text-sm font-semibold mb-2 tracking-wide uppercase">Select Equipment</div>
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-gray-700/50 hover:bg-gray-600/60 flex flex-col items-center justify-center p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer w-full" title="Guitar" onClick={() => handleTypeClick("guitar")}> 
            <img className="w-10 h-10 mb-1" src="/guitar.png" alt="Guitar" />
            <span className="text-xs">Guitar</span>
          </button>
          <button className="bg-gray-700/50 hover:bg-gray-600/60 flex flex-col items-center justify-center p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer w-full" title="Bass" onClick={() => handleTypeClick("bass")}> 
            <img className="w-10 h-10 mb-1" src="/bass.png" alt="Bass" />
            <span className="text-xs">Bass</span>
          </button>
          <button className="bg-gray-700/50 hover:bg-gray-600/60 flex flex-col items-center justify-center p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer w-full" title="Acoustic" onClick={() => handleTypeClick("acoustic")}> 
            <img className="w-10 h-10 mb-1" src="/acoustic.png" alt="Acoustic" />
            <span className="text-xs">Acoustic</span>
          </button>
          <button className="bg-gray-700/50 hover:bg-gray-600/60 flex flex-col items-center justify-center p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer w-full" title="Amp" onClick={() => handleTypeClick("amp")}> 
            <img className="w-10 h-10 mb-1" src="/amp.png" alt="Amp" />
            <span className="text-xs">Amp</span>
          </button>
          <button className="bg-gray-700/50 hover:bg-gray-600/60 flex flex-col items-center justify-center p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer w-full" title="Pedal" onClick={() => handleTypeClick("pedal")}> 
            <img className="w-10 h-10 mb-1" src="/pedal.png" alt="Pedal" />
            <span className="text-xs">Pedal</span>
          </button>
          <button className="bg-gray-700/50 hover:bg-gray-600/60 flex flex-col items-center justify-center p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer w-full" title="Accessory / Parts" onClick={() => handleTypeClick("accessory")}> 
            <img className="w-10 h-10 mb-1" src="/accessory.png" alt="Accessory / Parts" />
            <span className="text-xs">Accessory</span>
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold flex items-center tracking-wide uppercase">
            Select Tags
          </div>
          <div>
            {selectedTags.length > 0 && (
              <button 
                onClick={clearSelectedTags}
                className="text-xs ml-2 px-2 py-1 bg-blue-600 hover:bg-gray-700 rounded transition-colors duration-200"
                title="Clear selected tags"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <TagSearch />
        <div className="relative bg-gray-700/50 rounded-lg p-3 mt-2" style={{ minHeight: 250, maxHeight: 800 }}>
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-700/50 to-transparent pointer-events-none rounded-t-lg z-10"></div>
          <div className="flex flex-wrap overflow-y-auto pr-1 pb-8 gap-2 scrollbar-hide relative z-0" style={{ maxHeight: 700 }}>
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
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-700/50 to-transparent pointer-events-none rounded-b-lg z-10"></div>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;