import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import { useGuitarStore } from "./store/useGuitarStore";

export default function EditImages() {
  const { id } = useParams();
  const { currentGuitar, setCurrentGuitar } = useGuitarStore();

  return (
    <div>
      {currentGuitar.images ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentGuitar.images.map((image, index) => (
            <div key={index} className="border rounded-lg p-2">
              <Thumbnail
                index={index}
                url={image}
                alt={`Thumbnail ${index + 1}: ${currentGuitar.brand} ${currentGuitar.name}`}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}