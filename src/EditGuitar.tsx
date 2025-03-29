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
        const { guitar } = await response.json();
        setGuitar(guitar);
      } catch (error) {
        console.error("Error fetching guitar:", error);
      }
    };

    fetchGuitars();
  }, []);

  async function update(e){
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/api/guitars/update/${guitar._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guitar)
    });
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        <h1>Edit</h1>
        <div>
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
                  <input type="text" name="brand" value={guitar.brand} onChange={e => setGuitar({...guitar, brand: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Shape:</label>
                  <input type="text" name="shape" value={guitar.shape} onChange={e => setGuitar({...guitar, shape: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Name:</label>
                  <input type="text" name="name" value={guitar.name} onChange={e => setGuitar({...guitar, name: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Series:</label>
                  <input type="text" name="series" value={guitar.series} onChange={e => setGuitar({...guitar, series: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Pickups:</label>
                  <input type="text" name="pickups" value={guitar.pickups} onChange={e => setGuitar({...guitar, pickups: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Tremolo:</label>
                  <input type="text" name="trem" value={guitar.trem} onChange={e => setGuitar({...guitar, trem: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Frets:</label>
                  <input type="number" name="frets" value={guitar.frets} onChange={e => setGuitar({...guitar, frets: Number(e.target.value)})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Tuners:</label>
                  <input type="text" name="tuners" value={guitar.tuners} onChange={e => setGuitar({...guitar, tuners: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Colour:</label>
                  <input type="text" name="colour" value={guitar.colour} onChange={e => setGuitar({...guitar, colour: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Fretboard:</label>
                  <input type="text" name="fretboard" value={guitar.fretboard} onChange={e => setGuitar({...guitar, fretboard: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <div>
                  <label className="block">Description:</label>
                  <textarea name="description" value={guitar.description} onChange={e => setGuitar({...guitar, description: e.target.value})} className="border p-2 rounded w-full h-24"></textarea>
                </div>
                <div>
                  <label className="block">Thumbnail URL:</label>
                  <input type="text" name="thumbnail" value={guitar.thumbnail} onChange={e => setGuitar({...guitar, thumbnail: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                <button type="submit" onClick={update} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded cursor-pointer">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGuitar;