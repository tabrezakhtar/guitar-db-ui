import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GuitarsGrid() {
  const [guitars, setGuitars] = useState([]);

  useEffect(() => {
    const fetchGuitars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/guitars`);
        const data = await response.json();
        setGuitars(data.guitars);
      } catch (error) {
        console.error("Error fetching guitars:", error);
      }
    };

    fetchGuitars();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {guitars.map(({_id, brand, name, description}) => (
        <div
          key={_id}
          className="border rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
        >
          <img
            src={"/guitar.jpg"}
            alt={`Thumbnail: ${brand} ${name}`}
            className="w-full object-cover"
          />
          <div className="p-3 bg-gray-200 h-full">
            <h2 className="text-lg font-semibold">{brand} {name}</h2>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GuitarsGrid;