import { useNavigate } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGuitarContext } from "./context/GuitarContext";
import { useEffect } from "react";
import SkeletonImage from "./SkeletonImage";

function GuitarsGrid() {
  const navigate = useNavigate();
  const { 
    equipment, 
    totalEquipment, 
    loading, 
    loadMore, 
    fetchEquipmentList, 
    setCurrentEquipment,
    updateEquipment 
  } = useGuitarContext();

  useEffect(() => {
    fetchEquipmentList(1, "guitar");
  }, []);

  const generateObjectId = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0");
    const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0");
    
    return timestamp + machineId + processId + counter;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {equipment.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => navigate("/view/" + item._id)}
          >
            {item.images && item.images.length > 0 ? (
              <Thumbnail url={item.images[0]} alt={`Thumbnail: ${item.brand} ${item.name}`} />
            ) : (
              <SkeletonImage />
            )}
            <div className="p-3 bg-gray-200">
              <h2 className="text-lg font-semibold">{item.brand} {item.name}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="right-2 flex items-center">
                <button
                  className="bg-purple-400 text-purple-900 text-xs px-2 py-1 rounded inline-flex items-center"
                  onClick={(e) => handleLikeClick(e, item)}
                >
                  <span className="mr-1">👍</span>
                  {item.likes ? item.likes.length : 0}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default GuitarsGrid;