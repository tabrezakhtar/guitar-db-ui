import { useNavigate } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGuitarContext } from "./context/GuitarContext";
import { useEffect } from "react";
import SkeletonImage from "./SkeletonImage";

function GuitarsGrid() {
  const navigate = useNavigate();
  const { equipment, totalEquipment, loading, loadMore, fetchEquipmentList } = useGuitarContext();

  useEffect(() => {
    fetchEquipmentList(1, "guitar");
  }, []);

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
        {equipment.map(({ _id, brand, name, description, images, likes }) => (
          <div
            key={_id}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => navigate("/view/" + _id)}
          >
            {images && images.length > 0 ? (
              <Thumbnail url={images[0]} alt={`Thumbnail: ${brand} ${name}`} />
            ) : (
              <SkeletonImage />
            )}
            <div className="p-3 bg-gray-200 h-full relative">
              <h2 className="text-lg font-semibold">{brand} {name}</h2>
              <p className="text-sm text-gray-600">{description}</p>
              {likes && likes.length > 0 && (
                <div className="right-2 flex items-center">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded inline-flex items-center">
                    <span className="mr-1">👍</span>
                    {likes.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default GuitarsGrid;