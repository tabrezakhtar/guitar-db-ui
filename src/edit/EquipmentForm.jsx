import { useGuitarContext } from "../context/GuitarContext";
import FormFields from "./FormFields";
import StarRating from "../components/StarRating";

function EquipmentForm({ type, isUploading, uploadProgress, mode, saveEquipment, setShowModal }) {
  const { currentEquipment, setCurrentEquipment } = useGuitarContext();

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
          <input
            type="text"
            name="description"
            placeholder="Enter a brief description of the equipment"
            value={currentEquipment?.description || ""}
            onChange={(e) =>
              setCurrentEquipment({ ...currentEquipment, description: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block">Tags: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="tags"
            placeholder="Add some tags"
            // value={currentEquipment?.tags || ""}
            // onChange={(e) =>
            //   setCurrentEquipment({ ...currentEquipment, description: e.target.value })
            // }
            className="border p-2 rounded w-full"
            required
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