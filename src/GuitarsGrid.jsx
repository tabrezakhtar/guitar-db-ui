import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Thumbnail from "./components/Thumbnail";
import { GuitarContext } from "./context/GuitarContext";
import { UserContext } from "./context/UserContext";
import SkeletonImage from "./components/SkeletonImage";
import Tag from "./components/Tag";
import AvatarDisplayOnly from "./profile/AvatarDisplayOnly";
import Spinner from "./components/Spinner";
import useInfiniteScroll from "./utils/useInfiniteScroll";

function GuitarsGrid() {
  const navigate = useNavigate();
  const { 
    equipment, 
    totalEquipment, 
    loading, 
    loadMore, 
    fetchEquipmentList, 
    sortBy,
    sortOrder,
    selectedTags,
    handleTagSelection,
    setSortOptions,
    toggleLike,
    searchTerm,
    setSearchTerm,
    searchEquipment,
    equipmentType
  } = useContext(GuitarContext);
  
  const { user } = useContext(UserContext);
  const [likedEquipment, setLikedEquipment] = useState({});
  const [imageDimensions, setImageDimensions] = useState({});
  const [columnsCount, setColumnsCount] = useState(1);

  const updateColumnsCount = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setColumnsCount(3);
    } else if (window.innerWidth >= 768) {
      setColumnsCount(2);
    } else {
      setColumnsCount(1);
    }
  }, []);

  useEffect(() => {
    updateColumnsCount();
    window.addEventListener("resize", updateColumnsCount);
    return () => window.removeEventListener("resize", updateColumnsCount);
  }, [updateColumnsCount]);

  useEffect(() => {
    if (searchTerm.trim()) return;
    fetchEquipmentList(1);
  }, [sortBy, sortOrder, selectedTags, equipmentType, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    const timeoutId = setTimeout(() => {
      searchEquipment(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const newDimensions = {};
    let isMounted = true;
    const promises = equipment.map((item) => {
      const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
      if (!imageUrl) return Promise.resolve();
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = function () {
          if (isMounted) {
            newDimensions[item._id] = { width: img.naturalWidth, height: img.naturalHeight };
          }
          resolve();
        };
        img.onerror = function () {
          resolve();
        };
        img.src = imageUrl;
      });
    });
    Promise.all(promises).then(() => {
      if (isMounted) setImageDimensions(newDimensions);
    });
    return () => { isMounted = false; };
  }, [equipment]);

  const handleSortChange = (event) => {
    const [newSortBy, newSortOrder] = event.target.value.split("|");
    setSortOptions(newSortBy, newSortOrder);
  };

  const handleLikeClick = async (e, equipmentItem) => {
    e.stopPropagation();
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (equipmentItem.user?._id === user._id) {
      return;
    }
    
    try {
      await toggleLike(equipmentItem._id);
      setLikedEquipment(prev => ({
        ...prev,
        [equipmentItem._id]: !prev[equipmentItem._id]
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
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
      case "bass":
        return "/bass.png";
      case "acoustic":
        return "/acoustic.png";
      case "accessory":
        return "/accessory.png";
      default:
        return "/guitar.png";
    }
  };

  const containerRef = useInfiniteScroll({
    hasMore: totalEquipment > equipment.length,
    loading,
    onLoadMore: () => loadMore("")
  });

  function sortMasonryItems(items, columnsCount, imageDimensions) {
    const columns = Array.from({ length: columnsCount }, () => []);
    const columnsHeights = Array.from({ length: columnsCount }, () => 0);
    items.forEach((item) => {
      const dims = imageDimensions[item._id] || { width: 1, height: 1 };
      let aspect = 1;
      if (dims.width > dims.height * 1.2) {
        aspect = 16 / 9;
      } else if (dims.height > dims.width * 1.2) {
        aspect = 3 / 4;
      }
      // Estimate height for balancing
      const estimatedHeight = 1 / aspect;
      const minCol = columnsHeights.indexOf(Math.min(...columnsHeights));
      columns[minCol].push(item);
      columnsHeights[minCol] += estimatedHeight;
    });
    return columns;
  }

  const masonryColumns = sortMasonryItems(equipment, columnsCount, imageDimensions);

  return (
    <div ref={containerRef} className="min-h-screen max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{searchTerm.trim() ? equipment.length : totalEquipment || 0} Results</h2>
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search equipment..."
              className="border border-gray-300 rounded-lg p-2.5 pr-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
                type="button"
                aria-label="Clear search"
              >
                <span className="text-lg">✖️</span>
              </button>
            )}
          </div>
          <select 
            id="sort" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 ml-4"
            onChange={handleSortChange}
            value={`${sortBy}|${sortOrder}`}
          >
            <option value="date|desc">Newest First</option>
            <option value="date|asc">Oldest First</option>
            <option value="brand|asc">Brand (A-Z)</option>
            <option value="brand|desc">Brand (Z-A)</option>
            <option value="rating|asc">Lowest Rated</option>
            <option value="rating|desc">Highest Rated</option>
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

      <div className="flex gap-4">
        {masonryColumns.map((column, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col space-y-4">
            {column.map((item) => {
              const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
              const dims = imageDimensions[item._id] || { width: 1, height: 1 };
              let tileClass = "aspect-square";
              if (dims.width > dims.height * 1.2) {
                tileClass = "aspect-video";
              } else if (dims.height > dims.width * 1.2) {
                tileClass = "aspect-[3/4]";
              }
              return (
                <div
                  key={item._id}
                  className={`break-inside-avoid border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 relative animate__animated animate__fadeIn ${tileClass}`}
                  onClick={() => navigate("/view/" + item._id)}
                >
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={`Thumbnail: ${item.brand} ${item.name}`} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full">
                      <SkeletonImage />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[rgba(31,41,55,0.3)] shadow-sm flex items-center" onClick={(e) => { handleAvatarClick(e, item.user?._id) }}>
                    <AvatarDisplayOnly imageUrl={item.user?.avatarUrl} username={item.user?.username} size="xsmall"/>
                    <Link to={item.user?._id ? `/profile/${item.user._id}` : "#"} onClick={(e) => e.stopPropagation()} className="pl-2 text-xs text-white drop-shadow-md hover:underline">
                      <span className="">{item.user ? item.user?.username.slice(0,12) : ""}</span>
                    </Link>
                  </div>
                  <div className="absolute top-2 right-2 bg-[rgba(31,41,55,0.3)] rounded-full p-1 shadow-md flex items-center justify-center">
                    <img 
                      src={getEquipmentIcon(item.type)} 
                      alt={item.type} 
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-3 pointer-events-none">
                    <div className="px-3 py-2 rounded bg-[rgba(31,41,55,0.3)]">
                      <h2 className="text-lg font-semibold text-center text-white drop-shadow-md">{item.brand} {item.name}</h2>
                      <p className="text-sm text-white text-center drop-shadow-md">{item.description.length <= 150 ? item.description : `${item.description.slice(0, 150)} ...`}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <button
                          className={`${likedEquipment[item._id] ? "bg-purple-600 text-white" : "bg-purple-400 text-purple-900"} text-xs px-2 py-1 rounded inline-flex items-center transition-colors duration-200 drop-shadow-md pointer-events-auto`}
                          onClick={(e) => handleLikeClick(e, item)}
                          disabled={item.user?._id === user?._id}
                        >
                          <span className="mr-1">👍</span>
                          {item.likesCount || 0}
                        </button>
                        <span className="bg-teal-400 text-white text-xs px-2 py-1 rounded inline-flex items-center drop-shadow-md pointer-events-auto">
                          <span className="mr-1">💬</span>
                          {item.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default GuitarsGrid;