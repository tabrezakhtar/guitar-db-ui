import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useGuitarContext } from "./context/GuitarContext";
import EditImages from "./EditImages";
import Alert from "./Alert";

function EditGuitar({ mode = "edit", type = "guitar" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentEquipment,
    settings,
    loading,
    fetchEquipment,
    updateEquipment,
    addEquipment,
    deleteEquipment,
    setCurrentEquipment,
    cloudinaryUpload,
    filesToUpload,
    clearCurrentEquipment,
    fetchSettings,
  } = useGuitarContext();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fieldMapping = {
    guitar: [
      { label: "Shape", key: "shape", type: "text" },
      { label: "Pickups", key: "pickups", type: "select", options: settings?.pickups },
      { label: "Strings", key: "strings", type: "number" },
    ],
    amp: [
      { label: "Power", key: "power", type: "number" },
      { label: "Tube Type", key: "tubeType", type: "text" },
    ],
    pedal: [
      { label: "Effect Type", key: "effectType", type: "text" },
    ],
  };

  useEffect(() => {
    if (!settings || Object.keys(settings).length === 0) {
      fetchSettings();
    }
  }, []);

  useEffect(() => {
    if (mode === "edit") {
      if (!currentEquipment || currentEquipment._id !== id) {
        fetchEquipment(id, type);
      }
    } else if (mode === "add" && !initialized) {
      const defaultEquipment = {
        userId: "",
        name: "",
        price: "",
        type: type.charAt(0).toUpperCase() + type.slice(1),
        description: "",
        why: "",
        recommendation: "",
        brand: "",
        likes: "",
        comments: [],
        images: [],
        year: null,
        date: null,
        colour: "",
        rating: null,
      };

      if (type === "guitar") {
        Object.assign(defaultEquipment, { shape: "", pickups: "", strings: null });
      } else if (type === "amp") {
        Object.assign(defaultEquipment, { power: null, tubeType: "" });
      } else if (type === "pedal") {
        Object.assign(defaultEquipment, { effectType: "" });
      }

      setCurrentEquipment(defaultEquipment);
      setInitialized(true);
    }
  }, []);

  const createOptions = (items) =>
    items?.map((item) => ({ value: item, label: item })) || [];

  async function saveEquipment(e) {
    e.preventDefault();
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

      if (!currentEquipment._id) {
        const result = await addEquipment(type);
        setSaved(true);
        navigate(`/edit/${result._id}`);
      } else {
        await updateEquipment(type);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 10000);
    } finally {
      setIsUploading(false);
    }
  }

  const handleDelete = () => {
    setShowAlert(false);
    deleteEquipment(id, type);
    navigate("/");
  };

  if (loading && mode === "edit") {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        {saved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your changes have been saved.</span>
          </div>
        )}

        {mode === "edit" && (
          <button
            onClick={() => {
              clearCurrentEquipment();
              navigate(`/view/${currentEquipment._id}`);
            }}
            className="hover:underline text-blue-500"
          >
            View
          </button>
        )}

        {showAlert && (
          <Alert
            title="Delete Confirmation"
            message="Are you sure you want to delete this equipment?"
            onConfirm={handleDelete}
            onCancel={() => setShowAlert(false)}
          />
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-4">
          {/* Left Column: EditImages */}
          <div className="md:col-span-2">
            <EditImages />
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-3">
            <form className="space-y-4" onSubmit={saveEquipment}>
              <div>
                <label className="block">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={currentEquipment?.name || ""}
                  onChange={(e) =>
                    setCurrentEquipment({ ...currentEquipment, name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block">Price:</label>
                <input
                  type="text"
                  name="price"
                  value={currentEquipment?.price || ""}
                  onChange={(e) =>
                    setCurrentEquipment({ ...currentEquipment, price: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {fieldMapping[type]?.map((field) => (
                <div key={field.key}>
                  <label className="block">{field.label}:</label>
                  {field.type === "text" || field.type === "number" ? (
                    <input
                      type={field.type}
                      name={field.key}
                      value={currentEquipment?.[field.key] || ""}
                      onChange={(e) =>
                        setCurrentEquipment({
                          ...currentEquipment,
                          [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  ) : field.type === "select" ? (
                    <Select
                      options={createOptions(field.options)}
                      value={
                        currentEquipment?.[field.key]
                          ? { value: currentEquipment[field.key], label: currentEquipment[field.key] }
                          : null
                      }
                      onChange={(selected) =>
                        setCurrentEquipment({
                          ...currentEquipment,
                          [field.key]: selected?.value || "",
                        })
                      }
                      isClearable
                      className="text-gray-800"
                    />
                  ) : null}
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded cursor-pointer ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? "Saving..." : mode === "edit" ? "Save Changes" : `Add ${type}`}
                </button>
                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={() => setShowAlert(true)}
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGuitar;