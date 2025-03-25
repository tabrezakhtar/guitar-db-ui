import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GuitarsGrid() {
  useEffect(() => {
    const fetchGuitars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/guitars`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching guitars:", error);
      }
    };

    fetchGuitars();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 16 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <img
            src={"/guitar.jpg"}
            alt={`Thumbnail ${index + 1}`}
            className="w-full object-cover"
          />
          <div className="p-3 bg-gray-200">
            <h2 className="text-lg font-semibold">Thumbnail {index + 1}</h2>
            <p className="text-sm text-gray-600">Description for thumbnail {index + 1}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GuitarsGrid;