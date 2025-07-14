import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import { useTagContext } from "../context/TagContext";
import SkeletonImage from "../components/SkeletonImage";
import Tag from "../tags/Tag";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import Spinner from "../components/Spinner";
import useInfiniteScroll from "../utils/useInfiniteScroll";
import { useEquipmentGridData } from "./useEquipmentGridData";
import { useImageDimensions } from "./useImageDimensions";
import TileSkeleton from "./TileSkeleton";
import { useUrlParams } from "../utils/useUrlParams";

function Grid() {
  const navigate = useNavigate();
  const { getParam, getArrayParam, updateParams } = useUrlParams();
  const { 
    sortBy,
    sortOrder,
    selectedTags,
    handleTagSelection,
    setSortOptions,
    toggleLike,
    equipmentType,
    setEquipmentType,
    setSelectedTagsByIds,
    setSelectedTagsByNames,
  } = useContext(GuitarContext);
  
  const { user } = useContext(UserContext);
  const { tags } = useTagContext();
  const { searchTerm, handleSearch, clearSearch, equipment, totalEquipment, loading, loadMore } = useEquipmentGridData();
  const { imageDimensions, loadingImages } = useImageDimensions(equipment);
  const [likedEquipment, setLikedEquipment] = useState({});
  const [columnsCount, setColumnsCount] = useState(1);

  useEffect(() => {
    const urlSearch = getParam("search");
    const urlSort = getParam("sort", "date");
    const urlOrder = getParam("order", "desc");
    const urlTags = getArrayParam("tags");
    const urlType = getParam("type");

    if (urlSearch) {
      handleSearch(urlSearch);
    }
    
    if (urlSort !== sortBy || urlOrder !== sortOrder) {
      setSortOptions(urlSort, urlOrder);
    }

    if (urlTags.length > 0 && tags.length > 0) {
      setSelectedTagsByNames(urlTags, tags);
    }

    if (urlType && urlType !== equipmentType) {
      setEquipmentType(urlType);
    }
  }, [tags]);

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

  const handleSortChange = (event) => {
    const [newSortBy, newSortOrder] = event.target.value.split("|");
    setSortOptions(newSortBy, newSortOrder);
    updateParams({
      sort: newSortBy,
      order: newSortOrder
    });
  };

  const handleSearchChange = (term) => {
    handleSearch(term);
    updateParams({ search: term });
  };

  const handleClearSearch = () => {
    clearSearch();
    updateParams({ search: null });
  };

  const handleClearAllFilters = () => {
    clearSearch();
    setSelectedTagsByIds([]);
    setEquipmentType("");
    updateParams({ 
      search: null, 
      tags: null, 
      type: null 
    });
  };

  const hasFiltersApplied = searchTerm.trim() || selectedTags.length > 0 || equipmentType;

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
      const result = await toggleLike(equipmentItem._id);
      
      setLikedEquipment(prev => ({
        ...prev,
        [equipmentItem._id]: !prev[equipmentItem._id]
      }));
      
      if (result && result.likes !== undefined) {
        equipmentItem.likesCount = result.likes;
      }
      
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
    onLoadMore: loadMore
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
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{searchTerm.trim() ? equipment.length : totalEquipment || 0} Results</h2>
          {hasFiltersApplied && (
            <button
              onClick={handleClearAllFilters}
              className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
              title="Clear all filters"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search equipment..."
              className="border border-gray-300 rounded-lg p-2.5 pr-8 text-sm"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
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
                onClick={handleTagSelectionWithUrl}
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
              let tileClass = "aspect-[4/5]";
              if (dims.width > dims.height * 1.2) {
                tileClass = "aspect-[4/3]";
              } else if (dims.height > dims.width * 1.2) {
                tileClass = "aspect-[3/5]";
              }

              if (imageUrl && loadingImages.has(item._id)) {
                return <TileSkeleton key={item._id} tileClass={tileClass} />;
              }

              return (
                <div
                  key={item._id}
                  className={`break-inside-avoid rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 relative group ${tileClass}`}
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
                    <div className="group-hover:[transform:rotateY(180deg)] transition-transform duration-500 [transform-style:preserve-3d]">
                      <div className="[backface-visibility:hidden] px-3 py-2 rounded bg-[rgba(31,41,55,0.3)]">
                        <h2 className="text-lg font-semibold text-center text-white drop-shadow-md">{item.brand} {item.name}</h2>
                      </div>
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center items-center">
                        <div className="rounded bg-[rgba(31,41,55,0.3)] px-3 py-2 max-w-full">
                          <p className="text-sm text-white text-center drop-shadow-md">{item.description.length <= 150 ? item.description : `${item.description.slice(0, 150)} ...`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 pointer-events-none">
                    <span className="bg-transparent text-white text-xs px-2 py-1 rounded inline-flex items-center drop-shadow-md pointer-events-auto">
                      <span className="mr-1">💬</span>
                      {item.commentCount}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 pointer-events-none">
                    <button
                      className={`${likedEquipment[item._id] ? "bg-purple-600 text-white" : "bg-purple-400 text-purple-900"} text-xs px-2 py-1 rounded inline-flex items-center transition-colors duration-200 drop-shadow-md pointer-events-auto hover:cursor-pointer`}
                      onClick={(e) => handleLikeClick(e, item)}
                      disabled={item.user?._id === user?._id}
                      title={!user ? "Create an account to like!" : ""}
                    >
                      <span className="mr-1">👍</span>
                      {item.likesCount || 0}
                    </button>
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

export default Grid;