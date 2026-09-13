import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import EditImages from "./EditImages";
import Modal from "../components/Modal";
import SuccessMessage from "./SuccessMessage";
import EquipmentForm from "./EquipmentForm";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";
import { useEditEquipmentData } from "./useEditEquipmentData";

function EditGuitar({ mode = "edit", type = "" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isGuest } = useContext(UserContext) || {};
  
  const {
    equipment: currentEquipment,
    loading,
    updateEquipment,
    addEquipment,
    deleteEquipment,
    setEquipment: setCurrentEquipment,
    cloudinaryUpload,
    filesToUpload,
    setFilesToUpload,
    deleteImage,
    generateDescription,
  } = useEditEquipmentData(id, mode);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (mode === "add" && !initialized) {
      if (!user) {
        navigate("/gallery");
        return;
      }
      
      const defaultEquipment = {
        brand: "",
        description: "",
        name: "",
        recommendation: "",
        type,
        why: "",
        userId: user._id,
        visibility: 0,
      };

      if (type === "guitar") {
        Object.assign(defaultEquipment, { shape: "" });
      } else if (type === "amp") {
        Object.assign(defaultEquipment, { ampType: "" });
      } else if (type === "pedal") {
        Object.assign(defaultEquipment, { effectType: "" });
      }

      // Set both the hook's equipment state and mark as initialized
      setCurrentEquipment(defaultEquipment);
      setInitialized(true);
    }
  }, [mode, initialized, user, type, navigate, setCurrentEquipment]);

  // Ensure type-specific fields exist for editing mode
  useEffect(() => {
    if (currentEquipment) {
      let needsUpdate = false;
      let updatedEquipment = { ...currentEquipment };
      
      const currentType = type || currentEquipment.type;
      
      if (currentEquipment.type !== currentType) {
        updatedEquipment.type = currentType;
        needsUpdate = true;
      }

      if (currentType === "guitar" && !currentEquipment.hasOwnProperty('shape')) {
        updatedEquipment.shape = "";
        needsUpdate = true;
      } else if (currentType === "amp" && !currentEquipment.hasOwnProperty('ampType')) {
        updatedEquipment.ampType = "";
        needsUpdate = true;
      } else if (currentType === "pedal" && !currentEquipment.hasOwnProperty('effectType')) {
        updatedEquipment.effectType = "";
        needsUpdate = true;
      }

      if (needsUpdate) {
        setCurrentEquipment(updatedEquipment);
      }
    }
  }, [mode, currentEquipment?.type, type, currentEquipment, setCurrentEquipment]);

  async function saveEquipment(e) {
    e.preventDefault();
    if (isUploading) {
      return;
    }

    setIsUploading(true);
    setShowSavingModal(true);
    setUploadProgress(null);
    try {
      let updatedEquipment = { ...currentEquipment };
      
      // For guests, remove images from the equipment data
      if (isGuest) {
        updatedEquipment = {
          ...updatedEquipment,
          images: []
        };
      } else if (filesToUpload && filesToUpload.length > 0) {
        const uploadedUrls = [];
        
        for (let i = 0; i < filesToUpload.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${filesToUpload.length}...`);
          const result = await cloudinaryUpload(filesToUpload[i], updatedEquipment);
          console.log("uploaded", result);
          uploadedUrls.push(result);
        }
        
        // Replace the blob URLs with the uploaded URLs
        // Keep existing Cloudinary URLs and replace blob URLs with new ones
        const updatedImages = (updatedEquipment.images || []).map(image => {
          // If it's a blob URL, find the corresponding uploaded URL
          if (typeof image === "string" && image.startsWith('blob:')) {
            const fileIndex = filesToUpload.findIndex(file => file.url === image);
            return fileIndex !== -1 ? uploadedUrls[fileIndex] : image;
          }
          // If it's already a Cloudinary URL, keep it
          return image;
        });
        
        updatedEquipment = {
          ...updatedEquipment,
          images: updatedImages
        };
      }
      
      setUploadProgress("Saving equipment data...");

      if (!updatedEquipment.user?._id && user?._id) {
        updatedEquipment = {
          ...updatedEquipment,
          userId: user._id
        };
      }
      
      if (!updatedEquipment._id) {
        // Pass the updated equipment data to addEquipment
        const result = await addEquipment(type, updatedEquipment);
        setSaved(true);
        setShowSavingModal(false);
        // navigate(`/edit/${result._id}`);
        navigate("/gallery");
        return;
      } else {
        await updateEquipment(updatedEquipment);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 10000);
    } catch (error) {
      console.error("Error saving equipment:", error);
    } finally {
      setIsUploading(false);
      setShowSavingModal(false);
      setUploadProgress(null);
    }
  }

  const handleDelete = async () => {
    setShowModal(false);
    await deleteEquipment();
    navigate("/gallery");
  };



  const breadcrumbItems = [
    {
      label: currentEquipment?.type ? "View " + currentEquipment?.type.charAt(0).toUpperCase() + currentEquipment?.type.slice(1) : "Equipment",
      url: "/view/" + currentEquipment?._id
    },
    {
      label: currentEquipment?.type ? "Editing " + currentEquipment?.type.charAt(0).toUpperCase() + currentEquipment?.type.slice(1) : "Equipment",
      url: "/"
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-[var(--color-main-bg)]">
      <h1 className="sr-only">{mode === "edit" ? "Edit Equipment" : "Add Equipment"}</h1>
      <div className="p-6">
        {saved && <SuccessMessage />}

        { mode === "edit" && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}

        {showModal && (
          <Modal
            title="Delete Confirmation"
            message="Are you sure you want to delete this equipment?"
            onConfirm={handleDelete}
            onCancel={() => setShowModal(false)}
          />
        )}

        {showSavingModal && (
          <Modal
            title="Saving Equipment"
            message={
              <div className="text-center">
                <div className="mb-4">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
                <p className="text-gray-300">
                  {uploadProgress || "Preparing to save..."}
                </p>
              </div>
            }
            showCancel={false}
            showConfirm={false}
          />
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <EditImages 
              disabled={isUploading}
              currentEquipment={currentEquipment}
              setCurrentEquipment={setCurrentEquipment}
              setFilesToUpload={setFilesToUpload}
              deleteImage={deleteImage}
            />
          </div>

          <div className="md:col-span-3">
            <EquipmentForm 
              type={currentEquipment?.type || type}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              mode={mode}
              saveEquipment={saveEquipment}
              setShowModal={setShowModal}
              currentEquipment={currentEquipment}
              setCurrentEquipment={setCurrentEquipment}
              generateDescription={generateDescription}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGuitar;
