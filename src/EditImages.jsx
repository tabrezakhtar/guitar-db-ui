import { ReactSortable } from "react-sortablejs";
import Thumbnail from "./Thumbnail";
import { useGuitarContext } from "./context/GuitarContext";
import FileDropZone from "./FileDropZone";

export default function EditImages({ disabled }) {
  const { currentEquipment, setCurrentEquipment } = useGuitarContext();

  const handleSort = (newList) => {
    if (disabled) return;
    
    setCurrentEquipment({
      ...currentEquipment,
      images: newList
    });
  };

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <FileDropZone disabled={disabled} />
      <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 font-medium w-full">
        ℹ️ Drag the images to reorder
      </span>
      {currentEquipment?.images ? (
        <ReactSortable 
          list={currentEquipment.images} 
          setList={handleSort}
          className="grid grid-cols-2 gap-2"
          dragClass="opacity-50"
          ghostClass="bg-blue-300"
          disabled={disabled}
        >
          {currentEquipment.images.map((image, index) => (
            <div key={index} className={`border rounded-lg p-2 ${!disabled ? "cursor-move" : ""}`}>
              <Thumbnail
                index={index}
                url={image}
                alt={`Thumbnail ${index + 1}: ${currentEquipment.brand} ${currentEquipment.name}`}
                showDelete={!disabled}
                disabled={disabled}
              />
            </div>
          ))}
        </ReactSortable>
      ) : null}
    </div>
  );
}