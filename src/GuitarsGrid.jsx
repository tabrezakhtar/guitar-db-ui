import { useNavigate } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGuitarContext } from "./context/GuitarContext";
import { useEffect } from "react";
import SkeletonImage from "./SkeletonImage";
import Tag from "./components/Tag";
import AvatarDisplayOnly from "./profile/AvatarDisplayOnly";

function GuitarsGrid() {
  const navigate = useNavigate();
  const { 
    equipment, 
    totalEquipment, 
    loading, 
    loadMore, 
    fetchEquipmentList, 
    setCurrentEquipment,
    updateEquipment,
    setSortOptions,
    sortBy,
    sortOrder,
    selectedTags,
    handleTagSelection,
  } = useGuitarContext();

  useEffect(() => {
    fetchEquipmentList(1, "guitar");
  }, [sortBy, sortOrder, selectedTags]);

  const generateObjectId = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0");
    const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0");
    
    return timestamp + machineId + processId + counter;
  };

  const handleSortChange = (event) => {
    const [newSortBy, newSortOrder] = event.target.value.split("|");
    setSortOptions(newSortBy, newSortOrder);
  };

  const handleLikeClick = (e, equipmentItem) => {
    e.stopPropagation();
    
    const newObjectId = generateObjectId();
    const updatedEquipment = {
      ...equipmentItem,
      likes: [...(equipmentItem.likes || []), newObjectId]
    };
    
    setCurrentEquipment(updatedEquipment);
    updateEquipment(equipmentItem.type.toLowerCase());
  };

  const handleAvatarClick = (e, userId) => {
    e.stopPropagation();
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const getEquipmentIcon = (type) => {
    switch(type?.toLowerCase()) {
      case "guitar":
        return "/guitar.png";
      case "amp":
        return "/amp.png";
      case "pedal":
        return "/pedal.png";
      default:
        return "/guitar.png";
    }
  };

  if (loading && equipment.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={equipment.length}
      next={() => loadMore("guitar")}
      hasMore={totalEquipment > equipment.length}
      loader={
        <div className="flex justify-center p-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{totalEquipment || 0} guitars</h2>
        
        <div className="flex items-center">
          <select 
            id="sort" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
            onChange={handleSortChange}
            value={`${sortBy}|${sortOrder}`}
          >
            <option value="date|desc">Newest First</option>
            <option value="date|asc">Oldest First</option>
            <option value="brand|asc">Brand (A-Z)</option>
            <option value="brand|desc">Brand (Z-A)</option>
          </select>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1 items-center">
          <span className="text-sm text-gray-600">Filtered by:</span>
          {selectedTags.map(tag => (
            <span className="m-1" key={tag._id}>
              <Tag 
                key={tag._id} 
                tag={tag} 
                selected={true}
                onClick={handleTagSelection}
              />
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {equipment.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 relative"
            onClick={() => navigate("/view/" + item._id)}
          >
            {item.images && item.images.length > 0 ? (
              <Thumbnail url={item.images[0]} alt={`Thumbnail: ${item.brand} ${item.name}`} />
            ) : (
              <SkeletonImage />
            )}
            
            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white shadow-sm flex items-center" onClick={(e) => { handleAvatarClick(e, item.user?._id) }}>
              <AvatarDisplayOnly imageUrl={item.user?.avatarUrl} username={item.user?.username} size="xsmall"/>
              <span className="pl-2 text-xs text-blue-500 hover:underline">{item.user ? item.user?.username.slice(0.12) : ""}</span>
            </div>
            
            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
              <img 
                src={getEquipmentIcon(item.type)} 
                alt={item.type} 
                className="w-6 h-6"
              />
            </div>
            
            <div className="p-3 bg-gray-200">
              <h2 className="text-lg font-semibold">{item.brand} {item.name}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  className="bg-purple-400 text-purple-900 text-xs px-2 py-1 rounded inline-flex items-center"
                  onClick={(e) => handleLikeClick(e, item)}
                >
                  <span className="mr-1">👍</span>
                  {item.likes ? item.likes.length : 0}
                </button>
                {item.commentCount > 0 && (
                  <span className="bg-teal-400 text-teal-900 text-xs px-2 py-1 rounded inline-flex items-center">
                    <span className="mr-1">💬</span>
                    {item.commentCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default GuitarsGrid;