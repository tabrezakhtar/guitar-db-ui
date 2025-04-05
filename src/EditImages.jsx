import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import Thumbnail from "./Thumbnail";
import { useGuitarStore } from "./store/useGuitarStore";

export default function EditImages() {
  const { id } = useParams();
  const { currentGuitar, setCurrentGuitar } = useGuitarStore();

  const handleSort = (newList) => {
    setCurrentGuitar({
      ...currentGuitar,
      images: newList
    });
  };

  return (
    <div>
      <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 font-medium w-full">
        ℹ️ Drag the images to reorder
      </span>
      {currentGuitar.images ? (
        <ReactSortable 
          list={currentGuitar.images} 
          setList={handleSort}
          className="grid grid-cols-2 gap-2"
          dragClass="opacity-50"
          ghostClass="bg-blue-300"
        >
          {currentGuitar.images.map((image, index) => (
            <div key={index} className="border rounded-lg p-2 cursor-move">
              <Thumbnail
                index={index}
                url={image}
                alt={`Thumbnail ${index + 1}: ${currentGuitar.brand} ${currentGuitar.name}`}
              />
            </div>
          ))}
        </ReactSortable>
      ) : null}
    </div>
  );
}