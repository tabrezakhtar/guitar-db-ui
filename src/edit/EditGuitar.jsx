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
  const { user } = useContext(UserContext);
  
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
    clearFilesToUpload,
    clearCurrentEquipment,
    deleteImage
  } = useEditEquipmentData(id, mode);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!loading && currentEquipment) {
      if (!currentEquipment.user?._id && user?._id) {
        setCurrentEquipment({
          ...currentEquipment,
          userId: user._id
        });
      }
    } else if (mode === "add" && !initialized) {
      if (!user) {
        navigate("/");
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
      };

      if (type === "guitar") {
        Object.assign(defaultEquipment, { shape: "" });
      } else if (type === "amp") {
        Object.assign(defaultEquipment, { ampType: "" });
      } else if (type === "pedal") {
        Object.assign(defaultEquipment, { effectType: "" });
      }

      setCurrentEquipment(defaultEquipment);
      setInitialized(true);
    }
  }, [loading, currentEquipment, user, mode, initialized, type, navigate, setCurrentEquipment]);

  async function saveEquipment(e) {
    e.preventDefault();
    if (isUploading) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(null);
    try {
      if (filesToUpload && filesToUpload.length > 0) {
        for (let i = 0; i < filesToUpload.length; i++) {
          setUploadProgress(`Saving Image (${i + 1} of ${filesToUpload.length})`);
          const result = await cloudinaryUpload(filesToUpload[i]);
          console.log("uploaded", result);
        }
      }
      setUploadProgress(null);

      if (!currentEquipment.user?._id && user?._id) {
        setCurrentEquipment({
          ...currentEquipment,
          userId: user._id
        });
      }
      
      if (!currentEquipment._id) {
        const result = await addEquipment(type);
        setSaved(true);
        navigate(`/edit/${result._id}`);
        return;
      } else {
        await updateEquipment();
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 10000);
    } finally {
      setIsUploading(false);
    }
  }

  const handleDelete = async () => {
    setShowModal(false);
    await deleteEquipment();
    navigate("/");
  };

  if (loading && mode === "edit") {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>  
    );
  }

  if (!authChecked) {
    <div className="flex justify-center items-center h-full">
      <Spinner />
    </div>  
  }

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
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        {saved && <SuccessMessage />}

        { mode === "edit" && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        )}

        {/* {mode === "edit" && (
          <button
            onClick={() => {
              clearCurrentEquipment();
              navigate(`/view/${currentEquipment._id}`);
            }}
            className="hover:underline text-blue-500"
            disabled={isUploading}
          >
            View
          </button>
        )} */}

        {showModal && (
          <Modal
            title="Delete Confirmation"
            message="Are you sure you want to delete this equipment?"
            onConfirm={handleDelete}
            onCancel={() => setShowModal(false)}
          />
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <EditImages disabled={isUploading} />
          </div>

          <div className="md:col-span-3">
            <EquipmentForm 
              type={type}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              mode={mode}
              saveEquipment={saveEquipment}
              setShowModal={setShowModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGuitar;
