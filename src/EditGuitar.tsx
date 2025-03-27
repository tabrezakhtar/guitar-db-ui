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
        </p>
      </div>
    </div>
  );
};

export default EditGuitar;