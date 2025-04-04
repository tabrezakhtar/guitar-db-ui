import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Thumbnail from "./Thumbnail";
import { useGuitarStore } from "./store/useGuitarStore";
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
  const { 
    currentGuitar: guitar, 
    settings, 
    loading, 
    saved, 
    fetchGuitar, 
    updateGuitar,
    setCurrentGuitar 
  } = useGuitarStore();

  useEffect(() => {
    fetchGuitar(id);
  }, [id, fetchGuitar]);

  async function update(e) {
    e.preventDefault();
    await updateGuitar(guitar);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="p-6">
        <h1>Edit</h1>
        <div>
          Edit guitar
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border rounded-lg p-4">
              {guitar?.images ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {guitar.images.map((image, index) => (
                    <div key={index} className="border rounded-lg p-2">
                      <Thumbnail
                        url={image}
                        alt={`Thumbnail ${index + 1}: ${guitar.brand} ${guitar.name}`}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-3 border rounded-lg p-4">
               <form className="space-y-4">
                <div>
                  <label className="block">Brand:</label>
                  <select name="brand" value={guitar?.brand} onChange={e => setCurrentGuitar({...guitar, brand: e.target.value})} className="border p-2 rounded w-full">
                    <option value="">Select a brand</option>
                    {settings.brand?.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block">Shape:</label>
                  <input type="text" name="shape" value={guitar?.shape} onChange={e => setCurrentGuitar({...guitar, shape: e.target.value})} className="border p-2 rounded w-full" />
                </div>

                <div>
                  <label className="block">Name:</label>
                  <input type="text" name="name" value={guitar?.name} onChange={e => setCurrentGuitar({...guitar, name: e.target.value})} className="border p-2 rounded w-full" />
                </div>

                <div>
                  <label className="block">Series:</label>
                  <input type="text" name="series" value={guitar?.series} onChange={e => setCurrentGuitar({...guitar, series: e.target.value})} className="border p-2 rounded w-full" />
                </div>

                <div>
                  <label className="block">Pickups:</label>
                  <select name="pickups" value={guitar?.pickups} onChange={e => setCurrentGuitar({...guitar, pickups: e.target.value})} className="border p-2 rounded w-full">
                    <option value="">Select pickups</option>
                    {settings.pickups?.map(pickup => (
                      <option key={pickup} value={pickup}>{pickup}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block">Tremolo:</label>
                  <select name="trem" value={guitar?.trem} onChange={e => setCurrentGuitar({...guitar, trem: e.target.value})} className="border p-2 rounded w-full">
                    <option value="">Select tremolo</option>
                    {settings.tremolo?.map(trem => (
                      <option key={trem} value={trem}>{trem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block">Frets:</label>
                  <input type="number" name="frets" value={guitar?.frets} onChange={e => setCurrentGuitar({...guitar, frets: Number(e.target.value)})} className="border p-2 rounded w-full" />
                </div>

                <div>
                  <label className="block">Tuners:</label>
                  <input type="text" name="tuners" value={guitar?.tuners} onChange={e => setCurrentGuitar({...guitar, tuners: e.target.value})} className="border p-2 rounded w-full" />
                </div>

                <div>
                  <label className="block">Colour:</label>
                  <select name="colour" value={guitar?.colour} onChange={e => setCurrentGuitar({...guitar, colour: e.target.value})} className="border p-2 rounded w-full">
                    <option value="">Select a colour</option>
                    {settings.colours?.map(colour => (
                      <option key={colour} value={colour}>{colour}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block">Fretboard:</label>
                  <select name="fretboard" value={guitar?.fretboard} onChange={e => setCurrentGuitar({...guitar, fretboard: e.target.value})} className="border p-2 rounded w-full">
                    <option value="">Select fretboard material</option>
                    {settings.fretboard?.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block">Description:</label>
                  <textarea name="description" value={guitar?.description} onChange={e => setCurrentGuitar({...guitar, description: e.target.value})} className="border p-2 rounded w-full h-24"></textarea>
                </div>

                <div>
                  <label className="block">Thumbnail URL:</label>
                  <input type="text" name="thumbnail" value={guitar?.thumbnail} onChange={e => setCurrentGuitar({...guitar, thumbnail: e.target.value})} className="border p-2 rounded w-full" />
                </div>
                
                <div>
                  <button type="submit" onClick={update} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded cursor-pointer">
                    Save Changes
                  </button>
                  {saved ? <span className="text-green-500 p-2">Saved✓</span> : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGuitar;