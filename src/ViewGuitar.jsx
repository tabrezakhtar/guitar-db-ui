import { useParams, Link, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getCloudinaryThumbnail } from "./imageUtils";
import { useGuitarStore } from "./store/useGuitarStore";
import { useEffect } from "react";

function ViewGuitar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentGuitar: guitar, loading, fetchGuitar, clearCurrentGuitar } = useGuitarStore();

  useEffect(() => {
    fetchGuitar(id);
  }, [id]);

  if (loading || !guitar) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        <div className="mb-4">
          <Link to="/" className="hover:underline mr-4">Back</Link>
          <button
            onClick={() => {
              clearCurrentGuitar();
              navigate(`/edit/${guitar._id}`);
            }}
            className="hover:underline text-blue-500"
          >
            Edit
          </button>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4">
            {guitar?.images && guitar.images.length > 0 && (
              <ImageGallery 
                items={guitar.images.map(image => ({
                  original: image,
                  thumbnail: getCloudinaryThumbnail(image, 50),
                }))}
                showPlayButton={false}
                lazyLoad={true}
              />
            )}
          </div>
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">
            {guitar?.detailedDescription}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGuitar;