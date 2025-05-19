import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useGuitarContext } from "../context/GuitarContext";
import { useUserContext } from "../context/UserContext";
import SkeletonImage from "../SkeletonImage";
import Comments from "./Comments";
import StarRating from "../components/StarRating";
import Tag from "../components/Tag";
import { formatDate } from "../dateUtils";
import AvatarDisplayOnly from "../profile/AvatarDisplayOnly";
import { getCloudinaryThumbnail } from "../imageUtils";

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
  
  const getGalleryItems = () => {
    const galleryItems = equipment.images?.map(image => ({
      original: image,
      thumbnail: getCloudinaryThumbnail(image),
    })) || [];
    
    if (equipment.url && equipment.url.includes("youtube.com")) {
      let videoId;
      
      if (equipment.url.includes("/shorts/")) {
        // Extract video ID from YouTube Shorts URL
        const shortsMatch = equipment.url.match(/\/shorts\/([^/?]+)/);
        videoId = shortsMatch ? shortsMatch[1] : null;
      } else {
        // Extract video ID from traditional YouTube URL
        videoId = new URL(equipment.url).searchParams.get("v");
      }
      
      if (videoId) {
        galleryItems.push({
          original: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          renderItem: () => (
            <div className="image-gallery-image">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )
        });
      }
    }
    
    return galleryItems;
  };
  
  const galleryItems = getGalleryItems();

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
        <h1 className="text-3xl font-bold mb-6">{equipment.name || "My Stuff!"}</h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4 relative flex flex-col">
            <div className="flex-grow h-full">
              {galleryItems.length > 0 ? (
                <div className="h-full flex flex-col">
                  <ImageGallery 
                    items={galleryItems}
                    showPlayButton={false}
                    lazyLoad={true}
                    additionalClass="h-full flex-grow gallery-container"
                  />
                </div>
              ) : (
                <SkeletonImage />
              )}
            </div>
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
          <Comments comments={equipment.comments} equipmentId={equipment._id} />
        </div>
      </div>
    </div>
  );
}

export default ViewGuitar;