import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import { useTagContext } from "../context/TagContext";
import Tag from "../tags/Tag";
import TagSearch from "../tags/TagSearch";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import { useUrlParams } from "../utils/useUrlParams";
import { useSideMenuHeight } from "../hooks/useSideMenuHeight";

function SideMenu() {
  const { updateParams } = useUrlParams();
  const { 
    setEquipmentType,
    equipmentType
  } = useContext(GuitarContext);
  
  const { user } = useContext(UserContext);
  
  const { 
    filteredTags, 
    selectedTags,
    handleTagSelection,
    clearSelectedTags 
  } = useTagContext();

  const { sideMenuHeight, tagsListHeight, sideMenuRef, headerSectionRef } = useSideMenuHeight();

  const handleEquipmentTypeChange = (type) => {
    setEquipmentType(type);
    updateParams({ type });
  };

  const handleTagSelectionWithUrl = (tag) => {
    handleTagSelection(tag);
    
    const isCurrentlySelected = selectedTags.some(t => t._id === tag._id);
    let newSelectedTagNames;
    
    if (isCurrentlySelected) {
      newSelectedTagNames = selectedTags.filter(t => t._id !== tag._id).map(t => t.name);
    } else {
      newSelectedTagNames = [...selectedTags.map(t => t.name), tag.name];
    }
    
    updateParams({ tags: newSelectedTagNames });
  };

  const handleClearTags = () => {
    clearSelectedTags();
    updateParams({ tags: null });
  };

  const equipmentTypes = [
    { key: "guitar", label: "Guitar", img: "/guitar.png" },
    { key: "bass", label: "Bass", img: "/bass.png" },
    { key: "acoustic", label: "Acoustic", img: "/acoustic.png" },
    { key: "amp", label: "Amp", img: "/amp.png" },
    { key: "pedal", label: "Pedal", img: "/pedal.png" },
    { key: "accessory", label: "Accessory", img: "/accessory.png" }
  ];

  return (
    <aside 
      ref={sideMenuRef}
      className="bg-gray-800 text-white w-full md:w-80 p-6 shadow-lg flex flex-col gap-6 bg-[url('/guitar-bg.svg')] bg-contain bg-top bg-no-repeat"
      style={{ height: sideMenuHeight }}
    >
      <div ref={headerSectionRef}>
        {/* User Profile Section - Only show on small screens */}
        <div className="md:hidden mb-4 pb-4 border-b border-gray-600">
          {user ? (
            <Link 
              to="/profile" 
              className="flex items-center justify-center hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <AvatarDisplayOnly imageUrl={user.avatarUrl} username={user.username} size="small"/>
              <span className="pl-3 font-medium">{user.username}</span>
            </Link>
          ) : (
            <a 
              href={`${import.meta.env.VITE_API_BASE_URL}/register`} 
              className="flex items-center justify-center hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                +
              </div>
              <span className="pl-3 font-medium">Create Profile</span>
            </a>
          )}
          
          {/* Navigation Links - Only show on small screens */}
          <div className="mt-3 space-y-1">
            <Link to="/" className="block hover:underline py-2 px-2 rounded hover:bg-gray-700/50 transition-colors">Home</Link>
            <Link to="/contact" className="block hover:underline py-2 px-2 rounded hover:bg-gray-700/50 transition-colors">Contact</Link>
            <Link to="/about" className="block hover:underline py-2 px-2 rounded hover:bg-gray-700/50 transition-colors">About</Link>
          </div>
        </div>

        <div className="mb-4">
          <Link to="/add" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold" title="Add a new instrument">
            + Add New Equipment
          </Link>
        </div>
        <div>
          <div className="text-sm font-semibold mb-2 tracking-wide uppercase">Select Equipment</div>
          <div className="flex flex-wrap gap-3 mb-4">
            {equipmentTypes.map(typeObj => {
              const isSelected = equipmentType === typeObj.key;
              return (
                <button
                  key={typeObj.key}
                  className={`bg-gray-700/50 hover:bg-gray-600/60 flex flex-col items-center justify-center p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer relative border-2 aspect-square min-w-[80px] flex-shrink-0 ${isSelected ? "ring-2 ring-offset-1 ring-white border-white scale-105" : "border-transparent"}`}
                  title={typeObj.label}
                  onClick={() => handleEquipmentTypeChange(typeObj.key === equipmentType ? "" : typeObj.key)}
                  style={{
                    boxShadow: isSelected ? "0 0 0 2px #fff" : undefined
                  }}
                >
                  <img className="w-10 h-10 mb-1" src={typeObj.img} alt={typeObj.label} />
                  <span className="text-xs">{typeObj.label}</span>
                </button>
              );
            })}
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
                  onClick={handleClearTags}
                  className="text-xs ml-2 px-2 py-1 bg-blue-600 hover:bg-gray-700 rounded transition-colors duration-200"
                  title="Clear selected tags"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <TagSearch />
        </div>
      </div>
      <div className="relative bg-gray-700/50 rounded-lg p-3 mt-2 flex-1">
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-700/50 to-transparent pointer-events-none rounded-t-lg z-10"></div>
        <div 
          className="flex flex-wrap overflow-y-auto pr-1 pb-8 gap-2 relative z-0 custom-scrollbar" 
          style={{ 
            height: tagsListHeight,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.3) transparent'
          }}
        >
          {filteredTags.map((tag) => (
            <Tag 
              key={tag._id} 
              tag={tag} 
              selected={selectedTags.some(t => t._id === tag._id)}
              onClick={handleTagSelectionWithUrl}
              title={tag.name}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-700/50 to-transparent pointer-events-none rounded-b-lg z-10"></div>
      </div>
    </aside>
  );
}

export default SideMenu;