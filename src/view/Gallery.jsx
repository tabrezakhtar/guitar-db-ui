import CustomImageGallery from "../components/CustomImageGallery";
import { getCloudinaryThumbnail } from "../utils/cloudinaryUtils";
import SkeletonImage from "../components/SkeletonImage";

const Gallery = ({ equipment }) => {
  const getGalleryItems = () => {
    const galleryItems = equipment?.images?.map(image => ({
      original: image,
      thumbnail: getCloudinaryThumbnail(image),
    })) || [];
    
    if (equipment?.url && equipment.url.includes("youtube.com")) {
      let videoId;
      
      if (equipment.url.includes("/shorts/")) {
        const shortsMatch = equipment.url.match(/\/shorts\/([^/?]+)/);
        videoId = shortsMatch ? shortsMatch[1] : null;
      } else {
        videoId = new URL(equipment.url).searchParams.get("v");
      }
      
      if (videoId) {
        galleryItems.push({
          original: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          thumbnail: `https://res.cloudinary.com/dx8d5hlk1/image/fetch/c_crop,g_center,w_150,h_150/https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          renderItem: () => (
            <div className="image-gallery-image relative w-full h-full overflow-hidden">
              <iframe
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw]"
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
    <div className="flex-grow h-full">
      {galleryItems.length > 0 ? (
        <div className="h-full flex flex-col">
          <CustomImageGallery 
            items={galleryItems}
            additionalClass="h-full flex-grow gallery-container"
          />
        </div>
      ) : (
        <SkeletonImage />
      )}
    </div>
  );
};

export default Gallery;