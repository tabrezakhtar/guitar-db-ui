import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Guitar } from "./types/guitar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ViewGuitar() {
  const { id } = useParams();
  const [guitar, setGuitar] = useState({} as Guitar);

  useEffect(() => {
    const fetchGuitars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/guitar?id=${id}`);
        const { guitar } = await response.json();
        setGuitar(guitar);
      } catch (error) {
        console.error("Error fetching guitar:", error);
      }
    };

    fetchGuitars();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        <h1>View</h1>
        <Link to={`/edit/${guitar._id}`} className="hover:underline">Edit</Link>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4">
            {guitar.images ? (
              <img
                src={guitar.images[0]}
                alt={`Thumbnail: ${guitar.brand} ${guitar.name}`}
                className="w-full object-cover"
              />
            ): null}
          </div>
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">{guitar.description}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewGuitar;