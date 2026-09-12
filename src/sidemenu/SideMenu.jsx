import { useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import { useTagContext } from "../context/TagContext";
import { hasAdminAccess } from "../utils/roleUtils";
import Tag from "../tags/Tag";
import TagSearch from "../tags/TagSearch";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import { useUrlParams } from "../utils/useUrlParams";
import Footer from "../Footer";

function SideMenu() {
  const { updateParams } = useUrlParams();
  const { 
    setEquipmentType,
    equipmentType
  } = useContext(GuitarContext);
  
  const { user } = useContext(UserContext);
    const { 
    tags,
    selectedTags,
    handleTagSelection,
    clearSelectedTags,
    refetchTags,
    tagSearchTerm,
  } = useTagContext();

  useEffect(() => {
    refetchTags();
  }, []);

  const sideMenuTags = tags
    .filter(tag => {
      const matchesSearch = !tagSearchTerm || 
        tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase());
      const hasCount = tag.count > 0;
      return matchesSearch && hasCount;
    })
    .sort((a, b) => (b.count || 0) - (a.count || 0));

  const sideMenuRef = useRef(null);
  const headerSectionRef = useRef(null);

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
    
    setEquipmentType("");
    updateParams({ tags: newSelectedTagNames, type: "" });
  };

  const handleClearTags = () => {
    clearSelectedTags();
    updateParams({ tags: null });
  };

  const equipmentTypes = [
    { key: "guitar", label: "Guitar", img: "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857213/vintage-semi1_r7n1vj.png" },
    { key: "bass", label: "Bass", img: "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857214/vintage-bass1_rzpl8q.png" },
    { key: "acoustic", label: "Acoustic", img: "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857213/acoustic1_o9agae.png" },
    { key: "amp", label: "Amp", img: "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857212/marshall1_e6ddzm.png" },
    { key: "pedal", label: "Pedal", img: "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857212/boss-ds1_qcqsiz.png" },
    { key: "accessory", label: "Accessory", img: "https://res.cloudinary.com/dx8d5hlk1/image/upload/v1759857214/mic_e4e0ec.png" }
  ];
  return (
  <aside 
      ref={sideMenuRef}
      className="bg-[var(--color-toggle-bg)] text-white w-full md:w-80 p-6 shadow-lg flex flex-col gap-6 bg-contain bg-top bg-no-repeat bg-[url('/guitar-bg-dark.svg')]"
    >
      <div ref={headerSectionRef}>
        <div className="md:hidden mb-4 pb-4 border-b border-gray-600">
          {user ? (
            <Link 
              to="/profile" 
              className="flex items-center justify-center hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <AvatarDisplayOnly imageUrl={user.avatarUrl} username={user.username} size="small"/>
              <span className="pl-3 font-medium">{user.username}</span>
              {hasAdminAccess(user) && (
                <img 
                  src="/verified.svg" 
                  alt="Verified" 
                  className="w-4 h-4 ml-1"
                />
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                <img src="/icons/user.svg" alt="user" className="w-4 h-4" />
              </div>
              <span className="pl-3 font-medium">Login</span>
            </Link>
          )}
          
          <div className="mt-3 space-y-1">
            <a href="/" className="block hover:underline py-2 px-2 rounded hover:bg-gray-700/50 transition-colors">Home</a>
            <a href="/contact" className="block hover:underline py-2 px-2 rounded hover:bg-gray-700/50 transition-colors">Contact</a>
          </div>
        </div>

        <div className="mb-4">
          <Link to="/add" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold" title="Add a new instrument">
            + Add New Equipment
          </Link>
        </div>
        <div>
          <div className="text-sm font-semibold mb-2 tracking-wide uppercase text-[var(--color-text-header)]">Select Equipment</div>
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
                  <img className="w-14 h-14 mb-1" src={typeObj.img} alt={typeObj.label} />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold flex items-center tracking-wide uppercase text-[var(--color-text-header)]">
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
      <div className="bg-gray-700/50 rounded-lg p-3 mt-2">
        <div 
          className="flex flex-wrap pr-1 gap-2 relative z-0 md:h-auto md:overflow-visible max-h-[50vh] md:max-h-none overflow-y-auto custom-scrollbar" 
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(128,128,128,0.5) transparent'
          }}
        >
          {sideMenuTags.map((tag) => (
            <Tag 
              key={tag._id} 
              tag={tag} 
              selected={selectedTags.some(t => t._id === tag._id)}
              onClick={handleTagSelectionWithUrl}
              title={tag.name}
              showCount={true}
              size="small"
            />))
          }
        </div>
      </div>

      <div className="mt-6">
        <Footer compact={true} />
      </div>
    </aside>
  );
}

export default SideMenu;