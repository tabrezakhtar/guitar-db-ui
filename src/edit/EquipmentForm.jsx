import { useEffect, useContext } from "react";
import { GuitarContext } from "../context/GuitarContext";
import FormFields from "./FormFields";
import StarRating from "../components/StarRating";
import Tag from "../tags/Tag";
import Select from "react-select";

function EquipmentForm({ type, isUploading, uploadProgress, mode, saveEquipment, setShowModal }) {
  const { 
    currentEquipment, 
    setCurrentEquipment, 
    tags, 
    fetchTags 
  } = useContext(GuitarContext);

  useEffect(() => {
    if (tags.length === 0) {
      fetchTags();
    }
  }, []);

  const formatOptionLabel = ({ value, label, colour, icon }) => (
    <div className="flex items-center">
      <Tag tag={{ name: label, colour, icon }} />
    </div>
  );

  const handleTagChange = (selectedOptions) => {
    const selectedTags = selectedOptions ? selectedOptions.map(option => ({
      _id: option.value,
      name: option.label,
      colour: option.colour,
      icon: option.icon
    })) : [];
    
    setCurrentEquipment({ ...currentEquipment, tags: selectedTags });
  };

  const validateYoutubeUrl = (url) => {
    if (!url) return true;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setCurrentEquipment({ ...currentEquipment, url });
  };

  const tagOptions = tags.map(tag => ({
    value: tag._id,
    label: tag.name,
    colour: tag.colour,
    icon: tag.icon
  }));

  const selectedTags = currentEquipment?.tags ? 
    currentEquipment.tags.map(tag => ({
      value: tag._id,
      label: tag.name,
      colour: tag.colour,
      icon: tag.icon
    })) : [];

  return (
    <form className={`space-y-4 ${isUploading ? "opacity-50" : ""}`} onSubmit={saveEquipment}>
      <fieldset disabled={isUploading}>
        <FormFields type={type} isUploading={isUploading} />

        <div>
          <label className="block">Brand: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="brand"
            placeholder="Enter the brand name"
            value={currentEquipment?.brand || ""}
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, brand: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block">Name: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            placeholder="Enter the name of the equipment"
            value={currentEquipment?.name || ""}
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, name: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block">Description: <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            placeholder="Enter a detailed description of the equipment"
            value={currentEquipment?.description || ""}
            rows="4"
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, description: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block">YouTube URL:</label>
          <input
            type="url"
            name="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={currentEquipment?.url || ""}
            onChange={handleYoutubeUrlChange}
            className={`border p-2 rounded w-full ${!validateYoutubeUrl(currentEquipment?.url) ? "border-red-500" : ""}`}
          />
          {!validateYoutubeUrl(currentEquipment?.url) && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid YouTube URL</p>
          )}
        </div>

        <div>
          <label className="block">Tags:</label>
          <Select
            isMulti
            name="tags"
            options={tagOptions}
            value={selectedTags}
            onChange={handleTagChange}
            formatOptionLabel={formatOptionLabel}
            placeholder="Select tags"
            className="react-select-container"
            classNamePrefix="react-select"
            isDisabled={isUploading}
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
          <StarRating 
            rating={currentEquipment?.rating || 0} 
            onChange={(newRating) => 
              setCurrentEquipment({
                ...currentEquipment,
                rating: newRating
              })
            }
            disabled={isUploading}
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
  );
}

export default EquipmentForm;