import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useGuitarContext } from "./context/GuitarContext";
import EditImages from "./EditImages";
import Alert from "./Alert";

function EditGuitar({ mode = "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentGuitar,
    settings,
    loading,
    fetchGuitar,
    updateGuitar,
    addGuitar,
    deleteGuitar,
    setCurrentGuitar,
    cloudinaryUpload,
    filesToUpload,
    clearCurrentGuitar,
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
  }, [settings, fetchSettings]);

  useEffect(() => {
    if (mode === "edit") {
      if (!currentGuitar || currentGuitar._id !== id) {
        fetchGuitar(id);
      }
    } else if (mode === "add" && !initialized) {
      setCurrentGuitar({
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
  }, [id, mode, initialized, fetchGuitar, setCurrentGuitar]);

  const createOptions = (items) =>
    items?.map((item) => ({ value: item, label: item })) || [];

  async function saveGuitar(e) {
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

      if (!currentGuitar._id) {
        const result = await addGuitar();
        setSaved(true);
        navigate(`/edit/${result._id}`);
      } else {
        await updateGuitar();
      }

      setSaved(true);
    } finally {
      setIsUploading(false);
    }
  }

  async function removeGuitar() {
    setIsUploading(true);
    try {
      await deleteGuitar();
      navigate("/");
    } finally {
      setIsUploading(false);
    }
  }

  const handleDelete = () => {
    setShowAlert(false);
    removeGuitar();
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
        {mode === "edit" && (
          <button
            onClick={() => {
              clearCurrentGuitar();
              navigate(`/view/${currentGuitar._id}`);
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
                      currentGuitar?.brand
                        ? { value: currentGuitar.brand, label: currentGuitar.brand }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                    value={currentGuitar?.shape || ""}
                    onChange={(e) =>
                      setCurrentGuitar({ ...currentGuitar, shape: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={currentGuitar?.name || ""}
                    onChange={(e) =>
                      setCurrentGuitar({ ...currentGuitar, name: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Series:</label>
                  <input
                    type="text"
                    name="series"
                    value={currentGuitar?.series || ""}
                    onChange={(e) =>
                      setCurrentGuitar({ ...currentGuitar, series: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Pickups:</label>
                  <Select
                    options={createOptions(settings.pickups)}
                    value={
                      currentGuitar?.pickups
                        ? { value: currentGuitar.pickups, label: currentGuitar.pickups }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                      currentGuitar?.trem
                        ? { value: currentGuitar.trem, label: currentGuitar.trem }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                    value={currentGuitar?.frets || 22}
                    onChange={(e) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                    value={currentGuitar?.tuners || ""}
                    onChange={(e) =>
                      setCurrentGuitar({ ...currentGuitar, tuners: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Colour:</label>
                  <Select
                    options={createOptions(settings.colours)}
                    value={
                      currentGuitar?.colour
                        ? { value: currentGuitar.colour, label: currentGuitar.colour }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                      currentGuitar?.fretboard
                        ? { value: currentGuitar.fretboard, label: currentGuitar.fretboard }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                    value={currentGuitar?.description || ""}
                    onChange={(e) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                    value={currentGuitar?.detailedDescription || ""}
                    onChange={(e) =>
                      setCurrentGuitar({
                        ...currentGuitar,
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
                      onClick={saveGuitar}
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
                        mode === "edit" ? "Save Changes" : "Add Guitar"
                      )}
                    </button>
                    {saved ? (
                      <span className="text-green-500 p-2">Saved✓</span>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <Alert
          message="Are you sure you want to delete this guitar?"
          onConfirm={handleDelete}
          onCancel={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default EditGuitar;