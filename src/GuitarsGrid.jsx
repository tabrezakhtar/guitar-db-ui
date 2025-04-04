import { useNavigate } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import InfiniteScroll from "react-infinite-scroll-component";
import { getCloudinaryThumbnail } from "./utils";
import { useGuitars } from "./hooks/useGuitars";

function GuitarsGrid() {
  const navigate = useNavigate();
  const { guitars, totalGuitars, loadMore } = useGuitars();

  return (
    <InfiniteScroll
      dataLength={guitars.length}
      next={loadMore}
      hasMore={totalGuitars > guitars.length}
      loader={
        <div className="flex justify-center p-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {guitars.map(({_id, brand, name, description, images}) => (
          <div
            key={_id}
            className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => navigate('/view/' + _id)}
          >
            <Thumbnail url={getCloudinaryThumbnail(images[0], 250)} alt={`Thumbnail: ${brand} ${name}`} />
            <div className="p-3 bg-gray-200 h-full">
              <h2 className="text-lg font-semibold">{brand} {name}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default GuitarsGrid;