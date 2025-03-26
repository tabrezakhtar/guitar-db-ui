import { useRef, useState, useEffect } from 'react';

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