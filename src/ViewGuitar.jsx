import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useGuitarContext } from "./context/GuitarContext";
import SkeletonImage from "./SkeletonImage";

const ViewGuitar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEquipment: equipment, loading, fetchEquipment, clearCurrentEquipment } = useGuitarContext();

  useEffect(() => {
    fetchEquipment(id, "guitar");
  }, []);

  if (loading || !equipment) {
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
              clearCurrentEquipment();
              navigate(`/edit/${equipment._id}`);
            }}
            className="hover:underline text-blue-500"
          >
            Edit
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6">My Stuff!</h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4">
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
          </div>
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">
            {equipment?.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGuitar;