import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Guitar {
  id: string;
  brand: string;
  name: string;
  description: string;
  imageUrl: string;
}

function ViewGuitar() {
  const { id } = useParams();
  const [guitar, setGuitar] = useState({} as Guitar);

  useEffect(() => {
    const fetchGuitars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/guitar?id=${id}`);
        const result: Guitar = await response.json();
        setGuitar(result);
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4">
            <img
              src={"/guitar.jpg"}
              alt={`Thumbnail: ${guitar.brand} ${guitar.name}`}
              className="w-full object-cover"
            />
          </div>
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">{guitar.description}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewGuitar;