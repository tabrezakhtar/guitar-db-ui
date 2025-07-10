import { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GuitarContext } from "../context/GuitarContext";
import { UserContext } from "../context/UserContext";
import Comments from "./Comments";
import StarRating from "../components/StarRating";
import Tag from "../tags/Tag";
import { formatDate } from "../utils/dateUtils";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import Gallery from "./Gallery";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";
import { useEquipmentData } from "./useEquipmentData";

const ViewGuitar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clearCurrentEquipment, setCurrentEquipment, toggleLike } = useContext(GuitarContext);
  const { user } = useContext(UserContext);
  const { equipment, loading, error } = useEquipmentData(id);
  const [isLiked, setIsLiked] = useState(false);

  // Set currentEquipment in context when equipment is loaded
  useEffect(() => {
    if (equipment) {
      setCurrentEquipment(equipment);
    }
    return () => {
      // Clear current equipment when component unmounts
      clearCurrentEquipment();
    };
  }, [equipment]); // Only depend on equipment changing

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

  if (loading || !equipment) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const likesCount = equipment.likesCount || 0;
  const canEdit = user && equipment.user && user._id === equipment.user._id;
  
  const breadcrumbItems = [
    {
      label: equipment.type ? "Viewing " + equipment.type.charAt(0).toUpperCase() + equipment.type.slice(1) : "Equipment",
      url: "/"
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{equipment.name || "My Stuff!"}</h1>
          {canEdit && (
            <button
              onClick={() => {
                clearCurrentEquipment();
                navigate(`/edit/${equipment._id}`);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              ✏️Edit
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4 relative flex flex-col">
            <Gallery equipment={equipment} />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={handleLikeToggle}
                disabled={canEdit}
                className={`inline-flex items-center ${isLiked ? "bg-purple-600 text-white" : "bg-purple-400 text-purple-900"} px-2 py-1 rounded transition-colors duration-200`}
              >
                <span className="mr-1 text-lg">👍</span>
                {likesCount} {likesCount === 1 ? "Like" : "Likes"}
              </button>
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4 overflow-hidden">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Brand:</span> {equipment.brand || "Not specified"}</p>
                  <p><span className="font-medium">Type:</span> {equipment.type || "Not specified"}</p>
                  {equipment.shape && (
                    <p><span className="font-medium">Shape:</span> {equipment.shape}</p>
                  )}
                  {equipment.year && (
                    <p><span className="font-medium">Year:</span> {equipment.year}</p>
                  )}
                  {equipment.ampType && (
                    <p><span className="font-medium">Amp Type:</span> {equipment.ampType}</p>
                  )}
                  {equipment.effectType && (
                    <p><span className="font-medium">Effect Type:</span> {equipment.effectType}</p>
                  )}
                  <p><span className="font-medium">Added:</span> {formatDate(equipment.date)}</p>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Rating:</span>
                    <StarRating rating={equipment.rating || 0} disabled={true} />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
                  {equipment.description || "No description provided."}
                </div>
              </div>
              
              {equipment.why && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-2">Why I Like It</h2>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
                    {equipment.why}
                  </div>
                </div>
              )}
              
              {equipment.recommendation && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-2">Recommendation</h2>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
                    {equipment.recommendation}
                  </div>
                </div>
              )}
            </div>
            
            {equipment.tags && equipment.tags.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Tags</h2>
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
              <h2 className="text-xl font-semibold mb-2">Owner</h2>
              <div className="flex items-center gap-3">
                <AvatarDisplayOnly 
                  imageUrl={equipment.user?.avatarUrl} 
                  username={equipment.user?.username || "Unknown"}
                  size="small"
                />
                <span className="font-medium">{equipment.user?.username || "Unknown"}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Comments equipmentId={equipment._id} />
        </div>
      </div>
    </div>
  );
}

export default ViewGuitar;