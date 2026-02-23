import DragSortable from "../components/DragSortable";
import Thumbnail from "../components/Thumbnail";
import FileDropZone from "../components/FileDropZone";

export default function EditImages({ disabled, currentEquipment, setCurrentEquipment, setFilesToUpload, deleteImage }) {

  const handleSort = (newList) => {
    if (disabled) return;
    
    setCurrentEquipment({
      ...currentEquipment,
      images: newList
    });
  };

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <FileDropZone 
        disabled={disabled} 
        currentEquipment={currentEquipment}
        setCurrentEquipment={setCurrentEquipment}
        setFilesToUpload={setFilesToUpload}
      />
      {currentEquipment?.images && currentEquipment.images.length > 1 && (
        <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm text-blue-200 rounded-lg bg-blue-900/30 font-medium w-full">
          ℹ️ Drag the images to reorder
        </span>
      )}
      {currentEquipment?.images ? (
        <DragSortable 
          list={currentEquipment.images} 
          setList={handleSort}
          className="grid grid-cols-2 gap-2"
          dragClass="opacity-50"
          ghostClass="bg-blue-600"
          disabled={disabled}
        >
          {currentEquipment.images.map((image, index) => (
            <div key={index} className={`border border-gray-600 rounded-lg p-2 ${!disabled ? "cursor-move" : ""}`}>
              <Thumbnail
                index={index}
                url={image}
                alt={`Thumbnail ${index + 1}: ${currentEquipment.brand} ${currentEquipment.name}`}
                showDelete={!disabled}
                disabled={disabled}
                deleteImage={deleteImage}
              />
            </div>
          ))}
        </DragSortable>
      ) : null}
    </div>
  );
}