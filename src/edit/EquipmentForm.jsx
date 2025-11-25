import { useNavigate } from "react-router-dom";
import { useTagContext } from "../context/TagContext";
import FormFields from "./FormFields";
import StarRating from "../components/StarRating";
import Tag from "../tags/Tag";
import Select from "../components/Select";

function EquipmentForm({ type, isUploading, uploadProgress, mode, saveEquipment, setShowModal, currentEquipment, setCurrentEquipment }) {
  const navigate = useNavigate();
  const { tags } = useTagContext();

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
      <fieldset>
        <FormFields 
          type={type} 
          isUploading={isUploading} 
          currentEquipment={currentEquipment}
          setCurrentEquipment={setCurrentEquipment}
        />

        <div className="my-4">
          <label className="block text-black dark:text-white">Brand:</label>
          <input
            type="text"
            name="brand"
            placeholder="Brand (e.g. Fender, Gibson)"
            value={currentEquipment?.brand || ""}
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, brand: e.target.value })
            }
            disabled={isUploading}
            className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-black dark:text-white">Name: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            placeholder="Model or nickname"
            value={currentEquipment?.name || ""}
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, name: e.target.value })
            }
            disabled={isUploading}
            className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-black dark:text-white">Description: <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            placeholder="What is it? Condition, any mods or the story behind it"
            value={currentEquipment?.description || ""}
            rows="15"
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, description: e.target.value })
            }
            disabled={isUploading}
            className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-black dark:text-white">YouTube URL:</label>
          <input
            type="url"
            name="url"
            placeholder="Paste a YouTube link (optional)"
            value={currentEquipment?.url || ""}
            onChange={handleYoutubeUrlChange}
            disabled={isUploading}
            className={`border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${!validateYoutubeUrl(currentEquipment?.url) ? "border-red-500" : ""}`}
          />
          {!validateYoutubeUrl(currentEquipment?.url) && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">Please enter a valid YouTube URL</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-black dark:text-white">Tags:</label>
          <Select
            isMulti
            name="tags"
            options={tagOptions}
            value={selectedTags}
            onChange={handleTagChange}
            formatOptionLabel={formatOptionLabel}
            placeholder="Pick some tags that fit (optional)"
            isDisabled={isUploading}
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-black dark:text-white">Why:</label>
          <textarea
            name="why"
            placeholder="What makes this special and how does it make you feel? (optional)"
            value={currentEquipment?.why || ""}
            rows="4"
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, why: e.target.value })
            }
            className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div> */}

        <div className="mb-4">
          <label className="block text-black dark:text-white">Year:</label>
          <input
            type="number"
            name="year"
            placeholder="Year it was made (optional)"
            value={currentEquipment?.year || ""}
            onChange={(e) =>
              setCurrentEquipment({
                ...currentEquipment,
                year: Number(e.target.value),
              })
            }
            disabled={isUploading}
            className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-black dark:text-white">Rating:</label>
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

        <div className={`flex mt-4 ${mode === "edit" ? "justify-between" : "justify-end"}`}>
          {mode === "edit" && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              disabled={isUploading}
              className="bg-red-500 hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500 text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )}
          <div className="flex gap-2">
            {mode === "edit" && currentEquipment?._id && (
              <button
                type="button"
                onClick={() => navigate(`/view/${currentEquipment._id}`)}
                disabled={isUploading}
                className="bg-gray-500 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-4 py-2 rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading}
              className="bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (uploadProgress || "Saving...") : mode === "edit" ? "Save Changes" : `Add ${type}`}
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default EquipmentForm;
