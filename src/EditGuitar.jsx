import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useGuitarContext } from "./context/GuitarContext";
import EditImages from "./EditImages";
import Modal from "./Modal";

function EditGuitar({ mode = "edit", type = "guitar" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentEquipment,
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
  const [showModal, setShowModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fieldMapping = {
    guitar: [
      {
        label: "Shape",
        key: "shape",
        type: "select",
        options: [
          { value: "S Style", label: "S Style" },
          { value: "Double Cut", label: "Double Cut" },
          { value: "Single Cut", label: "Single Cut" },
          { value: "T Style", label: "T Style" },
          { value: "Semi-Acoustic", label: "Semi-Acoustic" },
          { value: "Modern", label: "Modern" },
          { value: "Headless", label: "Headless" },
          { value: "V Style", label: "V Style" },
        ],
      },
    ],
    amp: [
      {
        label: "Amp Type",
        key: "ampType",
        type: "radio",
        options: [
          { value: "Digital", label: "Digital" },
          { value: "Tube", label: "Tube" },
        ],
      },
    ],
    pedal: [
      { label: "Effect Type", key: "effectType", type: "text", placeholder: "Enter the effect type of the pedal" },
    ],
  };

  useEffect(() => {
    if (mode === "edit") {
      if (!currentEquipment || currentEquipment._id !== id) {
        fetchEquipment(id, type);
      }
    } else if (mode === "add" && !initialized) {
      const defaultEquipment = {
        brand: "",
        description: "",
        name: "",
        recommendation: "",
        type: type.charAt(0).toUpperCase() + type.slice(1),
        why: "",
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
      // setTimeout(() => setSaved(false), 10000);
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
            disabled={isUploading}
          >
            View
          </button>
        )}

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
            <form className={`space-y-4 ${isUploading ? "opacity-50" : ""}`} onSubmit={saveEquipment}>
              <fieldset disabled={isUploading}>

                {/* dynamic fields */}
                {fieldMapping[type]?.map((field) => (
                  <div key={field.key}>
                    <label className="block">{field.label}:</label>
                    {field.type === "text" || field.type === "number" ? (
                      <input
                        type={field.type}
                        name={field.key}
                        placeholder={field.placeholder}
                        value={currentEquipment?.[field.key] || ""}
                        onChange={(e) =>
                          setCurrentEquipment({
                            ...currentEquipment,
                            [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    ) : field.type === "radio" ? (
                      <div className="flex gap-4">
                        {field.options.map((option) => (
                          <label key={option.value} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={field.key}
                              value={option.value}
                              checked={currentEquipment?.[field.key] === option.value}
                              onChange={(e) =>
                                setCurrentEquipment({
                                  ...currentEquipment,
                                  [field.key]: e.target.value,
                                })
                              }
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    ) : field.type === "select" ? (
                      <Select
                        options={field.options}
                        value={
                          currentEquipment?.[field.key]
                            ? field.options.find((option) => option.value === currentEquipment[field.key])
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
                        isDisabled={isUploading}
                      />
                    ) : null}
                  </div>
                ))}
                <div>
                  <label className="block">Name:</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter the name of the equipment"
                    value={currentEquipment?.name || ""}
                    onChange={(e) =>
                      setCurrentEquipment({ ...currentEquipment, name: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Description:</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter a brief description of the equipment"
                    value={currentEquipment?.description || ""}
                    onChange={(e) =>
                      setCurrentEquipment({ ...currentEquipment, description: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Why:</label>
                  <textarea
                    name="why"
                    placeholder="Explain why this equipment is important"
                    value={currentEquipment?.why || ""}
                    rows="4"
                    onChange={(e) =>
                      setCurrentEquipment({ ...currentEquipment, why: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Year:</label>
                  <input
                    type="number"
                    name="year"
                    placeholder="Enter the year of manufacture"
                    value={currentEquipment?.year || ""}
                    onChange={(e) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        year: Number(e.target.value),
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block">Rating:</label>
                  <input
                    type="number"
                    name="rating"
                    placeholder="Enter a rating from 0 to 5"
                    value={currentEquipment?.rating || ""}
                    onChange={(e) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        rating: Math.min(5, Math.max(0, Number(e.target.value))),
                      })
                    }
                    className="border p-2 rounded w-full"
                    min="0"
                    max="5"
                  />
                </div>

                <div className="flex justify-between mt-4">
                  {mode === "edit" && (
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    {isUploading ? (uploadProgress || "Saving...") : mode === "edit" ? "Save Changes" : `Add ${type}`}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGuitar;
