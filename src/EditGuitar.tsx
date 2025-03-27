import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Guitar } from "./types/guitar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// import React, { useState } from "react";

// function App() {
//     const [file, setFile] = useState();
//     function handleChange(e) {
//         console.log(e.target.files);
//         setFile(URL.createObjectURL(e.target.files[0]));
//     }

//     return (
//         <div className="App">
//             <h2>Add Image:</h2>
//             <input type="file" onChange={handleChange} />
//             <img src={file} />
//         </div>
//     );
// }

// export default App;

function EditGuitar() {
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
        <h1>Edit</h1>
        <p>
          Edit guitar

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
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">
              <form className="space-y-4">
                <div>
                  <label className="block">Brand:</label>
                  <input type="text" value={guitar.brand} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Shape:</label>
                  <input type="text" value={guitar.shape} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Name:</label>
                  <input type="text" value={guitar.name} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Series:</label>
                  <input type="text" value={guitar.series} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Pickups:</label>
                  <input type="text" value={guitar.pickups} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Tremolo:</label>
                  <input type="text" value={guitar.trem} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Frets:</label>
                  <input type="number" value={guitar.frets} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Tuners:</label>
                  <input type="text" value={guitar.tuners} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Colour:</label>
                  <input type="text" value={guitar.colour} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Fretboard:</label>
                  <input type="text" value={guitar.fretboard} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Description:</label>
                  <textarea value={guitar.description} className="border p-2 rounded w-full h-24"></textarea>
                </div>
                <div>
                  <label className="block">Thumbnail URL:</label>
                  <input type="text" value={guitar.thumbnail} className="border p-2 rounded w-full" />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </p>
      </div>
    </div>
  );
};

export default EditGuitar;