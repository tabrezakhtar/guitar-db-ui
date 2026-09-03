import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import { useTagContext } from "../context/TagContext";
import Tag from "../tags/Tag";
import Spinner from "../components/Spinner";
import useInfiniteScroll from "../utils/useInfiniteScroll";
import { useEquipmentGridData } from "./useEquipmentGridData";
import TileSkeleton from "./TileSkeleton";
import { useUrlParams } from "../utils/useUrlParams";
import Tile from "./Tile";

function Grid() {
  const navigate = useNavigate();
  const { getParam, getArrayParam, updateParams } = useUrlParams();
  const {
    sortBy,
    sortOrder,
    setSortOptions,
    toggleLike,
    equipmentType,
    setEquipmentType,
  } = useContext(GuitarContext);

  const {
    selectedTags,
    handleTagSelection,
    setSelectedTagsByIds,
    setSelectedTagsByNames,
  } = useTagContext();

  const { user } = useContext(UserContext);
  const { tags } = useTagContext();
  const {
    searchTerm,
    handleSearch,
    clearSearch,
    equipment,
    totalEquipment,
    loading,
    loadMore,
    equipmentError,
    fetchEquipmentList,
    saveGridState,
    restoredScrollPosition,
  } = useEquipmentGridData();
  const [likedEquipment, setLikedEquipment] = useState({});
  const hasRestoredScroll = useRef(false);

  useEffect(() => {
    if (!restoredScrollPosition || !equipment.length || hasRestoredScroll.current) return;

    requestAnimationFrame(() => {
      window.scrollTo(0, restoredScrollPosition);
      sessionStorage.removeItem("equipment-grid-state");
      hasRestoredScroll.current = true;
    });
  }, [equipment.length, restoredScrollPosition]);

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

  const handleSortChange = (event) => {
    const [newSortBy, newSortOrder] = event.target.value.split("|");
    setSortOptions(newSortBy, newSortOrder);
    updateParams({
      sort: newSortBy,
      order: newSortOrder,
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
      type: null,
    });
  };

  const hasFiltersApplied =
    searchTerm.trim() || selectedTags.length > 0 || equipmentType;

  const handleTagSelectionWithUrl = (tag) => {
    handleTagSelection(tag);

    const isCurrentlySelected = selectedTags.some((t) => t._id === tag._id);
    let newSelectedTagNames;

    if (isCurrentlySelected) {
      newSelectedTagNames = selectedTags
        .filter((t) => t._id !== tag._id)
        .map((t) => t.name);
    } else {
      newSelectedTagNames = [...selectedTags.map((t) => t.name), tag.name];
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

      setLikedEquipment((prev) => ({
        ...prev,
        [equipmentItem._id]: !prev[equipmentItem._id],
      }));

      if (result && result.likes !== undefined) {
        equipmentItem.likesCount = result.likes;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleRefreshEquipment = async () => {
    try {
      await fetchEquipmentList(1);
    } catch (error) {
      console.error("Failed to refresh equipment:", error);
    }
  };

  const handleAvatarClick = (e, userId) => {
    e.stopPropagation();
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const containerRef = useInfiniteScroll({
    hasMore: totalEquipment > equipment.length,
    loading,
    onLoadMore: loadMore,
  });

  return (
    <div ref={containerRef} className="min-h-screen max-w-7xl mx-auto px-4">
      <h1 className="sr-only">Equipment Gallery</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[var(--color-text-header)]">
            {searchTerm.trim() ? equipment.length : totalEquipment || 0} Results
          </h2>
          {hasFiltersApplied && (
            <button
              onClick={handleClearAllFilters}
              className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 cursor-pointer"
              title="Clear all filters"
            >
              Reset Filters
            </button>
          )}
        </div>
        <div
          id="search-bar"
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search equipment..."
              className="border border-gray-300 rounded-lg p-2.5 pr-8 text-sm text-[var(--color-text-header)] w-full"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 sm:ml-4 w-full sm:w-auto"
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
          {selectedTags.map((tag) => (
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

      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && equipment.length === 0
          ? Array.from({ length: 9 }, (_, index) => (
              <TileSkeleton
                key={`skeleton-${index}`}
                tileClass="aspect-[4/5]"
              />
            ))
          : equipment.map((item) => (
              <Tile
                key={item._id}
                item={item}
                likedEquipment={likedEquipment}
                onLikeClick={handleLikeClick}
                onAvatarClick={handleAvatarClick}
                onItemClick={saveGridState}
              />
            ))}
      </div>
      {equipmentError && (
        <div className="flex flex-col items-center p-8">
          <p className="text-white mb-4">Sorry, the equipment failed to load</p>
          <button
            onClick={handleRefreshEquipment}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
            title="Refresh equipment data"
          >
            <span className="text-xl">↻</span>
            Refresh Equipment
          </button>
        </div>
      )}
      {loading && (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default Grid;
