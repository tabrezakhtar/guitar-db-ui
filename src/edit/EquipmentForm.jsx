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

        <div className="mb-4">
          <label className="block text-[var(--color-text-header)] mb-2">Visibility:</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-[var(--color-text-muted)] cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value={0}
                checked={(currentEquipment?.visibility ?? 0) === 0}
                onChange={() => setCurrentEquipment({ ...currentEquipment, visibility: 0 })}
                disabled={isUploading}
                className="accent-blue-500"
              />
              Public
            </label>
            <label className="flex items-center gap-2 text-[var(--color-text-muted)] cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value={1}
                checked={(currentEquipment?.visibility ?? 0) === 1}
                onChange={() => setCurrentEquipment({ ...currentEquipment, visibility: 1 })}
                disabled={isUploading}
                className="accent-blue-500"
              />
              Private
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-[var(--color-text-header)]">Brand:</label>
          <input
            type="text"
            name="brand"
            placeholder="Brand (e.g. Fender, Gibson)"
            value={currentEquipment?.brand || ""}
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, brand: e.target.value })
            }
            disabled={isUploading}
            className="border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)] placeholder-gray-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[var(--color-text-header)]">Name: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            placeholder="Model or nickname"
            value={currentEquipment?.name || ""}
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, name: e.target.value })
            }
            disabled={isUploading}
            className="border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)] placeholder-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-[var(--color-text-header)]">Description: <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            placeholder="What is it? Condition, any mods or the story behind it"
            value={currentEquipment?.description || ""}
            rows="15"
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, description: e.target.value })
            }
            disabled={isUploading}
            className="border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)] placeholder-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-[var(--color-text-header)]">YouTube URL:</label>
          <input
            type="url"
            name="url"
            placeholder="Paste a YouTube link (optional)"
            value={currentEquipment?.url || ""}
            onChange={handleYoutubeUrlChange}
            disabled={isUploading}
            className={`border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)] placeholder-gray-400 ${!validateYoutubeUrl(currentEquipment?.url) ? "border-red-500" : ""}`}
          />
          {!validateYoutubeUrl(currentEquipment?.url) && (
            <p className="text-red-400 text-sm mt-1">Please enter a valid YouTube URL</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-[var(--color-text-header)]">Tags:</label>
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
          <label className="block text-[var(--color-text-header)]">Why:</label>
          <textarea
            name="why"
            placeholder="What makes this special and how does it make you feel? (optional)"
            value={currentEquipment?.why || ""}
            rows="4"
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, why: e.target.value })
            }
            className="border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)] placeholder-gray-400"
          />
        </div> */}

        <div className="mb-4">
          <label className="block text-[var(--color-text-header)]">Year:</label>
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
            className="border border-gray-600 p-2 rounded w-full bg-[var(--color-panel-bg)] text-[var(--color-text-header)] placeholder-gray-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[var(--color-text-header)]">Rating:</label>
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
              className="bg-red-600 hover:bg-red-500 text-[var(--color-text)] px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="bg-gray-600 hover:bg-gray-500 text-[var(--color-text)] px-4 py-2 rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading || !validateYoutubeUrl(currentEquipment?.url)}
              className="bg-blue-600 hover:bg-blue-500 text-[var(--color-text)] px-4 py-2 rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
