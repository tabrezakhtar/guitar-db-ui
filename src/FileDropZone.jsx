import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useGuitarContext } from "./context/GuitarContext";

export default function FileDropZone() {
  const fileInputRef = useRef(null);
  const { currentGuitar, setCurrentGuitar, setFilesToUpload } = useGuitarContext();

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setCurrentGuitar({
      ...currentGuitar,
      images: [...(currentGuitar?.images || []), ...newFiles.map(f => f.url)]
    });

    setFilesToUpload(prevFiles => [...(prevFiles || []), ...newFiles]);
  }, [currentGuitar]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center w-full h-32 p-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 focus:outline-none"
    >
      <input {...getInputProps()} accept=".png, .jpg, .jpeg, .tiff, .bmp, .webp" ref={fileInputRef} />
      {
        isDragActive ? (
          <p className="text-blue-500">Drop the files here ...</p>
        ) : (
          <p className="text-gray-500">Drag 'n' drop some files here, or click to select files</p>
        )
      }
    </div>
  )
}
