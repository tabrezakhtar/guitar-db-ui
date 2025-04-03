import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Thumbnail from "./Thumbnail"
import InfiniteScroll from "react-infinite-scroll-component";
import { getCloudinaryThumbnail } from "./utils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GuitarsGrid() {
  const navigate = useNavigate();
  const [guitars, setGuitars] = useState([]);
  const [page, setPage] = useState(1);
  const [totalGuitars, setTotalGuitars] = useState(0);

  const fetchGuitars = async (page) => {
    try {
      const response = await fetch(`${BASE_URL}/api/guitars?page=${page}&limit=20`);
      const data = await response.json();
      setGuitars([...guitars, ...data.guitars]);
      page === 1 && setTotalGuitars(() => data.total);
    } catch (error) {
      console.error("Error fetching guitars:", error);
    }
  };

  useEffect(() => {
    let subscribed = true;
    (async () => {
      if (subscribed) {
        await fetchGuitars(1);
      }
    })();
    return () => {
      subscribed = false;
    };
  }, []);

  const handleLoadMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchGuitars(nextPage);
      return nextPage;
    });
  };

  return (
    <InfiniteScroll
      dataLength={guitars.length}
      next={handleLoadMoreData}
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
          className="border rounded-lgx overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
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