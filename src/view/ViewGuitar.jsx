import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useGuitarContext } from "../context/GuitarContext";
import { useUserContext } from "../context/UserContext";
import SkeletonImage from "../SkeletonImage";
import Comments from "./Comments";

const ViewGuitar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEquipment: equipment, loading, fetchEquipment, clearCurrentEquipment, toggleLike } = useGuitarContext();
  const { user } = useUserContext();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchEquipment(id, "guitar");
  }, []);

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
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const likesCount = equipment.likesCount || 0;
  const canEdit = user && equipment.user && user._id === equipment.user._id;

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        <div className="mb-4">
          <Link to="/" className="hover:underline mr-4">Back</Link>
          {canEdit && (
            <button
              onClick={() => {
                clearCurrentEquipment();
                navigate(`/edit/${equipment._id}`);
              }}
              className="hover:underline text-blue-500"
            >
              Edit
            </button>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-6">My Stuff!</h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4 relative">
            {equipment?.images && equipment.images.length > 0 ? (
              <ImageGallery 
                items={equipment.images.map(image => ({
                  original: image,
                  thumbnail: image,
                }))}
                showPlayButton={false}
                lazyLoad={true}
              />
            ) : (
              <SkeletonImage />
            )}
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
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">
            {equipment?.description}
          </div>
        </div>
        
        <div className="mt-6">
          <Comments comments={equipment.comments} equipmentId={equipment._id} />
        </div>
      </div>
    </div>
  );
}

export default ViewGuitar;