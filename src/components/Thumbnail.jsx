import { useState, useContext } from "react";
import { GuitarContext } from "../context/GuitarContext";
import { getCombinedUrl } from "../utils/cloudinaryUtils";
import Modal from "./Modal";
import Spinner from "./Spinner";

const Thumbnail = ({ index, url, alt, showDelete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { deleteImage } = useContext(GuitarContext);

  const handleDelete = async () => {
    setShowModal(false);
    setIsDeleting(true);
    try {
      await deleteImage(getCombinedUrl(url));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative w-full aspect-square">
      {typeof index === "number" && !isNaN(index) && 
        <span className="absolute inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-medium">
          {index + 1}
        </span>
      }
      {(isLoading || isDeleting) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {showDelete && !isDeleting && (
        <span
          onClick={() => setShowModal(true)}
          className="absolute bottom-0 right-0 bg-red-500 text-white hover:bg-red-800 font-bold text-sm cursor-pointer flex items-center justify-center w-5 h-5 rounded-md"
        >
          ✕
        </span>
      )}
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
      />
      {showModal && (
        <Modal
          message="Are you sure you want to delete this image?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Thumbnail;