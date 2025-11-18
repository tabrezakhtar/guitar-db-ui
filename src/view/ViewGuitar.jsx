import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import Comments from "./Comments";
import StarRating from "../components/StarRating";
import Tag from "../tags/Tag";
import { formatDate } from "../utils/dateUtils";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import Gallery from "./Gallery";
import Breadcrumbs from "../components/Breadcrumbs";
import { EquipmentCarousel } from "../profile/EquipmentCard";
import { useEquipmentData } from "./useEquipmentData";

const ViewGuitar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    clearCurrentEquipment,
    setCurrentEquipment,
    toggleLike,
    fetchUserEquipment,
  } = useContext(GuitarContext);
  const { user } = useContext(UserContext);
  const { equipment, loading, error } = useEquipmentData(id);
  const [isLiked, setIsLiked] = useState(false);
  const [userOtherEquipment, setUserOtherEquipment] = useState([]);
  useEffect(() => {
    if (equipment) {
      setCurrentEquipment(equipment);
    }
    return () => {
      // Clear current equipment when component unmounts
      clearCurrentEquipment();
    };
  }, [equipment]);
  useEffect(() => {
    const fetchOtherEquipment = async () => {
      if (!equipment?.user?._id) return;

      try {
        const data = await fetchUserEquipment(equipment.user._id);
        if (data && data.items) {
          const otherEquipment = data.items.filter(
            (item) => item._id !== equipment._id,
          );
          setUserOtherEquipment(otherEquipment);
        }
      } catch (error) {
        console.error("Error fetching user's other equipment:", error);
      }
    };

    fetchOtherEquipment();
  }, [equipment]);

  const handleLikeToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (equipment.user && user._id === equipment.user._id) {
      return;
    }

    try {
      await toggleLike(equipment._id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const renderSkeleton = () => (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-[#122634]">
      <div className="p-6">
        <div className="mb-4">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border dark:border-gray-600 rounded-lg p-2 sm:p-4 relative flex flex-col overflow-hidden">
            <div className="aspect-video bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="absolute top-4 right-4">
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border dark:border-gray-600 rounded-lg p-4 overflow-hidden">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-32">
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 border dark:border-gray-600 rounded-lg p-4">
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-16 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading || !equipment) {
    return renderSkeleton();
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  const likesCount = equipment.likesCount || 0;
  const canEdit = user && equipment.user && user._id === equipment.user._id;

  const breadcrumbItems = [
    {
      label: equipment.type
        ? "Viewing " +
          equipment.type.charAt(0).toUpperCase() +
          equipment.type.slice(1)
        : "Equipment",
      url: "/",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-[#122634]">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {equipment.name || "My Stuff!"}
          </h1>
          {canEdit && (
            <button
              onClick={() => {
                clearCurrentEquipment();
                navigate(`/edit/${equipment._id}`);
              }}
              className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              ✏️Edit
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border dark:border-gray-600 rounded-lg p-2 sm:p-4 relative flex flex-col overflow-hidden">
            <Gallery equipment={equipment} />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={handleLikeToggle}
                disabled={canEdit || !user}
                className={`inline-flex items-center ${isLiked ? "bg-purple-600 text-white" : "bg-purple-400 dark:bg-purple-500 text-purple-900 dark:text-purple-100"} px-2 py-1 rounded transition-colors duration-200 ${!user || canEdit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="mr-1 text-lg">👍</span>
                {likesCount} {likesCount === 1 ? "Like" : "Likes"}
              </button>
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border dark:border-gray-600 rounded-lg p-4 overflow-hidden">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  Details
                </h2>
                <div className="space-y-2 text-black dark:text-white">
                  <p>
                    <span className="font-medium">Brand:</span>{" "}
                    {equipment.brand || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {equipment.type || "Not specified"}
                  </p>
                  {equipment.shape && (
                    <p>
                      <span className="font-medium">Shape:</span>{" "}
                      {equipment.shape}
                    </p>
                  )}
                  {equipment.year && (
                    <p>
                      <span className="font-medium">Year:</span>{" "}
                      {equipment.year}
                    </p>
                  )}
                  {equipment.ampType && (
                    <p>
                      <span className="font-medium">Amp Type:</span>{" "}
                      {equipment.ampType}
                    </p>
                  )}
                  {equipment.effectType && (
                    <p>
                      <span className="font-medium">Effect Type:</span>{" "}
                      {equipment.effectType}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Added:</span>{" "}
                    {formatDate(equipment.date)}
                  </p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Rating:</span>
                    <StarRating
                      rating={equipment.rating || 0}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  Description
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto whitespace-pre-wrap break-words text-black dark:text-white font-['Roboto_Mono'] text-xl">
                  {equipment.description || "No description provided."}
                </div>
              </div>

              {equipment.recommendation && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
                    Recommendation
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-black dark:text-white">
                    {equipment.recommendation}
                  </div>
                </div>
              )}
            </div>

            {equipment.tags && equipment.tags.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {equipment.tags.map((tag) => (
                    <Tag
                      key={tag._id}
                      tag={tag}
                      selected={true}
                      readonly={true}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
                Owner
              </h2>
              <div className="flex items-center gap-3">
                <NavLink
                  to={`/profile/${equipment.user?._id}`}
                  className="hover:opacity-80 transition-opacity"
                >
                  <AvatarDisplayOnly
                    imageUrl={equipment.user?.avatarUrl}
                    username={equipment.user?.username || "Unknown"}
                    size="small"
                  />
                </NavLink>
                <span className="font-medium text-black dark:text-white">
                  {equipment.user?.username || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Comments equipmentId={equipment._id} />
        </div>

        {userOtherEquipment.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-white text-xl font-semibold text-gray-900 mb-6">
              More from {equipment?.user?.firstName || "this user"}
            </h3>
            <EquipmentCarousel items={userOtherEquipment} cardSize="medium" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewGuitar;
