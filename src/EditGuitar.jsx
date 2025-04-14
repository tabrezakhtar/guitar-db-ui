import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useGuitarStore } from "./store/useGuitarStore";
import EditImages from "./EditImages";
import Alert from "./Alert";

function EditGuitar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentGuitar: guitar = {}, // Provide a default empty object to avoid destructuring errors
    settings,
    loading,
    fetchGuitar,
    updateGuitar,
    deleteGuitar,
    setCurrentGuitar,
    cloudinaryUpload,
    filesToUpload,
    clearCurrentGuitar,
  } = useGuitarStore() || {}; // Add fallback to ensure useGuitarStore() is not undefined

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // Track upload progress
  const [saved, setSaved] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!guitar || guitar._id !== id) {
      fetchGuitar(id);
    }
  }, [id, guitar]);

  const createOptions = (items) =>
    items?.map((item) => ({ value: item, label: item })) || [];

  async function update(e) {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(null);
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        setUploadProgress(`Saving Image (${i + 1} of ${filesToUpload.length})`);
        const result = await cloudinaryUpload(filesToUpload[i]);
        console.log("uploaded", result);
      }
      setUploadProgress(null);
      await updateGuitar();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        <button
          onClick={() => {
            clearCurrentGuitar();
            navigate(`/view/${guitar._id}`);
          }}
          className="hover:underline text-blue-500"
        >
          View
        </button>

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
                      guitar?.brand
                        ? { value: guitar.brand, label: guitar.brand }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...guitar,
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
                    value={guitar?.shape}
                    onChange={(e) =>
                      setCurrentGuitar({ ...guitar, shape: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={guitar?.name}
                    onChange={(e) =>
                      setCurrentGuitar({ ...guitar, name: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Series:</label>
                  <input
                    type="text"
                    name="series"
                    value={guitar?.series}
                    onChange={(e) =>
                      setCurrentGuitar({ ...guitar, series: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Pickups:</label>
                  <Select
                    options={createOptions(settings.pickups)}
                    value={
                      guitar?.pickups
                        ? { value: guitar.pickups, label: guitar.pickups }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...guitar,
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
                      guitar?.trem
                        ? { value: guitar.trem, label: guitar.trem }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...guitar,
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
                    value={guitar?.frets}
                    onChange={(e) =>
                      setCurrentGuitar({
                        ...guitar,
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
                    value={guitar?.tuners}
                    onChange={(e) =>
                      setCurrentGuitar({ ...guitar, tuners: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block">Colour:</label>
                  <Select
                    options={createOptions(settings.colours)}
                    value={
                      guitar?.colour
                        ? { value: guitar.colour, label: guitar.colour }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...guitar,
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
                      guitar?.fretboard
                        ? { value: guitar.fretboard, label: guitar.fretboard }
                        : null
                    }
                    onChange={(selected) =>
                      setCurrentGuitar({
                        ...guitar,
                        fretboard: selected?.value || "",
                      })
                    }
                    isClearable
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <label className="block">Description:</label>
                  <textarea
                    name="description"
                    value={guitar?.description}
                    onChange={(e) =>
                      setCurrentGuitar({
                        ...guitar,
                        description: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full h-24"
                  ></textarea>
                </div>

                <div>
                  <label className="block">Thumbnail URL:</label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={guitar?.thumbnail}
                    onChange={(e) =>
                      setCurrentGuitar({ ...guitar, thumbnail: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    onClick={update}
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
                      "Save Changes"
                    )}
                  </button>
                  {saved ? (
                    <span className="text-green-500 p-2">Saved✓</span>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setShowAlert(true)}
                    disabled={isUploading}
                    className={`bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded cursor-pointer float-right ${
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