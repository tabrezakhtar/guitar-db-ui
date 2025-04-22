import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
      setCurrentEquipment({
        brand: "",
        shape: "",
        name: "",
        series: "",
        pickups: "",
        trem: "",
        frets: 22,
        tuners: "",
        colour: "",
        fretboard: "",
        description: "",
        detailedDescription: "",
        thumbnail: "",
        images: []
      });
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

  async function removeEquipment() {
    setIsUploading(true);
    try {
      await deleteEquipment(type);
      navigate("/");
    } finally {
      setIsUploading(false);
    }
  }

  const handleDelete = () => {
    setShowAlert(false);
    removeEquipment();
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

        <div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4">
              <EditImages />
            </div>
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">
              <form className="space-y-4">
                <div>
                  <label className="block">Brand:</label>
                  <Select
                    options={createOptions(settings?.brand)}
                    value={
                      currentEquipment?.brand
                        ? { value: currentEquipment.brand, label: currentEquipment.brand }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        brand: selected?.value || "",
                      })
                    }
                    isClearable
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <label className="block">Shape:</label>
                  <input
                    type="text"
                    name="shape"
                    value={currentEquipment?.shape || ""}
                    onChange={(e) =>
                      setCurrentEquipment({ ...currentEquipment, shape: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

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
                  <label className="block">Series:</label>
                  <input
                    type="text"
                    name="series"
                    value={currentEquipment?.series || ""}
                    onChange={(e) =>
                      setCurrentEquipment({ ...currentEquipment, series: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Pickups:</label>
                  <Select
                    options={createOptions(settings.pickups)}
                    value={
                      currentEquipment?.pickups
                        ? { value: currentEquipment.pickups, label: currentEquipment.pickups }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        pickups: selected?.value || "",
                      })
                    }
                    isClearable
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <label className="block">Tremolo:</label>
                  <Select
                    options={createOptions(settings.tremolo)}
                    value={
                      currentEquipment?.trem
                        ? { value: currentEquipment.trem, label: currentEquipment.trem }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        trem: selected?.value || "",
                      })
                    }
                    isClearable
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <label className="block">Frets:</label>
                  <input
                    type="number"
                    name="frets"
                    value={currentEquipment?.frets || 22}
                    onChange={(e) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        frets: Number(e.target.value),
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Tuners:</label>
                  <input
                    type="text"
                    name="tuners"
                    value={currentEquipment?.tuners || ""}
                    onChange={(e) =>
                      setCurrentEquipment({ ...currentEquipment, tuners: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Colour:</label>
                  <Select
                    options={createOptions(settings.colours)}
                    value={
                      currentEquipment?.colour
                        ? { value: currentEquipment.colour, label: currentEquipment.colour }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        colour: selected?.value || "",
                      })
                    }
                    isClearable
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <label className="block">Fretboard:</label>
                  <Select
                    options={createOptions(settings.fretboard)}
                    value={
                      currentEquipment?.fretboard
                        ? { value: currentEquipment.fretboard, label: currentEquipment.fretboard }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        fretboard: selected?.value || "",
                      })
                    }
                    isClearable
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <label className="block">Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={currentEquipment?.description || ""}
                    onChange={(e) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        description: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full"
                  ></input>
                </div>

                <div>
                  <label className="block">Detailed Description:</label>
                  <textarea
                    type="text"
                    name="detailedDescription"
                    value={currentEquipment?.detailedDescription || ""}
                    onChange={(e) =>
                      setCurrentEquipment({
                        ...currentEquipment,
                        detailedDescription: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full h-24"
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <div>
                    {mode === "edit" && (
                      <button
                        type="button"
                        onClick={() => setShowAlert(true)}
                        disabled={isUploading}
                        className={`bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded cursor-pointer ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Deleting...
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      type="submit"
                      onClick={saveEquipment}
                      disabled={isUploading}
                      className={`bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded cursor-pointer ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {uploadProgress || "Saving..."}
                        </div>
                      ) : (
                        mode === "edit" ? "Save Changes" : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <Alert
          message={`Are you sure you want to delete this ${type}?`}
          onConfirm={handleDelete}
          onCancel={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default EditGuitar;